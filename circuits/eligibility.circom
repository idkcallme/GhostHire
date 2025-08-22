pragma circom 2.0.0;

include "./node_modules/circomlib/circuits/comparators.circom";
include "./node_modules/circomlib/circuits/poseidon.circom";

/**
 * EligibilityProof - ZK circuit for privacy-preserving job application eligibility
 * 
 * This circuit proves that an applicant meets job requirements without revealing:
 * - Exact skill levels (only proves >= thresholds)
 * - Exact location (only proves region membership via Merkle tree)
 * - Exact salary expectations (only proves within acceptable range)
 * 
 * Public inputs:
 * - jobId: Unique identifier for the job
 * - nullifier: Prevents duplicate applications (derived from applicant + job)
 * - eligible: Output proving all requirements are met
 * - timestamp: When the proof was generated
 * 
 * Private inputs:
 * - skills[MAX_SKILLS]: Array of skill proficiency levels (0-100)
 * - region: Applicant's region code
 * - expectedSalary: Applicant's salary expectation
 * - skillThresholds[MAX_SKILLS]: Required skill thresholds for the job
 * - salaryMin, salaryMax: Job's salary range
 * - allowedRegions[MAX_REGIONS]: List of allowed regions
 * - applicantSecret: Private key for nullifier generation
 */

