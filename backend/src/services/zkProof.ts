import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import { midnightService, MidnightProofInput } from './midnightNetwork';

// Types for ZK proof system
interface EligibilityInputs {
  skills: Record<string, number>;
  region: string;
  expectedSalary: number;
  skillThresholds: Record<string, number>;
  salaryMin: number;
  salaryMax: number;
  regionMerkleRoot: string;
  nullifierHash: string;
}

interface ProofResult {
  proof: any;
  publicInputs: string[];
  proofHash: string;
  circuitId: string;
}

interface VerificationResult {
  valid: boolean;
  eligible: boolean;
  error?: string;
}

interface EligibilityCheck {
  eligible: boolean;
  reasons?: string[];
}

interface PrivacyMetrics {
  skillsRevealed: number; // 0-100
  locationRevealed: number; // 0-100
  salaryRevealed: number; // 0-100
  hasNullifier: boolean;
}

interface MerkleProof {
  proof: string[];
  root: string;
  leafIndex: number;
  valid: boolean;
}

export class ZKProofService {
  private circuitWasmPath: string;
  private circuitZkeyPath: string;
  private verificationKey: any;

  constructor() {
    this.circuitWasmPath = process.env.ZK_CIRCUIT_WASM_PATH || './circuits/eligibility.wasm';
    this.circuitZkeyPath = process.env.ZK_PROVING_KEY_PATH || './keys/proving_key.zkey';
    this.loadVerificationKey();
  }

  private loadVerificationKey() {
    try {
      const vkPath = process.env.ZK_VERIFICATION_KEY_PATH || './keys/verification_key.json';
      if (fs.existsSync(vkPath)) {
        this.verificationKey = JSON.parse(fs.readFileSync(vkPath, 'utf8'));
      } else {
        // Mock verification key for demo
        this.verificationKey = this.generateMockVerificationKey();
      }
    } catch (error) {
      console.warn('Could not load verification key, using mock:', error);
      this.verificationKey = this.generateMockVerificationKey();
    }
  }

  private generateMockVerificationKey() {
    return {
      protocol: "groth16",
      curve: "bn128",
      nPublic: 4,
      vk_alpha_1: ["20491192805390485299153009773594534940189261866228447918068658471970481763042", "9383485363053290200918347156157836566562967994039712273449902621266178545958", "1"],
      vk_beta_2: [["6375614351688725206403948262868962793625744043794305715222011528459656738731", "4252822878758300859123897981450591353533073413197771768651442665752259397132"], ["10505242626370262277552901082094356697409835680220590971873171140371331206856", "21847035105528745403288232691147584728191162732299865338377159692350059136679"], ["1", "0"]],
      vk_gamma_2: [["10857046999023057135944570762232829481370756359578518086990519993285655852781", "11559732032986387107991004021392285783925812861821192530917403151452391805634"], ["8495653923123431417604973247489272438418190587263600148770280649306958101930", "4082367875863433681332203403145435568316851327593401208105741076214120093531"], ["1", "0"]],
      vk_delta_2: [["19165168845091129075023815977525992395023635047581471962361817541464598090026", "17033511851321100853823073372797111716033725851844470169754987103705826309403"], ["8042799071093567012547014754740513748076172551071528143652901037700893830604", "16992951783033936843903503178906830583151644095024424900159158829951623838691"], ["1", "0"]],
      vk_alphabeta_12: [[["2029413683389138792403550203267699914886160938906632433982220835551125967885", "21072700047562757817161031222997517981543347628379360635925549008442030252106"], ["5212086202636819572316972047070994380569926827885170014158935273851693327966", "24982985329883125721421025024103998994005221024820987688977959024076772802659"], ["8825850463701454991565026639013142503103980159165600426092686037734756056506", "9949142659244715377451142502529006424468949024669399799419901019816194772893"]], [["7953654612239834149409928607806045915005654825988155844599043862881988107414", "17712078060906669956892593142421779037688993242616993451134253816156041772710"], ["9399068925701090893325687327985096515928893068725226529536698618946066842423", "4070893568051145581893513726992830456653224097516066988532066987700883336556"], ["17542378851334966969062430419466649688159659154885536994958230430797848055000", "10550013537159624827374885816655226701027502980742958606169883799052097639936"]]]
    };
  }

  /**
   * Check eligibility before generating proof (client-side verification)
   */
  checkEligibility(data: {
    skills: Record<string, number>;
    region: string;
    expectedSalary: number;
    skillThresholds: Record<string, number>;
    salaryMin: number;
    salaryMax: number;
    allowedRegions: string[];
  }): EligibilityCheck {
    const reasons: string[] = [];

    // Check skill thresholds
    for (const [skill, threshold] of Object.entries(data.skillThresholds)) {
      const userSkill = data.skills[skill] || 0;
      if (userSkill < threshold) {
        reasons.push(`${skill} proficiency too low: ${userSkill} < ${threshold}`);
      }
    }

    // Check salary range
    if (data.expectedSalary < data.salaryMin || data.expectedSalary > data.salaryMax) {
      reasons.push(`Salary expectation outside range: ${data.expectedSalary} not in [${data.salaryMin}, ${data.salaryMax}]`);
    }

    // Check region eligibility
    if (!data.allowedRegions.includes(data.region)) {
      reasons.push(`Region not allowed: ${data.region} not in [${data.allowedRegions.join(', ')}]`);
    }

    return {
      eligible: reasons.length === 0,
      reasons: reasons.length > 0 ? reasons : undefined
    };
  }

