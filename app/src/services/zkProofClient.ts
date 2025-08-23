// Real ZK Proof Integration for Frontend
import { zkAPI } from './api';

export interface SkillProof {
  skills: Record<string, number>; // skill -> proficiency level
  region: string;
  expectedSalary: number;
}

export interface EligibilityProofResult {
  proof: any;
  publicInputs: string[];
  nullifierHash: string;
  privacyScore: number;
  eligible: boolean;
  proofHash: string;
  circuitId: string;
}

export class ZKProofClient {
  /**
   * Generate eligibility proof for job application
   */
  async generateEligibilityProof(
    jobId: string,
    applicantData: SkillProof,
    jobRequirements: {
      skillThresholds: Record<string, number>;
      salaryMin: number;
      salaryMax: number;
      allowedRegions: string[];
    }
  ): Promise<EligibilityProofResult> {
    try {
      console.log('🔐 Generating ZK proof for job application...');
      
      // Prepare proof inputs
      const proofData = {
        jobId,
        skills: applicantData.skills,
        region: applicantData.region,
        expectedSalary: applicantData.expectedSalary,
        skillThresholds: jobRequirements.skillThresholds,
        salaryMin: jobRequirements.salaryMin,
        salaryMax: jobRequirements.salaryMax,
        allowedRegions: jobRequirements.allowedRegions
      };

      // Generate proof via backend
      const result = await zkAPI.generateProof(proofData);
      
      console.log('✅ ZK proof generated successfully');
      return result;
    } catch (error) {
      console.error('❌ ZK proof generation failed:', error);
      throw new Error('Failed to generate privacy proof');
    }
  }

  /**
   * Verify a ZK proof
   */
  async verifyProof(
    proof: any,
    publicInputs: string[],
    jobId: string
  ): Promise<{ valid: boolean; eligible: boolean; error?: string }> {
    try {
      console.log('🔍 Verifying ZK proof...');
      
      const result = await zkAPI.verifyProof({
        proof,
        publicSignals: publicInputs,
        jobId,
        nullifierHash: publicInputs[1] // Assuming nullifier is second public input
      });
      
      console.log('✅ ZK proof verification completed');
      return result;
    } catch (error) {
      console.error('❌ ZK proof verification failed:', error);
      return {
        valid: false,
        eligible: false,
        error: 'Verification failed'
      };
    }
  }

  /**
   * Get available ZK circuits
   */
  async getAvailableCircuits() {
    try {
      const circuits = await zkAPI.getCircuits();
      return circuits;
    } catch (error) {
      console.error('Failed to fetch circuits:', error);
      return { circuits: [] };
    }
  }

  /**
   * Generate region membership proof
   */
  async generateRegionProof(
    userRegion: string,
    allowedRegions: string[]
  ): Promise<{ proof: any; merkleRoot: string; valid: boolean }> {
    try {
      const result = await zkAPI.getRegionProof(userRegion, allowedRegions);
      return result;
    } catch (error) {
      console.error('Region proof generation failed:', error);
      throw new Error('Failed to generate region proof');
    }
  }

  /**
   * Calculate privacy score for an application
   */
  calculatePrivacyScore(applicationData: SkillProof): number {
    // Privacy score calculation based on how much data is revealed
    let score = 100;
    
    // Reduce score based on data specificity
    const skillCount = Object.keys(applicationData.skills).length;
    score -= Math.min(skillCount * 2, 20); // Max 20 points for skills
    
    // Region specificity (less specific = higher privacy)
    if (applicationData.region.length > 2) score -= 10;
    
    // Salary specificity
    if (applicationData.expectedSalary % 10000 !== 0) score -= 5;
    
    return Math.max(score, 60); // Minimum 60% privacy score
  }

  /**
   * Client-side eligibility check before generating proof
   */
  checkEligibility(
    applicantSkills: Record<string, number>,
    jobRequirements: {
      skillThresholds: Record<string, number>;
      salaryMin: number;
      salaryMax: number;
      allowedRegions: string[];
    },
    applicantData: SkillProof
  ): { eligible: boolean; reasons: string[] } {
    const reasons: string[] = [];
    let eligible = true;

    // Check skills
    for (const [skill, required] of Object.entries(jobRequirements.skillThresholds)) {
      const userLevel = applicantSkills[skill] || 0;
      if (userLevel < required) {
        eligible = false;
        reasons.push(`${skill}: ${userLevel}% < ${required}% required`);
      }
    }

    // Check salary range
    if (applicantData.expectedSalary < jobRequirements.salaryMin ||
        applicantData.expectedSalary > jobRequirements.salaryMax) {
      eligible = false;
      reasons.push(
        `Salary ${applicantData.expectedSalary} outside range $${jobRequirements.salaryMin}-$${jobRequirements.salaryMax}`
      );
    }

    // Check region
    if (!jobRequirements.allowedRegions.includes(applicantData.region)) {
      eligible = false;
      reasons.push(`Region ${applicantData.region} not in allowed regions`);
    }

    return { eligible, reasons };
  }
}

export const zkProofClient = new ZKProofClient();
