import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';

const router = express.Router();

// Track analytics event
const trackEventSchema = z.object({
  event: z.string().min(1, 'Event name is required'),
  data: z.record(z.any()).default({}),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  page: z.string().optional(),
  referrer: z.string().optional()
});

// Track analytics event (public endpoint with rate limiting)
router.post('/track', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = trackEventSchema.parse(req.body);
  
  // Hash IP for privacy (store only hashed version)
  const crypto = require('crypto');
  const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex').substring(0, 16);
  
  await prisma.analytics.create({
    data: {
      event: validatedData.event,
      data: validatedData.data,
      userId: req.user?.id,
      sessionId: validatedData.sessionId,
      ipAddress: ipHash, // Store only hashed IP for privacy
      userAgent: validatedData.userAgent
    }
  });

  res.json({ message: 'Event tracked successfully' });
}));

// Get platform analytics (admin only)
router.get('/platform', authenticateToken, requireRole('ADMIN'), asyncHandler(async (req, res) => {
  const { startDate, endDate, interval = 'day' } = req.query;
  
  const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate as string) : new Date();

  // Overall platform metrics
  const [
    totalUsers,
    totalJobs,
    totalApplications,
    avgPrivacyScore,
    activeUsers,
    jobsPostedToday,
    applicationsToday
  ] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
    prisma.application.aggregate({ _avg: { privacyScore: true } }),
    prisma.user.count({
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    }),
    prisma.job.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    }),
    prisma.application.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    })
  ]);

  // Privacy analytics
  const privacyDistribution = await prisma.application.groupBy({
    by: ['privacyScore'],
    _count: { id: true },
    where: {
      createdAt: { gte: start, lte: end }
    }
  });

  // Job market analytics (simplified for SQLite)
  const jobs = await prisma.job.findMany({
    where: {
      createdAt: { gte: start, lte: end }
    },
    select: {
      skillRequirements: true
    }
  });

  // Process skills in JavaScript (SQLite doesn't support JSON functions like PostgreSQL)
  const skillCounts: Record<string, { count: number, totalThreshold: number }> = {};
  jobs.forEach(job => {
    const skills = job.skillRequirements as Record<string, number>;
    Object.entries(skills).forEach(([skill, threshold]) => {
      if (!skillCounts[skill]) {
        skillCounts[skill] = { count: 0, totalThreshold: 0 };
      }
      skillCounts[skill].count++;
      skillCounts[skill].totalThreshold += threshold;
    });
  });

  const jobsBySkill = Object.entries(skillCounts)
    .map(([skill, data]) => ({
      skill_key: skill,
      job_count: data.count,
      avg_threshold: data.totalThreshold / data.count
    }))
    .sort((a, b) => b.job_count - a.job_count)
    .slice(0, 10);

  // Application success rates
  const applicationStats = await prisma.application.groupBy({
    by: ['status'],
    _count: { id: true },
    where: {
      createdAt: { gte: start, lte: end }
    }
  });

  // Time series data (simplified for SQLite)
  const timeSeriesData = await Promise.all([
    prisma.user.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true }
    }),
    prisma.job.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true }
    }),
    prisma.application.findMany({
      where: { createdAt: { gte: start, lte: end } },
      select: { createdAt: true }
    })
  ]).then(([users, jobs, applications]) => {
    // Group by day for demo
    const dateGroups: Record<string, { new_users: number, new_jobs: number, new_applications: number }> = {};
    
    users.forEach(user => {
      const date = user.createdAt.toISOString().split('T')[0];
      if (!dateGroups[date]) dateGroups[date] = { new_users: 0, new_jobs: 0, new_applications: 0 };
      dateGroups[date].new_users++;
    });
    
    jobs.forEach(job => {
      const date = job.createdAt.toISOString().split('T')[0];
      if (!dateGroups[date]) dateGroups[date] = { new_users: 0, new_jobs: 0, new_applications: 0 };
      dateGroups[date].new_jobs++;
    });
    
    applications.forEach(app => {
      const date = app.createdAt.toISOString().split('T')[0];
      if (!dateGroups[date]) dateGroups[date] = { new_users: 0, new_jobs: 0, new_applications: 0 };
      dateGroups[date].new_applications++;
    });
    
    return Object.entries(dateGroups).map(([date, counts]) => ({
      date,
      ...counts
    })).sort((a, b) => a.date.localeCompare(b.date));
  });

  res.json({
    overview: {
      totalUsers,
      totalJobs,
      totalApplications,
      avgPrivacyScore: avgPrivacyScore._avg.privacyScore || 0,
      activeUsers,
      jobsPostedToday,
      applicationsToday
    },
    privacy: {
      averageScore: avgPrivacyScore._avg.privacyScore || 0,
      distribution: privacyDistribution.map(item => ({
        score: item.privacyScore,
        count: item._count.id
      }))
    },
    jobMarket: {
      topSkills: jobsBySkill,
      applicationStats: applicationStats.map(stat => ({
        status: stat.status,
        count: stat._count.id
      }))
    },
    timeSeries: timeSeriesData,
    dateRange: { start, end }
  });
}));

