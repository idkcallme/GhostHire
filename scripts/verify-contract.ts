#!/usr/bin/env ts-node

/**
 * GhostHire JobBoard Contract Verification Script
 * Verifies the deployed contract functionality and integrity
 */

import { createLedger } from '@midnight-ntwrk/ledger';
import { WalletAPI } from '@midnight-ntwrk/wallet-api';
import { CompactRuntime } from '@midnight-ntwrk/compact-runtime';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

interface DeploymentInfo {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  deployedAt: string;
  networkId: string;
  deployer: string;
}

class ContractVerifier {
  private networkId: string;
  private ledger: any;
  private contractRuntime: CompactRuntime | null = null;
  private deploymentInfo: DeploymentInfo | null = null;

  constructor(networkId: string) {
    this.networkId = networkId;
  }

  async initialize() {
    console.log('🔍 Initializing contract verification...');
    
    try {
      // Load deployment info
      const deploymentFile = path.join(__dirname, '..', 'deployments', `${this.networkId}.json`);
      
      if (!fs.existsSync(deploymentFile)) {
        throw new Error(`No deployment found for network: ${this.networkId}`);
      }

      const deployments = JSON.parse(fs.readFileSync(deploymentFile, 'utf-8'));
      this.deploymentInfo = deployments.JobBoard;

      if (!this.deploymentInfo) {
        throw new Error('JobBoard contract not found in deployments');
      }

      console.log('✅ Deployment info loaded');
      console.log(`   Contract Address: ${this.deploymentInfo.contractAddress}`);
      console.log(`   Deployed At: ${this.deploymentInfo.deployedAt}`);
      console.log(`   Block Number: ${this.deploymentInfo.blockNumber}`);

      // Initialize ledger
      const rpcUrls: Record<string, string> = {
        'midnight-testnet': process.env.MIDNIGHT_TESTNET_RPC || 'https://rpc.testnet.midnight.network',
        'midnight-mainnet': process.env.MIDNIGHT_MAINNET_RPC || 'https://rpc.midnight.network',
        'midnight-local': process.env.MIDNIGHT_LOCAL_RPC || 'http://localhost:26657'
      };

      this.ledger = await createLedger({
        rpcUrl: rpcUrls[this.networkId],
        networkId: this.networkId
      });

      // Load contract runtime
      const contractPath = path.join(__dirname, '..', 'contracts', 'JobBoard.compact');
      const contractCode = fs.readFileSync(contractPath, 'utf-8');
      this.contractRuntime = new CompactRuntime(contractCode);

      console.log('✅ Verification environment initialized');

    } catch (error) {
      console.error('❌ Failed to initialize verification:', error);
      throw error;
    }
  }

  async verifyContractExists() {
    console.log('\n📋 Verifying contract existence...');
    
    try {
      const contractState = await this.ledger.getContractState(this.deploymentInfo!.contractAddress);
      
      if (!contractState) {
        throw new Error('Contract state not found');
      }

      console.log('✅ Contract exists on blockchain');
      console.log(`   State size: ${JSON.stringify(contractState).length} bytes`);
      
      return true;
    } catch (error) {
      console.error('❌ Contract existence verification failed:', error);
      return false;
    }
  }

  async verifyContractFunctionality() {
    console.log('\n🔧 Verifying contract functionality...');
    
    try {
      const tests = [
        this.testGetJobCount,
        this.testGetActiveJobs,
        this.testGetPrivacyStats
      ];

      let passed = 0;
      let failed = 0;

      for (const test of tests) {
        try {
          await test.call(this);
          passed++;
          console.log(`   ✅ ${test.name} passed`);
        } catch (error) {
          failed++;
          console.log(`   ❌ ${test.name} failed: ${error.message}`);
        }
      }

      console.log(`\n📊 Functionality test results: ${passed} passed, ${failed} failed`);
      
      return failed === 0;
    } catch (error) {
      console.error('❌ Functionality verification failed:', error);
      return false;
    }
  }

  private async testGetJobCount() {
    const jobCount = await this.contractRuntime!.query({
      method: 'getJobCount',
      args: [],
      contractAddress: this.deploymentInfo!.contractAddress
    });

    if (typeof jobCount !== 'number' || jobCount < 0) {
      throw new Error(`Invalid job count: ${jobCount}`);
    }

    console.log(`     Job count: ${jobCount}`);
  }

  private async testGetActiveJobs() {
    const activeJobs = await this.contractRuntime!.query({
      method: 'getActiveJobs',
      args: [],
      contractAddress: this.deploymentInfo!.contractAddress
    });

    if (!Array.isArray(activeJobs)) {
      throw new Error(`Invalid active jobs response: ${typeof activeJobs}`);
    }

    console.log(`     Active jobs: ${activeJobs.length}`);
  }

  private async testGetPrivacyStats() {
    const privacyStats = await this.contractRuntime!.query({
      method: 'getPrivacyStats',
      args: [],
      contractAddress: this.deploymentInfo!.contractAddress
    });

    if (!Array.isArray(privacyStats) || privacyStats.length !== 2) {
      throw new Error(`Invalid privacy stats response: ${JSON.stringify(privacyStats)}`);
    }

    const [averageScore, totalApplications] = privacyStats;
    console.log(`     Average privacy score: ${averageScore}%, Total applications: ${totalApplications}`);
  }

