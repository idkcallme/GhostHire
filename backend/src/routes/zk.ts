import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { ZKProofService } from '../services/zkProof';

const router = express.Router();

// Initialize ZK proof service
const zkProofService = new ZKProofService();

// Validation schemas
const generateProofSchema = z.object({
  // Private inputs (never stored on server)
  skills: z.record(z.number().min(0).max(100)), // skill -> proficiency
  region: z.string(),
  expectedSalary: z.number().positive(),
  
  // Public inputs
  jobId: z.string(),
  skillThresholds: z.record(z.number().min(0).max(100)), // skill -> required threshold
  salaryMin: z.number().positive(),
  salaryMax: z.number().positive(),
  allowedRegions: z.array(z.string()),
  
  // Nullifier generation
  applicantId: z.string(),
});

const verifyProofSchema = z.object({
  proof: z.object({
    pi_a: z.array(z.string()),
    pi_b: z.array(z.array(z.string())),
    pi_c: z.array(z.string()),
    protocol: z.string(),
    curve: z.string()
  }),
  publicSignals: z.array(z.string()),
  jobId: z.string(),
  nullifierHash: z.string()
});

// Get available ZK circuits
router.get('/circuits', asyncHandler(async (req, res) => {
  const circuits = await prisma.zKCircuit.findMany({
    where: { active: true },
    select: {
      id: true,
      name: true,
      version: true,
      description: true,
      inputSchema: true,
      outputSchema: true,
      constraints: true
    }
  });

  res.json({ circuits });
}));

// Generate ZK proof for job application
router.post('/generate-proof', asyncHandler(async (req, res) => {
  const data = generateProofSchema.parse(req.body);

  try {
    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      select: { 
        id: true, 
        skillRequirements: true, 
        salaryMin: true, 
        salaryMax: true,
        allowedRegions: true,
        regionMerkleRoot: true
      }
    });

    if (!job) {
      throw createError('Job not found', 404);
    }

    // Verify the provided public inputs match the job
    if (job.salaryMin !== data.salaryMin || job.salaryMax !== data.salaryMax) {
      throw createError('Salary range mismatch', 400);
    }

    // Generate nullifier hash (prevents duplicate applications)
    const nullifierHash = await zkProofService.generateNullifier(data.applicantId, data.jobId);

    // Check if this nullifier already exists (duplicate application)
    const existingApplication = await prisma.application.findUnique({
      where: { nullifierHash }
    });

    if (existingApplication) {
      throw createError('You have already applied to this job', 409);
    }

    // Verify eligibility locally before generating proof
    const eligibilityCheck = zkProofService.checkEligibility({
      skills: data.skills,
      region: data.region,
      expectedSalary: data.expectedSalary,
      skillThresholds: data.skillThresholds,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      allowedRegions: data.allowedRegions
    });

    if (!eligibilityCheck.eligible) {
      return res.status(400).json({
        error: 'Not eligible for this position',
        reasons: eligibilityCheck.reasons
      });
    }

    // Generate the actual ZK proof
    const proofResult = await zkProofService.generateEligibilityProof({
      // Private inputs
      skills: data.skills,
      region: data.region,
      expectedSalary: data.expectedSalary,
      
      // Public inputs
      jobId: data.jobId,
      skillThresholds: data.skillThresholds,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      regionMerkleRoot: job.regionMerkleRoot,
      nullifierHash
    });

    // Calculate privacy score
    const privacyScore = zkProofService.calculatePrivacyScore({
      skillsRevealed: 0, // No exact skills revealed
      locationRevealed: 0, // Only region membership proven
      salaryRevealed: 0, // Only range compatibility proven
      hasNullifier: true
    });

    res.json({
      proof: proofResult.proof,
      publicInputs: proofResult.publicInputs,
      nullifierHash,
      privacyScore,
      eligible: true,
      proofHash: proofResult.proofHash,
      circuitId: proofResult.circuitId
    });

  } catch (error) {
    console.error('ZK proof generation failed:', error);
    throw createError('Failed to generate ZK proof', 500);
  }
}));

// Verify ZK proof
router.post('/verify-proof', asyncHandler(async (req, res) => {
  const data = verifyProofSchema.parse(req.body);

  try {
    // Get job data for verification
    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
      select: { 
        skillRequirements: true,
        salaryMin: true,
        salaryMax: true,
        regionMerkleRoot: true
      }
    });

    if (!job) {
      throw createError('Job not found', 404);
    }

    // Verify the proof
    const verificationResult = await zkProofService.verifyProof({
      proof: data.proof,
      publicSignals: data.publicSignals,
      jobData: job
    });

    if (!verificationResult.valid) {
      return res.status(400).json({
        valid: false,
        error: 'Proof verification failed',
        details: verificationResult.error
      });
    }

    res.json({
      valid: true,
      eligible: verificationResult.eligible,
      nullifierHash: data.nullifierHash,
      verifiedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('ZK proof verification failed:', error);
    throw createError('Failed to verify ZK proof', 500);
  }
}));

// Get proof statistics
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await prisma.application.aggregate({
    _count: { id: true },
    _avg: { privacyScore: true }
  });

  const circuitStats = await prisma.zKCircuit.findMany({
    select: {
      name: true,
      version: true,
      constraints: true
    }
  });

  res.json({
    totalProofs: stats._count.id,
    averagePrivacyScore: stats._avg.privacyScore || 0,
    circuits: circuitStats
  });
}));

// Get region Merkle proof for a specific region
router.post('/region-proof', asyncHandler(async (req, res) => {
  const schema = z.object({
    region: z.string(),
    allowedRegions: z.array(z.string())
  });

  const { region, allowedRegions } = schema.parse(req.body);

  try {
    const merkleProof = zkProofService.generateRegionMerkleProof(region, allowedRegions);
    
    res.json({
      proof: merkleProof.proof,
      merkleRoot: merkleProof.root,
      leafIndex: merkleProof.leafIndex,
      valid: merkleProof.valid
    });
  } catch (error) {
    throw createError('Failed to generate region proof', 400);
  }
}));

export default router;