// Get privacy analytics
router.get('/privacy', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { period = '30d' } = req.query;
  
  let startDate: Date;
  switch (period) {
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  // Privacy score statistics
  const privacyStats = await prisma.application.aggregate({
    _avg: { privacyScore: true },
    _min: { privacyScore: true },
    _max: { privacyScore: true },
    _count: { id: true },
    where: {
      createdAt: { gte: startDate }
    }
  });

  // Privacy score distribution
  const scoreRanges = [
    { min: 0, max: 50, label: 'Low Privacy (0-50%)' },
    { min: 51, max: 70, label: 'Medium Privacy (51-70%)' },
    { min: 71, max: 85, label: 'High Privacy (71-85%)' },
    { min: 86, max: 100, label: 'Maximum Privacy (86-100%)' }
  ];

  const distributionPromises = scoreRanges.map(range =>
    prisma.application.count({
      where: {
        privacyScore: { gte: range.min, lte: range.max },
        createdAt: { gte: startDate }
      }
    }).then(count => ({ ...range, count }))
  );

  const distribution = await Promise.all(distributionPromises);

  // Data revelation patterns
  const dataRevealedStats = await prisma.application.groupBy({
    by: ['dataRevealed'],
    _count: { id: true },
    where: {
      createdAt: { gte: startDate }
    }
  });

  // ZK proof verification stats
  const zkStats = await prisma.application.aggregate({
    _count: {
      zkProofHash: true // Count applications with ZK proofs
    },
    where: {
      createdAt: { gte: startDate }
    }
  });

  res.json({
    period,
    overview: {
      totalApplications: privacyStats._count.id,
      averagePrivacyScore: privacyStats._avg.privacyScore || 0,
      minPrivacyScore: privacyStats._min.privacyScore || 0,
      maxPrivacyScore: privacyStats._max.privacyScore || 0,
      zkProofCount: zkStats._count.zkProofHash
    },
    distribution,
    dataRevealed: dataRevealedStats.map(stat => ({
      pattern: stat.dataRevealed,
      count: stat._count.id
    }))
  });
}));

