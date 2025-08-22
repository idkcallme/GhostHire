import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { ZKProofService } from '../services/zkProof';
import { NotificationService } from '../services/notification';

const router = express.Router();
const zkProofService = new ZKProofService();
const notificationService = new NotificationService();

// Validation schemas
const submitApplicationSchema = z.object({
  jobId: z.string(),
  zkProofHash: z.string(),
  zkPublicInputs: z.array(z.string()),
  nullifierHash: z.string(),
  eligibilityProof: z.object({
    proof: z.any(),
    publicSignals: z.array(z.string())
  }),
  privacyScore: z.number().min(0).max(100),
  dataRevealed: z.object({
    skills: z.array(z.string()).default([]),
    locationLevel: z.enum(['none', 'region', 'city', 'full']).default('none'),
    salaryRange: z.boolean().default(false)
  }).default({})
});

// Submit job application with ZK proof
router.post('/', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = submitApplicationSchema.parse(req.body);

  // Verify job exists and is active
  const job = await prisma.job.findUnique({
    where: { id: validatedData.jobId },
    include: {
      employer: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  if (!job) {
    throw createError('Job not found', 404);
  }

  if (job.status !== 'ACTIVE') {
    throw createError('Job is not accepting applications', 400);
  }

  // Check if user already applied (nullifier should prevent this)
  const existingApplication = await prisma.application.findFirst({
    where: {
      OR: [
        { nullifierHash: validatedData.nullifierHash },
        {
          jobId: validatedData.jobId,
          applicantId: req.user!.id
        }
      ]
    }
  });

  if (existingApplication) {
    throw createError('You have already applied to this job', 409);
  }

  // Verify the ZK proof
  const verificationResult = await zkProofService.verifyProof({
    proof: validatedData.eligibilityProof.proof,
    publicSignals: validatedData.eligibilityProof.publicSignals,
    jobData: job
  });

  if (!verificationResult.valid) {
    throw createError('Invalid ZK proof', 400);
  }

  if (!verificationResult.eligible) {
    throw createError('ZK proof shows ineligibility for this position', 400);
  }

  // Create application
  const application = await prisma.application.create({
    data: {
      jobId: validatedData.jobId,
      applicantId: req.user!.id,
      zkProofHash: validatedData.zkProofHash,
      zkPublicInputs: validatedData.zkPublicInputs,
      nullifierHash: validatedData.nullifierHash,
      eligibilityProof: validatedData.eligibilityProof,
      privacyScore: validatedData.privacyScore,
      dataRevealed: validatedData.dataRevealed,
      // Mock blockchain data
      transactionHash: generateMockTransactionHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
      gasUsed: `0.00${Math.floor(Math.random() * 999) + 100} ETH`
    },
    include: {
      job: {
        select: {
          title: true,
          company: true
        }
      }
    }
  });

  // Send notification to employer
  await notificationService.sendNotification({
    userId: job.employerId,
    type: 'APPLICATION_RECEIVED',
    title: 'New Privacy-Preserving Application',
    message: `Someone applied to your ${job.title} position with ${validatedData.privacyScore}% privacy preservation.`,
    data: {
      applicationId: application.id,
      jobId: job.id,
      privacyScore: validatedData.privacyScore
    }
  });

  // Track analytics
  await prisma.analytics.create({
    data: {
      event: 'application_submitted',
      data: {
        jobId: validatedData.jobId,
        privacyScore: validatedData.privacyScore,
        dataRevealedCount: Object.values(validatedData.dataRevealed).filter(Boolean).length,
        zkVerified: true
      },
      userId: req.user!.id
    }
  });

  res.status(201).json({
    message: 'Application submitted successfully',
    application: {
      id: application.id,
      transactionHash: application.transactionHash,
      privacyScore: application.privacyScore,
      submittedAt: application.createdAt
    }
  });
}));

// Get user's applications
router.get('/my', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where: any = {
    applicantId: req.user!.id
  };

  if (status) {
    where.status = status;
  }

  const [applications, totalCount] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: Number(limit),
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            salaryMin: true,
            salaryMax: true
          }
        }
      }
    }),
    prisma.application.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    applications,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalCount,
      totalPages,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    }
  });
}));

// Get applications for employer's jobs
router.get('/received', authenticateToken, requireRole('EMPLOYER'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { jobId, status, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  // Build where clause
  const where: any = {
    job: {
      employerId: req.user!.id
    }
  };

  if (jobId) {
    where.jobId = jobId;
  }

  if (status) {
    where.status = status;
  }

  const [applications, totalCount] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: Number(limit),
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        },
        applicant: {
          select: {
            id: true,
            username: true,
            avatar: true,
            privacyScore: true
          }
        }
      }
    }),
    prisma.application.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    applications,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalCount,
      totalPages,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    }
  });
}));

