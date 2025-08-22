import axios from 'axios';
import { 
  MidnightHttpClientProofProvider,
  MidnightNodeClient,
  CompactRuntime,
  WalletAPI,
  TransactionResult,
  ProofData
} from '../types/midnight-mock';

// Midnight Network configuration
const MIDNIGHT_CONFIG = {
  rpcUrl: import.meta.env.VITE_MIDNIGHT_RPC_URL || 'http://localhost:6565',
  networkId: import.meta.env.VITE_MIDNIGHT_NETWORK_ID || 'midnight-testnet',
  proofProviderUrl: import.meta.env.VITE_PROOF_PROVIDER_URL || 'http://localhost:6565',
  contractAddress: import.meta.env.VITE_JOB_BOARD_CONTRACT_ADDRESS || '',
  network: import.meta.env.VITE_MIDNIGHT_NETWORK || 'local'
};

export interface MidnightWalletInfo {
  address: string;
  balance: { amount: number; denom: string };
  connected: boolean;
}

export interface JobPostingData {
  title: string;
  description: string;
  skillThresholds: Record<string, number>;
  salaryMin: number;
  salaryMax: number;
  allowedRegions: string[];
}

export interface ZKApplicationData {
  jobId: string;
  skills: Record<string, number>;
  region: string;
  expectedSalary: number;
}

export interface EligibilityProof {
  proof: ProofData;
  publicInputs: string[];
  jobId: string;
  nullifier: string;
  eligible: string;
  timestamp: string;
}

export class MidnightClient {
  private wallet: WalletAPI | null = null;
  private nodeClient: MidnightNodeClient | null = null;
  private proofProvider: MidnightHttpClientProofProvider | null = null;
  private contractRuntime: CompactRuntime | null = null;
  private isInitialized = false;
  private isDevelopmentMode = false;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient() {
    try {
      console.log('🌙 Initializing Midnight Network client...');
      
      // Check if we're in development mode (no actual Midnight network)
      this.isDevelopmentMode = !MIDNIGHT_CONFIG.contractAddress || 
                                MIDNIGHT_CONFIG.network === 'local';

      if (!this.isDevelopmentMode) {
        // Initialize real Midnight client
        this.nodeClient = new MidnightNodeClient({
          rpcUrl: MIDNIGHT_CONFIG.rpcUrl,
          networkId: MIDNIGHT_CONFIG.networkId
        });

        // Initialize proof provider
        this.proofProvider = new MidnightHttpClientProofProvider({
          url: MIDNIGHT_CONFIG.proofProviderUrl
        });

        // Initialize contract runtime
        this.contractRuntime = new CompactRuntime(this.nodeClient);

        // Test connection
        const status = await this.nodeClient.getStatus();
        console.log('✅ Connected to Midnight Network:', status);
      } else {
        console.log('🔧 Running in development mode - using mock implementations');
      }
      
      this.isInitialized = true;
      console.log('✅ Midnight client initialized');
    } catch (error) {
      console.warn('⚠️ Midnight client initialization failed, falling back to development mode:', error);
      this.isDevelopmentMode = true;
      this.isInitialized = true;
    }
  }