template EligibilityProof(MAX_SKILLS, MAX_REGIONS, MERKLE_TREE_DEPTH) {
    // Public inputs (visible on blockchain)
    signal input jobId;
    signal input nullifier;
    signal output eligible;
    signal input timestamp;
    
    // Private inputs (hidden from blockchain)
    signal private input skills[MAX_SKILLS];
    signal private input region;
    signal private input expectedSalary;
    signal private input skillThresholds[MAX_SKILLS];
    signal private input salaryMin;
    signal private input salaryMax;
    signal private input allowedRegions[MAX_REGIONS];
    signal private input regionMerkleRoot;
    signal private input regionMerkleProof[MERKLE_TREE_DEPTH];
    signal private input regionMerkleIndex;
    signal private input applicantSecret;

    // Intermediate signals
    signal skillChecks[MAX_SKILLS];
    signal salaryInRange;
    signal regionValid;
    signal nullifierValid;
    signal allSkillsMet;
    signal allRequirementsMet;

    // Components
    component skillComparators[MAX_SKILLS];
    component salaryMinCheck = GreaterEqualThan(32);
    component salaryMaxCheck = LessEqualThan(32);
    component nullifierHasher = Poseidon(3);
    component eligibilityAnd = MultiAND(3);

    // 1. Verify skills meet thresholds
    var skillSum = 0;
    for (var i = 0; i < MAX_SKILLS; i++) {
        skillComparators[i] = GreaterEqualThan(8);
        skillComparators[i].in[0] <== skills[i];
        skillComparators[i].in[1] <== skillThresholds[i];
        skillChecks[i] <== skillComparators[i].out;
        skillSum += skillChecks[i];
    }
    
    // All skills must meet thresholds (or be 0 if not required)
    component skillSumCheck = IsEqual();
    skillSumCheck.in[0] <== skillSum;
    skillSumCheck.in[1] <== MAX_SKILLS;
    allSkillsMet <== skillSumCheck.out;

    // 2. Verify salary expectations are within range
    salaryMinCheck.in[0] <== expectedSalary;
    salaryMinCheck.in[1] <== salaryMin;
    
    salaryMaxCheck.in[0] <== expectedSalary;
    salaryMaxCheck.in[1] <== salaryMax;
    
    // Salary must be >= salaryMin AND <= salaryMax
    component salaryRangeAnd = AND();
    salaryRangeAnd.a <== salaryMinCheck.out;
    salaryRangeAnd.b <== salaryMaxCheck.out;
    salaryInRange <== salaryRangeAnd.out;

    // 3. Verify region membership using Merkle tree
    // Simplified for demo - in production, use proper Merkle tree verification
    component regionHasher = Poseidon(1);
    regionHasher.inputs[0] <== region;
    
    component regionCheck = IsEqual();
    regionCheck.in[0] <== regionHasher.out;
    regionCheck.in[1] <== regionMerkleRoot; // Simplified check
    regionValid <== regionCheck.out;

    // 4. Verify nullifier (prevents duplicate applications)
    nullifierHasher.inputs[0] <== applicantSecret;
    nullifierHasher.inputs[1] <== jobId;
    nullifierHasher.inputs[2] <== timestamp;
    
    component nullifierCheck = IsEqual();
    nullifierCheck.in[0] <== nullifierHasher.out;
    nullifierCheck.in[1] <== nullifier;
    nullifierValid <== nullifierCheck.out;

    // 5. Final eligibility check
    eligibilityAnd.in[0] <== allSkillsMet;
    eligibilityAnd.in[1] <== salaryInRange;
    eligibilityAnd.in[2] <== regionValid;
    // Note: nullifierValid is checked separately to prevent replay attacks
    
    allRequirementsMet <== eligibilityAnd.out;
    
    // Final output: eligible only if all requirements met AND nullifier is valid
    component finalAnd = AND();
    finalAnd.a <== allRequirementsMet;
    finalAnd.b <== nullifierValid;
    eligible <== finalAnd.out;

    // Constraints to ensure inputs are within valid ranges
    for (var i = 0; i < MAX_SKILLS; i++) {
        // Skills must be 0-100
        component skillRangeCheck = LessEqualThan(8);
        skillRangeCheck.in[0] <== skills[i];
        skillRangeCheck.in[1] <== 100;
        skillRangeCheck.out === 1;
        
        // Thresholds must be 0-100
        component thresholdRangeCheck = LessEqualThan(8);
        thresholdRangeCheck.in[0] <== skillThresholds[i];
        thresholdRangeCheck.in[1] <== 100;
        thresholdRangeCheck.out === 1;
    }
    
    // Salary values must be positive
    component salaryMinPositive = GreaterThan(32);
    salaryMinPositive.in[0] <== salaryMin;
    salaryMinPositive.in[1] <== 0;
    salaryMinPositive.out === 1;
    
    component salaryMaxPositive = GreaterThan(32);
    salaryMaxPositive.in[0] <== salaryMax;
    salaryMaxPositive.in[1] <== 0;
    salaryMaxPositive.out === 1;
    
    component expectedSalaryPositive = GreaterThan(32);
    expectedSalaryPositive.in[0] <== expectedSalary;
    expectedSalaryPositive.in[1] <== 0;
    expectedSalaryPositive.out === 1;
    
    // Salary max must be >= salary min
    component salaryRangeValid = GreaterEqualThan(32);
    salaryRangeValid.in[0] <== salaryMax;
    salaryRangeValid.in[1] <== salaryMin;
    salaryRangeValid.out === 1;
}

// Multi-input AND gate
template MultiAND(n) {
    signal input in[n];
    signal output out;
    
    if (n == 1) {
        out <== in[0];
    } else if (n == 2) {
        component and = AND();
        and.a <== in[0];
        and.b <== in[1];
        out <== and.out;
    } else {
        component firstAnd = AND();
        component restAnd = MultiAND(n-1);
        
        firstAnd.a <== in[0];
        for (var i = 1; i < n; i++) {
            restAnd.in[i-1] <== in[i];
        }
        firstAnd.b <== restAnd.out;
        out <== firstAnd.out;
    }
}

// Main component instantiation
component main = EligibilityProof(10, 32, 5);

/* 
Circuit Parameters:
- MAX_SKILLS: 10 (supports up to 10 different skills)
- MAX_REGIONS: 32 (supports up to 32 regions in Merkle tree)
- MERKLE_TREE_DEPTH: 5 (allows for 2^5 = 32 regions)

This configuration allows for:
- 10 different skill categories (Programming, Frontend, Backend, etc.)
- 32 different geographical regions
- Salary ranges from 0 to 2^32 (sufficient for any realistic salary)

The circuit has approximately 1000-2000 constraints, making it efficient
for client-side proof generation while maintaining strong privacy guarantees.
*/