// Get job market insights
router.get('/job-market', asyncHandler(async (req, res) => {
  const { period = '30d', skills, regions } = req.query;
  
  let startDate: Date;
  switch (period) {
    case '7d':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  // Most in-demand skills (SQLite compatible)
  const activeJobs = await prisma.job.findMany({
    where: {
      createdAt: { gte: startDate },
      status: 'ACTIVE'
    },
    select: {
      skillRequirements: true
    }
  });

  const skillDemandMap: Record<string, { count: number, thresholds: number[] }> = {};
  activeJobs.forEach(job => {
    const skills = job.skillRequirements as Record<string, number>;
    Object.entries(skills).forEach(([skill, threshold]) => {
      if (threshold > 0) {
        if (!skillDemandMap[skill]) {
          skillDemandMap[skill] = { count: 0, thresholds: [] };
        }
        skillDemandMap[skill].count++;
        skillDemandMap[skill].thresholds.push(threshold);
      }
    });
  });

  const skillDemand = Object.entries(skillDemandMap)
    .map(([skill, data]) => ({
      skill_key: skill,
      demand_count: data.count,
      avg_threshold: data.thresholds.reduce((a, b) => a + b, 0) / data.thresholds.length,
      min_threshold: Math.min(...data.thresholds),
      max_threshold: Math.max(...data.thresholds)
    }))
    .sort((a, b) => b.demand_count - a.demand_count)
    .slice(0, 15);

  // Salary insights
  const salaryStats = await prisma.job.aggregate({
    _avg: { salaryMin: true, salaryMax: true },
    _min: { salaryMin: true },
    _max: { salaryMax: true },
    where: {
      createdAt: { gte: startDate },
      status: 'ACTIVE'
    }
  });

  // Salary distribution by experience level
  const salaryByExperience = await prisma.job.groupBy({
    by: ['experience'],
    _avg: { salaryMin: true, salaryMax: true },
    _count: { id: true },
    where: {
      createdAt: { gte: startDate },
      status: 'ACTIVE',
      experience: { not: null }
    }
  });

  // Geographic distribution (SQLite compatible)
  const jobsWithRegions = await prisma.job.findMany({
    where: {
      createdAt: { gte: startDate },
      status: 'ACTIVE'
    },
    select: {
      allowedRegions: true
    }
  });

  const regionCounts: Record<string, number> = {};
  jobsWithRegions.forEach(job => {
    job.allowedRegions.forEach(region => {
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
  });

  const regionDemand = Object.entries(regionCounts)
    .map(([region, job_count]) => ({ region, job_count }))
    .sort((a, b) => b.job_count - a.job_count)
    .slice(0, 10);

  // Remote work trends
  const remoteStats = await prisma.job.groupBy({
    by: ['remote'],
    _count: { id: true },
    where: {
      createdAt: { gte: startDate },
      status: 'ACTIVE'
    }
  });

  // Application competition
  const competitionStats = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      company: true,
      _count: {
        select: {
          applications: true
        }
      }
    },
    where: {
      createdAt: { gte: startDate },
      status: 'ACTIVE'
    },
    orderBy: {
      applications: {
        _count: 'desc'
      }
    },
    take: 10
  });

  res.json({
    period,
    skills: {
      mostDemanded: skillDemand,
      filters: skills ? JSON.parse(skills as string) : null
    },
    salary: {
      overview: {
        avgMin: salaryStats._avg.salaryMin || 0,
        avgMax: salaryStats._avg.salaryMax || 0,
        min: salaryStats._min.salaryMin || 0,
        max: salaryStats._max.salaryMax || 0
      },
      byExperience: salaryByExperience.map(item => ({
        experience: item.experience,
        avgMin: item._avg.salaryMin || 0,
        avgMax: item._avg.salaryMax || 0,
        jobCount: item._count.id
      }))
    },
    geography: {
      regions: regionDemand,
      remoteWork: remoteStats.map(stat => ({
        remote: stat.remote,
        count: stat._count.id
      }))
    },
    competition: {
      mostCompetitive: competitionStats.map(job => ({
        jobId: job.id,
        title: job.title,
        company: job.company,
        applicationCount: job._count.applications
      }))
    }
  });
}));

// Get user analytics (for the authenticated user)
router.get('/my-stats', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  
  if (req.user!.role === 'APPLICANT') {
    // Applicant analytics
    const [
      applicationStats,
      privacyStats,
      activityStats
    ] = await Promise.all([
      prisma.application.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { applicantId: userId }
      }),
      prisma.application.aggregate({
        _avg: { privacyScore: true },
        _min: { privacyScore: true },
        _max: { privacyScore: true },
        where: { applicantId: userId }
      }),
      prisma.analytics.count({
        where: { userId, event: { in: ['job_viewed', 'application_started', 'proof_generated'] } }
      })
    ]);

    // Recent applications
    const recentApplications = await prisma.application.findMany({
      where: { applicantId: userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        job: {
          select: {
            title: true,
            company: true
          }
        }
      }
    });

    res.json({
      role: 'APPLICANT',
      applications: {
        total: applicationStats.reduce((sum, stat) => sum + stat._count.id, 0),
        byStatus: applicationStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      privacy: {
        averageScore: privacyStats._avg.privacyScore || 0,
        bestScore: privacyStats._max.privacyScore || 0,
        lowestScore: privacyStats._min.privacyScore || 0
      },
      activity: {
        totalActions: activityStats
      },
      recent: recentApplications.map(app => ({
        id: app.id,
        jobTitle: app.job.title,
        company: app.job.company,
        status: app.status,
        privacyScore: app.privacyScore,
        submittedAt: app.createdAt
      }))
    });
  } else {
    // Employer analytics
    const [
      jobStats,
      applicationStats,
      performanceStats
    ] = await Promise.all([
      prisma.job.groupBy({
        by: ['status'],
        _count: { id: true },
        where: { employerId: userId }
      }),
      prisma.application.count({
        where: {
          job: { employerId: userId }
        }
      }),
      prisma.job.findMany({
        where: { employerId: userId },
        select: {
          id: true,
          title: true,
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: {
          applications: {
            _count: 'desc'
          }
        },
        take: 5
      })
    ]);

    res.json({
      role: 'EMPLOYER',
      jobs: {
        total: jobStats.reduce((sum, stat) => sum + stat._count.id, 0),
        byStatus: jobStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      applications: {
        total: applicationStats
      },
      performance: {
        topJobs: performanceStats.map(job => ({
          id: job.id,
          title: job.title,
          applicationCount: job._count.applications
        }))
      }
    });
  }
}));

export default router;