  /**
   * Connect to Midnight wallet
   */
  async connectWallet(): Promise<MidnightWalletInfo> {
    try {
      console.log('🔗 Connecting to Midnight wallet...');
      
      if (!this.isDevelopmentMode && typeof window !== 'undefined' && (window as any).midnight) {
        // Connect to actual Midnight wallet
        const midnightWallet = (window as any).midnight as WalletAPI;
        const accounts = await midnightWallet.request({ method: 'midnight_requestAccounts' });
        const balance = await midnightWallet.request({ 
          method: 'midnight_getBalance', 
          params: [accounts[0]] 
        });

        this.wallet = midnightWallet;
        
        return {
          address: accounts[0],
          balance: { amount: parseInt(balance.amount), denom: balance.denom || 'DUST' },
          connected: true
        };
      } else {
        // Simulate wallet connection for development
        console.log('🔧 Using simulated Midnight wallet...');
        
        const mockAddress = 'midnight1' + Math.random().toString(36).substr(2, 39);
        const mockBalance = Math.floor(Math.random() * 1000000) + 100000;
        
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          address: mockAddress,
          balance: { amount: mockBalance, denom: 'DUST' },
          connected: true
        };
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error('Failed to connect to Midnight wallet. Please ensure the Midnight wallet extension is installed and unlocked.');
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    this.wallet = null;
    console.log('🔌 Wallet disconnected');
  }

  /**
   * Post a job to the Midnight network
   */
  async postJob(jobData: JobPostingData): Promise<{ success: boolean; jobId?: string; transactionHash?: string }> {
    try {
      console.log('📝 Posting job to Midnight Network...');
      
      if (!this.isDevelopmentMode && this.wallet && this.contractRuntime && MIDNIGHT_CONFIG.contractAddress) {
        // Real Midnight network interaction
        const regionMerkleRoot = this.generateRegionMerkleRoot(jobData.allowedRegions);
        
        const transaction = await this.contractRuntime.createContractTransaction({
          contractAddress: MIDNIGHT_CONFIG.contractAddress,
          method: 'postJob',
          args: [
            jobData.title,
            jobData.description,
            jobData.skillThresholds,
            jobData.salaryMin,
            jobData.salaryMax,
            jobData.allowedRegions,
            regionMerkleRoot
          ]
        });

        const signedTx = await this.wallet.signTransaction(transaction);
        const result: TransactionResult = await this.nodeClient!.submitTransaction(signedTx);

        console.log('✅ Job posted to Midnight Network');
        
        return {
          success: true,
          jobId: result.returnValue.toString(),
          transactionHash: result.transactionHash
        };
      } else {
        // Simulate job posting for development
        console.log('🔧 Simulating job posting...');
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const mockJobId = 'job_' + Date.now();
        const mockTxHash = '0x' + Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        console.log('✅ Mock job posting successful');
        
        return {
          success: true,
          jobId: mockJobId,
          transactionHash: mockTxHash
        };
      }
    } catch (error) {
      console.error('Job posting failed:', error);
      return { success: false };
    }
  }

  /**
   * Submit ZK proof application
   */
  async submitApplication(applicationData: ZKApplicationData): Promise<{
    success: boolean;
    applicationId?: string;
    transactionHash?: string;
    privacyScore?: number;
  }> {
    try {
      console.log('🔐 Submitting ZK proof application...');
      
      // Generate ZK proof of eligibility
      const eligibilityProof = await this.generateEligibilityProof(applicationData);
      
      if (!eligibilityProof.eligible || eligibilityProof.eligible !== '1') {
        throw new Error('Not eligible for this position based on ZK proof verification');
      }

      if (!this.isDevelopmentMode && this.wallet && this.contractRuntime && MIDNIGHT_CONFIG.contractAddress) {
        // Submit to real Midnight network
        const transaction = await this.contractRuntime.createContractTransaction({
          contractAddress: MIDNIGHT_CONFIG.contractAddress,
          method: 'submitApplication',
          args: [
            parseInt(applicationData.jobId.replace('job_', '')),
            {
              proof: eligibilityProof.proof,
              publicInputs: eligibilityProof.publicInputs,
              jobId: eligibilityProof.jobId,
              nullifier: eligibilityProof.nullifier,
              eligible: eligibilityProof.eligible,
              timestamp: eligibilityProof.timestamp
            },
            Math.floor(Math.random() * 21) + 80 // Privacy score 80-100
          ]
        });

        const signedTx = await this.wallet.signTransaction(transaction);
        const result: TransactionResult = await this.nodeClient!.submitTransaction(signedTx);

        console.log('✅ Application submitted to Midnight Network');
        
        return {
          success: true,
          applicationId: result.returnValue.toString(),
          transactionHash: result.transactionHash,
          privacyScore: 95
        };
      } else {
        // Simulate application submission
        console.log('🔧 Simulating application submission...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockAppId = 'app_' + Date.now();
        const mockTxHash = '0x' + Array.from({length: 64}, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        console.log('✅ Mock application submission successful');
        
        return {
          success: true,
          applicationId: mockAppId,
          transactionHash: mockTxHash,
          privacyScore: Math.floor(Math.random() * 21) + 80
        };
      }
    } catch (error) {
      console.error('Application submission failed:', error);
      throw error;
    }
  }

  /**
   * Generate ZK proof of eligibility using Midnight's proof provider
   */
  private async generateEligibilityProof(applicationData: ZKApplicationData): Promise<EligibilityProof> {
    try {
      if (!this.isDevelopmentMode && this.proofProvider) {
        // Use real Midnight proof provider
        console.log('🔐 Generating ZK proof with Midnight proof provider...');
        
        // Fetch job details to get requirements
        const job = await this.getJob(applicationData.jobId);
        if (!job) {
          throw new Error('Job not found');
        }

        // Prepare inputs for ZK circuit
        const proofInputs = {
          // Private inputs (not revealed)
          applicantSkills: applicationData.skills,
          applicantRegion: applicationData.region,
          applicantSalary: applicationData.expectedSalary,
          applicantId: await this.getWalletAddress(),
          
          // Public inputs (revealed in proof)
          jobId: applicationData.jobId.replace('job_', ''),
          jobSkillThresholds: job.skillThresholds,
          jobSalaryMin: job.salaryMin,
          jobSalaryMax: job.salaryMax,
          jobAllowedRegions: job.allowedRegions,
          
          // Generate nullifier to prevent double applications
          nullifier: this.generateNullifier(applicationData.jobId, await this.getWalletAddress()),
          timestamp: Math.floor(Date.now() / 1000)
        };

        const proof = await this.proofProvider.generateProof({
          circuitName: 'eligibility',
          inputs: proofInputs
        });

        return {
          proof: proof.proof,
          publicInputs: proof.publicInputs,
          jobId: proofInputs.jobId,
          nullifier: proofInputs.nullifier,
          eligible: proof.publicInputs[2], // Index 2 should be the eligible flag
          timestamp: proofInputs.timestamp.toString()
        };
      } else {
        // Generate mock proof for development
        console.log('🔧 Generating mock ZK proof...');
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockNullifier = this.generateNullifier(applicationData.jobId, 'mock-applicant-id');
        const timestamp = Math.floor(Date.now() / 1000);
        
        // Mock eligibility check
        const isEligible = this.checkMockEligibility(applicationData);
        
        return {
          proof: {
            a: ['0x123...', '0x456...'],
            b: [['0x789...', '0xabc...'], ['0xdef...', '0x012...']],
            c: ['0x345...', '0x678...']
          } as ProofData,
          publicInputs: [
            applicationData.jobId.replace('job_', ''),
            mockNullifier,
            isEligible ? '1' : '0',
            timestamp.toString()
          ],
          jobId: applicationData.jobId.replace('job_', ''),
          nullifier: mockNullifier,
          eligible: isEligible ? '1' : '0',
          timestamp: timestamp.toString()
        };
      }
    } catch (error) {
      console.error('Proof generation failed:', error);
      throw new Error('Failed to generate eligibility proof: ' + error.message);
    }
  }

  /**
   * Mock eligibility check for development mode
   */
  private checkMockEligibility(applicationData: ZKApplicationData): boolean {
    // Simple mock logic - in reality this would be done in the ZK circuit
    const hasRequiredSkills = Object.values(applicationData.skills).some(score => score >= 70);
    const salaryInRange = applicationData.expectedSalary >= 50000 && applicationData.expectedSalary <= 200000;
    const validRegion = ['US-CA', 'US-NY', 'US-TX', 'EU-DE', 'EU-FR'].includes(applicationData.region);
    
    return hasRequiredSkills && salaryInRange && validRegion;
  }

  /**
   * Get network status
   */
  async getNetworkStatus(): Promise<{
    connected: boolean;
    networkId: string;
    blockHeight?: number;
    nodeVersion?: string;
  }> {
    try {
      if (!this.isDevelopmentMode && this.nodeClient) {
        const status = await this.nodeClient.getStatus();
        return {
          connected: true,
          networkId: MIDNIGHT_CONFIG.networkId,
          blockHeight: status.blockHeight,
          nodeVersion: status.nodeVersion
        };
      } else {
        return {
          connected: false,
          networkId: MIDNIGHT_CONFIG.networkId + '-mock',
          blockHeight: Math.floor(Math.random() * 1000000) + 100000,
          nodeVersion: 'midnight-node-v0.1.15-mock'
        };
      }
    } catch (error) {
      console.error('Failed to get network status:', error);
      return {
        connected: false,
        networkId: MIDNIGHT_CONFIG.networkId + '-error'
      };
    }
  }

  /**
   * Get job details from contract
   */
  async getJob(jobId: string): Promise<any> {
    try {
      if (!this.isDevelopmentMode && this.contractRuntime && MIDNIGHT_CONFIG.contractAddress) {
        const result = await this.contractRuntime.query({
          contractAddress: MIDNIGHT_CONFIG.contractAddress,
          method: 'getJob',
          args: [parseInt(jobId.replace('job_', ''))]
        });
        return result;
      } else {
        // Return mock job data
        return {
          id: jobId,
          title: 'Senior Privacy Engineer',
          description: 'Join our team to build privacy-preserving systems using zero-knowledge proofs and secure multi-party computation.',
          employer: 'midnight1employer...',
          skillThresholds: { 
            'zero-knowledge': 80, 
            'cryptography': 75, 
            'rust': 70,
            'typescript': 65 
          },
          salaryMin: 120000,
          salaryMax: 180000,
          allowedRegions: ['US-CA', 'US-NY', 'EU-DE'],
          isActive: true,
          createdAt: Date.now() - 86400000, // 1 day ago
          applicationCount: Math.floor(Math.random() * 10) + 1
        };
      }
    } catch (error) {
      console.error('Failed to get job:', error);
      return null;
    }
  }

  /**
   * Get privacy statistics
   */
  async getPrivacyStats(): Promise<{ averagePrivacyScore: number; totalApplications: number }> {
    try {
      if (!this.isDevelopmentMode && this.contractRuntime && MIDNIGHT_CONFIG.contractAddress) {
        const result = await this.contractRuntime.query({
          contractAddress: MIDNIGHT_CONFIG.contractAddress,
          method: 'getPrivacyStats',
          args: []
        });
        return {
          averagePrivacyScore: result[0],
          totalApplications: result[1]
        };
      } else {
        // Return mock stats
        return {
          averagePrivacyScore: 93,
          totalApplications: Math.floor(Math.random() * 500) + 200
        };
      }
    } catch (error) {
      console.error('Failed to get privacy stats:', error);
      return { averagePrivacyScore: 0, totalApplications: 0 };
    }
  }

  // Utility methods
  private generateRegionMerkleRoot(regions: string[]): string {
    // Generate a Merkle root for regions using a simple hash
    // In production, this would use proper Merkle tree construction with Poseidon hashing
    const combined = regions.sort().join('|');
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  }

  private generateNullifier(jobId: string, applicantId: string): string {
    // Generate a nullifier hash to prevent double applications
    // In production, this would use Poseidon hash
    const combined = jobId + '|' + applicantId;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  }

  private async getWalletAddress(): Promise<string> {
    if (this.wallet) {
      const accounts = await this.wallet.request({ method: 'midnight_requestAccounts' });
      return accounts[0];
    }
    return 'mock-address-' + Date.now();
  }

  /**
   * Check if Midnight wallet is available
   */
  static isWalletAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).midnight;
  }

  /**
   * Get wallet installation URL
   */
  static getWalletInstallUrl(): string {
    return 'https://wallet.midnight.network';
  }

  /**
   * Get development mode status
   */
  isDevelopment(): boolean {
    return this.isDevelopmentMode;
  }
}

// Export singleton instance
export const midnightClient = new MidnightClient();