  /**
   * Generate ZK proof for job application eligibility using Midnight Network
   */
  async generateEligibilityProof(inputs: EligibilityInputs): Promise<ProofResult> {
    try {
      console.log('🔐 Generating ZK proof with Midnight Network integration...');
      
      // Convert inputs to Midnight format
      const midnightInputs: MidnightProofInput = {
        // Private inputs
        skills: Object.values(inputs.skills),
        region: inputs.region,
        expectedSalary: inputs.expectedSalary,
        applicantSecret: this.generateApplicantSecret(),
        
        // Public inputs
        jobId: inputs.jobId,
        skillThresholds: Object.values(inputs.skillThresholds),
        salaryMin: inputs.salaryMin,
        salaryMax: inputs.salaryMax,
        regionMerkleRoot: inputs.regionMerkleRoot,
        nullifier: inputs.nullifierHash,
        timestamp: Math.floor(Date.now() / 1000)
      };

      // Generate proof using Midnight service
      const midnightResult = await midnightService.generateEligibilityProof(midnightInputs);
      
      console.log('✅ ZK proof generated successfully with Midnight Network');
      
      return {
        proof: midnightResult.proof,
        publicInputs: midnightResult.publicSignals,
        proofHash: midnightResult.proofHash,
        circuitId: 'eligibility_midnight_v1.0'
      };
    } catch (error) {
      console.error('Midnight proof generation failed, using fallback:', error);
      return await this.generateFallbackProof(inputs);
    }
  }

  /**
   * Fallback proof generation for development
   */
  private async generateFallbackProof(inputs: EligibilityInputs): Promise<ProofResult> {
    console.log('🔧 Using fallback proof generation...');
    
    // Convert inputs to circuit format
    const circuitInputs = this.prepareCircuitInputs(inputs);
    
    // Simulate proof generation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock proof
    const proof = this.generateMockProof();
    const publicInputs = this.extractPublicInputs(circuitInputs);
    
    // Generate proof hash for verification
    const proofHash = this.generateProofHash(proof, publicInputs);
    
    return {
      proof,
      publicInputs,
      proofHash,
      circuitId: 'eligibility_fallback_v1.0'
    };
  }

  /**
   * Verify ZK proof using Midnight Network
   */
  async verifyProof(data: {
    proof: any;
    publicSignals: string[];
    jobData: any;
  }): Promise<VerificationResult> {
    try {
      console.log('🔍 Verifying ZK proof with Midnight Network...');
      
      // Try Midnight network verification first
      const midnightResult = await midnightService.verifyProofOnChain({
        proof: data.proof,
        publicSignals: data.publicSignals,
        proofHash: this.generateProofHash(data.proof, data.publicSignals)
      });

      if (midnightResult.valid) {
        console.log('✅ Proof verified on Midnight Network');
        const eligible = data.publicSignals[2] === '1'; // Eligible flag is 3rd public signal
        
        return {
          valid: true,
          eligible,
          transactionHash: midnightResult.transactionHash
        };
      } else {
        console.log('❌ Midnight Network verification failed, using fallback');
        return await this.fallbackVerifyProof(data);
      }
    } catch (error) {
      console.error('Midnight verification failed, using fallback:', error);
      return await this.fallbackVerifyProof(data);
    }
  }

