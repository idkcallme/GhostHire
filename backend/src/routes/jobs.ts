import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthenticatedRequest, optionalAuth, requireRole } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const createJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().min(1, 'Company is required'),
  skillRequirements: z.record(z.number().min(0).max(100)), // skill -> threshold mapping
  salaryMin: z.number().positive('Minimum salary must be positive'),
  salaryMax: z.number().positive('Maximum salary must be positive'),
  allowedRegions: z.array(z.string()).min(1, 'At least one region is required'),
  tags: z.array(z.string()).default([]),
  remote: z.boolean().default(false),
  experience: z.enum(['JUNIOR', 'MID', 'SENIOR']).optional(),
  department: z.string().optional(),
  deadline: z.string().datetime().optional(),
}).refine(data => data.salaryMax >= data.salaryMin, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["salaryMax"]
});

const updateJobSchema = createJobSchema.partial();

const searchJobsSchema = z.object({
  q: z.string().optional(), // Search query
  skills: z.array(z.string()).optional(), // Required skills
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  regions: z.array(z.string()).optional(),
  remote: z.boolean().optional(),
  experience: z.enum(['JUNIOR', 'MID', 'SENIOR']).optional(),
  department: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CLOSED']).optional(),
  sortBy: z.enum(['createdAt', 'salaryMin', 'salaryMax', 'title', 'relevance']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Get all jobs with advanced filtering and search
router.get('/', optionalAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const params = searchJobsSchema.parse({
    ...req.query,
    skills: req.query.skills ? JSON.parse(req.query.skills as string) : undefined,
    regions: req.query.regions ? JSON.parse(req.query.regions as string) : undefined,
    tags: req.query.tags ? JSON.parse(req.query.tags as string) : undefined,
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
    salaryMin: req.query.salaryMin ? parseInt(req.query.salaryMin as string) : undefined,
    salaryMax: req.query.salaryMax ? parseInt(req.query.salaryMax as string) : undefined,
  });

  const offset = (params.page - 1) * params.limit;

  // Build where clause
  const where: any = {
    status: params.status || 'ACTIVE',
  };

  // Text search
  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } },
      { company: { contains: params.q, mode: 'insensitive' } },
      { tags: { hasSome: [params.q] } },
    ];
  }

  // Salary filtering
  if (params.salaryMin) {
    where.salaryMax = { gte: params.salaryMin };
  }
  if (params.salaryMax) {
    where.salaryMin = { lte: params.salaryMax };
  }

  // Region filtering
  if (params.regions && params.regions.length > 0) {
    where.allowedRegions = { hasSome: params.regions };
  }

  // Remote work filtering
  if (params.remote !== undefined) {
    where.remote = params.remote;
  }

  // Experience level filtering
  if (params.experience) {
    where.experience = params.experience;
  }

  // Department filtering
  if (params.department) {
    where.department = params.department;
  }

  // Tags filtering
  if (params.tags && params.tags.length > 0) {
    where.tags = { hasSome: params.tags };
  }

  // Skills filtering (jobs that require ANY of the specified skills)
  if (params.skills && params.skills.length > 0) {
    where.skillRequirements = {
      path: params.skills,
      array_contains: params.skills
    };
  }

  // Build order by clause
  let orderBy: any = {};
  if (params.sortBy === 'relevance' && params.q) {
    // For relevance sorting, we'll use a simple approach
    // In production, you might want to use full-text search with weights
    orderBy = [
      { createdAt: 'desc' }
    ];
  } else {
    orderBy[params.sortBy] = params.sortOrder;
  }

  // Execute query
  const [jobs, totalCount] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: offset,
      take: params.limit,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    }),
    prisma.job.count({ where })
  ]);

  // Calculate relevance scores if needed
  const jobsWithRelevance = jobs.map(job => {
    let relevanceScore = 1;
    
    if (params.q) {
      const query = params.q.toLowerCase();
      const title = job.title.toLowerCase();
      const description = job.description.toLowerCase();
      
      // Simple relevance scoring
      if (title.includes(query)) relevanceScore += 3;
      if (description.includes(query)) relevanceScore += 1;
      if (job.tags.some(tag => tag.toLowerCase().includes(query))) relevanceScore += 2;
    }

    return {
      ...job,
      relevanceScore,
      applicantCount: job._count.applications
    };
  });

  // Sort by relevance if requested
  if (params.sortBy === 'relevance') {
    jobsWithRelevance.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  const totalPages = Math.ceil(totalCount / params.limit);

  res.json({
    jobs: jobsWithRelevance,
    pagination: {
      page: params.page,
      limit: params.limit,
      totalCount,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPrevPage: params.page > 1
    },
    filters: {
      q: params.q,
      skills: params.skills,
      salaryMin: params.salaryMin,
      salaryMax: params.salaryMax,
      regions: params.regions,
      remote: params.remote,
      experience: params.experience,
      department: params.department,
      tags: params.tags,
      status: params.status
    }
  });
}));