  async verifyZKProofSupport() {
    console.log('\n🔐 Verifying ZK proof support...');
    
    try {
      // Check if the contract has the necessary ZK proof verification methods
      const contractCode = fs.readFileSync(
        path.join(__dirname, '..', 'contracts', 'JobBoard.compact'),
        'utf-8'
      );

      const zkMethods = [
        'submitApplication',
        'verifyEligibilityProof'
      ];

      let supported = 0;
      for (const method of zkMethods) {
        if (contractCode.includes(method)) {
          console.log(`   ✅ ${method} method found`);
          supported++;
        } else {
          console.log(`   ❌ ${method} method missing`);
        }
      }

      const zkFeatures = [
        'EligibilityProof',
        'nullifier',
        'zkProofHash'
      ];

      for (const feature of zkFeatures) {
        if (contractCode.includes(feature)) {
          console.log(`   ✅ ${feature} support found`);
          supported++;
        } else {
          console.log(`   ❌ ${feature} support missing`);
        }
      }

      console.log(`\n📊 ZK support: ${supported}/${zkMethods.length + zkFeatures.length} features`);
      
      return supported === zkMethods.length + zkFeatures.length;
    } catch (error) {
      console.error('❌ ZK proof support verification failed:', error);
      return false;
    }
  }

  async verifySecurityFeatures() {
    console.log('\n🛡️  Verifying security features...');
    
    try {
      const contractCode = fs.readFileSync(
        path.join(__dirname, '..', 'contracts', 'JobBoard.compact'),
        'utf-8'
      );

      const securityFeatures = [
        { name: 'Nullifier tracking', pattern: 'nullifiers' },
        { name: 'Access control', pattern: 'require.*msg.sender' },
        { name: 'Input validation', pattern: 'require.*length' },
        { name: 'Reentrancy protection', pattern: 'status.*Pending' },
        { name: 'Overflow protection', pattern: 'SafeMath|checked' }
      ];

      let secureFeatures = 0;
      for (const feature of securityFeatures) {
        const regex = new RegExp(feature.pattern, 'i');
        if (regex.test(contractCode)) {
          console.log(`   ✅ ${feature.name} implemented`);
          secureFeatures++;
        } else {
          console.log(`   ⚠️  ${feature.name} not detected`);
        }
      }

      console.log(`\n📊 Security features: ${secureFeatures}/${securityFeatures.length} implemented`);
      
      return secureFeatures >= securityFeatures.length * 0.8; // 80% threshold
    } catch (error) {
      console.error('❌ Security verification failed:', error);
      return false;
    }
  }

  async generateVerificationReport() {
    console.log('\n📄 Generating verification report...');
    
    const report = {
      contractAddress: this.deploymentInfo!.contractAddress,
      networkId: this.networkId,
      verifiedAt: new Date().toISOString(),
      deploymentInfo: this.deploymentInfo,
      tests: {
        contractExists: await this.verifyContractExists(),
        functionalityWorks: await this.verifyContractFunctionality(),
        zkProofSupport: await this.verifyZKProofSupport(),
        securityFeatures: await this.verifySecurityFeatures()
      }
    };

    // Calculate overall score
    const testResults = Object.values(report.tests);
    const passedTests = testResults.filter(result => result === true).length;
    const totalTests = testResults.length;
    const score = Math.round((passedTests / totalTests) * 100);

    report.overallScore = score;
    report.status = score >= 80 ? 'VERIFIED' : score >= 60 ? 'PARTIAL' : 'FAILED';

    // Save report
    const reportFile = path.join(__dirname, '..', 'verification', `${this.networkId}-report.json`);
    const reportDir = path.dirname(reportFile);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    console.log('✅ Verification report generated');
    console.log(`   Report saved to: ${reportFile}`);
    console.log(`   Overall score: ${score}%`);
    console.log(`   Status: ${report.status}`);

    return report;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const network = args[0] || 'testnet';
  
  console.log('🔍 GhostHire Contract Verification');
  console.log('==================================\n');

  const networkIds: Record<string, string> = {
    testnet: 'midnight-testnet',
    mainnet: 'midnight-mainnet',
    local: 'midnight-local'
  };

  const networkId = networkIds[network];
  if (!networkId) {
    console.error(`❌ Unknown network: ${network}`);
    console.log('Available networks: testnet, mainnet, local');
    process.exit(1);
  }

  const verifier = new ContractVerifier(networkId);

  try {
    await verifier.initialize();
    const report = await verifier.generateVerificationReport();

    if (report.status === 'VERIFIED') {
      console.log('\n🎉 Contract verification successful!');
      console.log('\n✅ The contract is ready for production use');
    } else if (report.status === 'PARTIAL') {
      console.log('\n⚠️  Contract verification partially successful');
      console.log('\n🔧 Some features may need attention before production use');
    } else {
      console.log('\n❌ Contract verification failed');
      console.log('\n🛠️  Please review and fix the issues before using in production');
      process.exit(1);
    }

    console.log('\n📋 Summary:');
    console.log(`   Contract Address: ${report.contractAddress}`);
    console.log(`   Network: ${network}`);
    console.log(`   Overall Score: ${report.overallScore}%`);
    console.log(`   Status: ${report.status}`);

  } catch (error) {
    console.error('\n💥 Verification failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { ContractVerifier };