// Get single application details
router.get('/:id', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const application = await prisma.application.findUnique({
    where: { id: req.params.id },
    include: {
      job: {
        include: {
          employer: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true
            }
          }
        }
      },
      applicant: {
        select: {
          id: true,
          username: true,
          avatar: true,
          privacyScore: true
        }
      }
    }
  });

  if (!application) {
    throw createError('Application not found', 404);
  }

  // Check permissions
  const isApplicant = application.applicantId === req.user!.id;
  const isEmployer = application.job.employerId === req.user!.id;

  if (!isApplicant && !isEmployer) {
    throw createError('Unauthorized to view this application', 403);
  }

  res.json({ application });
}));

// Update application status (employers only)
router.put('/:id/status', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    status: z.enum(['REVIEWING', 'APPROVED', 'REJECTED']),
    reviewNotes: z.string().optional(),
    rejectionReason: z.string().optional()
  });

  const { status, reviewNotes, rejectionReason } = schema.parse(req.body);

  // Get application and verify employer ownership
  const application = await prisma.application.findUnique({
    where: { id: req.params.id },
    include: {
      job: {
        select: {
          employerId: true,
          title: true
        }
      },
      applicant: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });

  if (!application) {
    throw createError('Application not found', 404);
  }

  if (application.job.employerId !== req.user!.id) {
    throw createError('Unauthorized to update this application', 403);
  }

  // Update application
  const updatedApplication = await prisma.application.update({
    where: { id: req.params.id },
    data: {
      status,
      reviewNotes,
      rejectionReason,
      reviewedAt: new Date()
    }
  });

  // Send notification to applicant
  await notificationService.sendNotification({
    userId: application.applicant.id,
    type: 'APPLICATION_STATUS_CHANGE',
    title: `Application Status Updated`,
    message: `Your application for ${application.job.title} has been ${status.toLowerCase()}.`,
    data: {
      applicationId: application.id,
      status,
      reviewNotes,
      rejectionReason
    }
  });

  // Track analytics
  await prisma.analytics.create({
    data: {
      event: 'application_status_changed',
      data: {
        applicationId: application.id,
        oldStatus: application.status,
        newStatus: status,
        reviewTime: Date.now() - application.createdAt.getTime()
      },
      userId: req.user!.id
    }
  });

  res.json({
    message: 'Application status updated successfully',
    application: updatedApplication
  });
}));

// Withdraw application (applicants only)
router.delete('/:id', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const application = await prisma.application.findUnique({
    where: { id: req.params.id },
    select: {
      applicantId: true,
      status: true
    }
  });

  if (!application) {
    throw createError('Application not found', 404);
  }

  if (application.applicantId !== req.user!.id) {
    throw createError('Unauthorized to withdraw this application', 403);
  }

  if (application.status === 'APPROVED') {
    throw createError('Cannot withdraw an approved application', 400);
  }

  await prisma.application.update({
    where: { id: req.params.id },
    data: {
      status: 'WITHDRAWN'
    }
  });

  res.json({ message: 'Application withdrawn successfully' });
}));

// Get application statistics
router.get('/stats/overview', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id;
  const userRole = req.user!.role;

  if (userRole === 'APPLICANT') {
    // Stats for applicants
    const stats = await prisma.application.groupBy({
      by: ['status'],
      where: { applicantId: userId },
      _count: { id: true }
    });

    const privacyStats = await prisma.application.aggregate({
      where: { applicantId: userId },
      _avg: { privacyScore: true },
      _min: { privacyScore: true },
      _max: { privacyScore: true }
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      role: 'APPLICANT',
      applications: {
        total: stats.reduce((sum, stat) => sum + stat._count.id, 0),
        byStatus: statusCounts
      },
      privacy: {
        averageScore: privacyStats._avg.privacyScore || 0,
        minScore: privacyStats._min.privacyScore || 0,
        maxScore: privacyStats._max.privacyScore || 0
      }
    });
  } else {
    // Stats for employers
    const jobStats = await prisma.job.aggregate({
      where: { employerId: userId },
      _count: { id: true }
    });

    const applicationStats = await prisma.application.groupBy({
      by: ['status'],
      where: {
        job: {
          employerId: userId
        }
      },
      _count: { id: true }
    });

    const statusCounts = applicationStats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      role: 'EMPLOYER',
      jobs: {
        total: jobStats._count.id
      },
      applications: {
        total: applicationStats.reduce((sum, stat) => sum + stat._count.id, 0),
        byStatus: statusCounts
      }
    });
  }
}));

function generateMockTransactionHash(): string {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default router;