// Get single job by ID
router.get('/:id', optionalAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const job = await prisma.job.findUnique({
    where: { id: req.params.id },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          createdAt: true
        }
      },
      _count: {
        select: {
          applications: true
        }
      }
    }
  });

  if (!job) {
    throw createError('Job not found', 404);
  }

  // If user is authenticated, check if they've already applied
  let hasApplied = false;
  if (req.user) {
    const application = await prisma.application.findFirst({
      where: {
        jobId: job.id,
        applicantId: req.user.id
      }
    });
    hasApplied = !!application;
  }

  res.json({
    ...job,
    applicantCount: job._count.applications,
    hasApplied
  });
}));

// Create new job (employers only)
router.post('/', authenticateToken, requireRole('EMPLOYER'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = createJobSchema.parse(req.body);

  // Generate region Merkle root (simplified for demo)
  const regionMerkleRoot = generateRegionMerkleRoot(validatedData.allowedRegions);

  const job = await prisma.job.create({
    data: {
      ...validatedData,
      regionMerkleRoot,
      employerId: req.user!.id,
      publishedAt: new Date(),
      // Mock blockchain data
      transactionHash: generateMockTransactionHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
    },
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
  });

  // Track analytics
  await prisma.analytics.create({
    data: {
      event: 'job_posted',
      data: {
        jobId: job.id,
        company: job.company,
        salaryRange: `${job.salaryMin}-${job.salaryMax}`,
        skillsCount: Object.keys(validatedData.skillRequirements).length,
        regionsCount: validatedData.allowedRegions.length
      },
      userId: req.user!.id
    }
  });

  res.status(201).json({
    message: 'Job created successfully',
    job
  });
}));

// Update job (job owner only)
router.put('/:id', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = updateJobSchema.parse(req.body);

  // Check if job exists and user owns it
  const existingJob = await prisma.job.findUnique({
    where: { id: req.params.id },
    select: { employerId: true, allowedRegions: true }
  });

  if (!existingJob) {
    throw createError('Job not found', 404);
  }

  if (existingJob.employerId !== req.user!.id) {
    throw createError('Unauthorized to update this job', 403);
  }

  // Regenerate Merkle root if regions changed
  let regionMerkleRoot = undefined;
  if (validatedData.allowedRegions) {
    regionMerkleRoot = generateRegionMerkleRoot(validatedData.allowedRegions);
  }

  const updatedJob = await prisma.job.update({
    where: { id: req.params.id },
    data: {
      ...validatedData,
      ...(regionMerkleRoot && { regionMerkleRoot })
    },
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
  });

  res.json({
    message: 'Job updated successfully',
    job: updatedJob
  });
}));

// Delete job (job owner only)
router.delete('/:id', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  // Check if job exists and user owns it
  const existingJob = await prisma.job.findUnique({
    where: { id: req.params.id },
    select: { employerId: true }
  });

  if (!existingJob) {
    throw createError('Job not found', 404);
  }

  if (existingJob.employerId !== req.user!.id) {
    throw createError('Unauthorized to delete this job', 403);
  }

  await prisma.job.delete({
    where: { id: req.params.id }
  });

  res.json({ message: 'Job deleted successfully' });
}));

// Get jobs posted by current user (employers only)
router.get('/my/posted', authenticateToken, requireRole('EMPLOYER'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const jobs = await prisma.job.findMany({
    where: { employerId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          applications: true
        }
      }
    }
  });

  res.json({ jobs });
}));

// Helper functions
function generateRegionMerkleRoot(regions: string[]): string {
  // Simplified Merkle root generation for demo
  // In production, use a proper Merkle tree implementation
  const sorted = regions.sort();
  const combined = sorted.join('|');
  
  // Simple hash simulation
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
}

function generateMockTransactionHash(): string {
  return '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default router;