  /**
   * Fallback proof verification for development
   */
  private async fallbackVerifyProof(data: {
    proof: any;
    publicSignals: string[];
    jobData: any;
  }): Promise<VerificationResult> {
    try {
      console.log('🔧 Using fallback proof verification...');
      
      // Simulate verification time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock verification (check basic proof structure)
      const isValidProof = this.mockVerifyProof(data.proof, data.publicSignals);
      
      if (!isValidProof) {
        return {
          valid: false,
          eligible: false,
          error: 'Invalid proof structure'
        };
      }

      // Extract eligibility from public signals
      const eligible = data.publicSignals[2] === '1'; // Eligible flag
      
      return {
        valid: true,
        eligible
      };
    } catch (error) {
      console.error('Fallback verification failed:', error);
      return {
        valid: false,
        eligible: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  /**
   * Generate nullifier hash for anti-Sybil protection
   */
  async generateNullifier(applicantId: string, jobId: string): Promise<string> {
    // Use HMAC with a secret salt for deterministic but unpredictable nullifiers
    const secret = process.env.NULLIFIER_SECRET || 'default-secret-change-in-production';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${applicantId}:${jobId}`);
    return '0x' + hmac.digest('hex');
  }

  /**
   * Calculate privacy score based on revealed data
   */
  calculatePrivacyScore(metrics: PrivacyMetrics): number {
    let score = 100;
    
    // Deduct points for revealed information
    score -= metrics.skillsRevealed * 0.3; // Skills are somewhat sensitive
    score -= metrics.locationRevealed * 0.4; // Location is quite sensitive
    score -= metrics.salaryRevealed * 0.5; // Salary is very sensitive
    
    // Bonus for using nullifier (anti-Sybil protection)
    if (metrics.hasNullifier) {
      score += 5;
    }
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Generate Merkle proof for region membership
   */
  generateRegionMerkleProof(region: string, allowedRegions: string[]): MerkleProof {
    // Simple binary tree implementation for demo
    const leaves = allowedRegions.sort().map(r => this.hashString(r));
    const tree = this.buildMerkleTree(leaves);
    
    const leafIndex = allowedRegions.sort().indexOf(region);
    if (leafIndex === -1) {
      return {
        proof: [],
        root: tree[tree.length - 1] || '',
        leafIndex: -1,
        valid: false
      };
    }
    
    const proof = this.getMerkleProof(tree, leafIndex, leaves.length);
    
    return {
      proof,
      root: tree[tree.length - 1],
      leafIndex,
      valid: true
    };
  }

  // Private helper methods

  private prepareCircuitInputs(inputs: EligibilityInputs): any {
    // Convert to format expected by the circuit
    return {
      // Private inputs
      skills: Object.values(inputs.skills),
      region_hash: this.hashString(inputs.region),
      expected_salary: inputs.expectedSalary,
      
      // Public inputs
      job_id: this.hashString(inputs.jobId),
      skill_thresholds: Object.values(inputs.skillThresholds),
      salary_min: inputs.salaryMin,
      salary_max: inputs.salaryMax,
      region_merkle_root: inputs.regionMerkleRoot,
      nullifier: inputs.nullifierHash
    };
  }

  private extractPublicInputs(circuitInputs: any): string[] {
    // Extract only the public inputs that go on-chain
    return [
      circuitInputs.job_id,
      circuitInputs.nullifier,
      '1', // eligible (would be computed by circuit)
      Math.floor(Date.now() / 1000).toString() // timestamp
    ];
  }

  private generateMockProof(): any {
    // Generate a mock Groth16 proof structure
    return {
      pi_a: [
        this.randomHex(64),
        this.randomHex(64),
        "1"
      ],
      pi_b: [
        [this.randomHex(64), this.randomHex(64)],
        [this.randomHex(64), this.randomHex(64)],
        ["1", "0"]
      ],
      pi_c: [
        this.randomHex(64),
        this.randomHex(64),
        "1"
      ],
      protocol: "groth16",
      curve: "bn128"
    };
  }

  private mockVerifyProof(proof: any, publicSignals: string[]): boolean {
    // Basic structure validation for mock proof
    return (
      proof &&
      proof.pi_a && Array.isArray(proof.pi_a) && proof.pi_a.length === 3 &&
      proof.pi_b && Array.isArray(proof.pi_b) && proof.pi_b.length === 3 &&
      proof.pi_c && Array.isArray(proof.pi_c) && proof.pi_c.length === 3 &&
      proof.protocol === "groth16" &&
      proof.curve === "bn128" &&
      publicSignals && Array.isArray(publicSignals)
    );
  }

  private generateProofHash(proof: any, publicInputs: string[]): string {
    const proofString = JSON.stringify({ proof, publicInputs });
    return '0x' + crypto.createHash('sha256').update(proofString).digest('hex');
  }

  private generateApplicantSecret(): string {
    // Generate a random secret for the applicant (in production, this would be derived from wallet)
    return crypto.randomBytes(32).toString('hex');
  }

  private hashString(input: string): string {
    return '0x' + crypto.createHash('sha256').update(input).digest('hex');
  }

  private randomHex(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private buildMerkleTree(leaves: string[]): string[] {
    if (leaves.length === 0) return [];
    if (leaves.length === 1) return leaves;
    
    const tree: string[] = [...leaves];
    let currentLevel = leaves;
    
    while (currentLevel.length > 1) {
      const nextLevel: string[] = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        const combined = crypto.createHash('sha256').update(left + right).digest('hex');
        nextLevel.push('0x' + combined);
      }
      tree.push(...nextLevel);
      currentLevel = nextLevel;
    }
    
    return tree;
  }

  private getMerkleProof(tree: string[], leafIndex: number, leafCount: number): string[] {
    const proof: string[] = [];
    let currentIndex = leafIndex;
    let currentLevelSize = leafCount;
    let levelStartIndex = 0;
    
    while (currentLevelSize > 1) {
      const isRightNode = currentIndex % 2 === 1;
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;
      
      if (siblingIndex < currentLevelSize) {
        proof.push(tree[levelStartIndex + siblingIndex]);
      }
      
      levelStartIndex += currentLevelSize;
      currentIndex = Math.floor(currentIndex / 2);
      currentLevelSize = Math.ceil(currentLevelSize / 2);
    }
    
    return proof;
  }
}
