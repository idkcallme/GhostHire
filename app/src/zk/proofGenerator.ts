import axios from 'axios';

export interface ProofInputs {
  jobId: number;
  skills: number[];
  skillThresholds: number[];
  region: string;
  regionMerklePath: string[];
  regionMerkleRoot: string;
  expectedSalary: number;
  salaryMin: number;
  salaryMax: number;
  applicantSecret: string;
}

export interface ProofResult {
  proof: string;
  nullifier: string;
  publicInputs: {
    jobId: number;
    thresholdsHash: string;
    regionRoot: string;
    salaryMin: number;
    salaryMax: number;
    nullifier: string;
    applicant: string;
  };
}

export class ProofGenerator {
  private proofServerUrl: string;

  constructor(proofServerUrl: string = 'http://localhost:8080') {
    this.proofServerUrl = proofServerUrl;
  }

  async generateEligibilityProof(inputs: ProofInputs): Promise<ProofResult> {
    try {
      // Mock proof generation for demo purposes
      // In a real implementation, this would call the actual proof server
      
      const nullifier = this.generateNullifier(inputs.applicantSecret, inputs.jobId);
      const thresholdsHash = this.hashThresholds(inputs.skillThresholds);
      
      // Simulate proof generation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock proof (in reality, this would be a real ZK proof)
      const mockProof = 'mock_proof_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      return {
        proof: mockProof,
        nullifier,
        publicInputs: {
          jobId: inputs.jobId,
          thresholdsHash,
          regionRoot: inputs.regionMerkleRoot,
          salaryMin: inputs.salaryMin,
          salaryMax: inputs.salaryMax,
          nullifier,
          applicant: '0x' + Array.from({ length: 40 }, () => 
            Math.floor(Math.random() * 16).toString(16)
          ).join('')
        }
      };
    } catch (error) {
      console.error('Error generating proof:', error);
      throw new Error('Failed to generate eligibility proof');
    }
  }

  buildRegionMerkleRoot(regions: string[]): string {
    // Mock Merkle root generation
    // In reality, this would build an actual Merkle tree
    const regionsString = regions.sort().join('');
    return '0x' + this.simpleHash(regionsString).substr(0, 64);
  }

  getMerklePath(region: string, allRegions: string[]): string[] {
    // Mock Merkle path generation
    // In reality, this would generate an actual Merkle inclusion proof
    return ['mock_path_1', 'mock_path_2', 'mock_path_3'];
  }

  generateNullifier(secret: string, jobId: number): string {
    // Generate a unique nullifier for this application
    const input = secret + jobId.toString() + Date.now().toString();
    return '0x' + this.simpleHash(input).substr(0, 64);
  }

  hashThresholds(thresholds: number[]): string {
    // Hash the skill thresholds
    const thresholdsString = thresholds.join(',');
    return '0x' + this.simpleHash(thresholdsString).substr(0, 64);
  }

  private simpleHash(input: string): string {
    // Simple hash function for demo purposes
    // In reality, this would use a proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}
