#!/usr/bin/env ts-node

/**
 * GhostHire JobBoard Contract Deployment Script
 * Deploys the JobBoard.compact smart contract to Midnight Network
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Mock types for Midnight Network (real packages not available yet)
interface WalletAPI {
  getAddress(): Promise<string>;
  getBalance(): Promise<{ amount: number; denom: string }>;
  signTransaction(tx: any): Promise<any>;
}

interface LedgerAPI {
  getStatus(): Promise<{ blockHeight: number; nodeVersion: string }>;
  submitTransaction(tx: any): Promise<any>;
}

interface CompactRuntime {
  createDeployTransaction(params: any): Promise<any>;
}

// Load environment variables
dotenv.config();

interface DeploymentConfig {
  rpcUrl: string;
  networkId: string;
  walletMnemonic?: string;
  contractPath: string;
  gasLimit: number;
  gasPrice: string;
}

class ContractDeployer {
  private config: DeploymentConfig;
  private ledger: any;
  private wallet: WalletAPI | null = null;
  private contractRuntime: CompactRuntime | null = null;

  constructor(config: DeploymentConfig) {
    this.config = config;
  }

  async initialize() {
    console.log('🌙 Initializing Midnight Network connection...');
    
    try {
      // Initialize ledger connection
      this.ledger = await createLedger({
        rpcUrl: this.config.rpcUrl,
        networkId: this.config.networkId
      });

      console.log('✅ Connected to Midnight Network');
      console.log(`   Network ID: ${this.config.networkId}`);
      console.log(`   RPC URL: ${this.config.rpcUrl}`);

      // Get network status
      const status = await this.ledger.getStatus();
      console.log(`   Block Height: ${status.blockHeight}`);
      console.log(`   Node Version: ${status.nodeVersion}`);

    } catch (error) {
      console.error('❌ Failed to initialize Midnight Network connection:', error);
      throw error;
    }
  }

  async connectWallet() {
    console.log('🔗 Connecting wallet...');
    
    try {
      if (this.config.walletMnemonic) {
        // Use mnemonic for deployment
        this.wallet = await this.createWalletFromMnemonic(this.config.walletMnemonic);
      } else {
        // Use browser wallet (for interactive deployment)
        this.wallet = await this.connectBrowserWallet();
      }

      const address = await this.wallet.getAddress();
      const balance = await this.wallet.getBalance();
      
      console.log('✅ Wallet connected');
      console.log(`   Address: ${address}`);
      console.log(`   Balance: ${balance.amount} ${balance.denom}`);

      // Check if wallet has sufficient balance for deployment
      if (balance.amount < 1000000) { // 1M DUST minimum
        console.warn('⚠️  Low wallet balance. Deployment may fail.');
      }

    } catch (error) {
      console.error('❌ Failed to connect wallet:', error);
      throw error;
    }
  }

  async loadContract() {
    console.log('📄 Loading JobBoard.compact contract...');
    
    try {
      const contractPath = path.resolve(this.config.contractPath);
      
      if (!fs.existsSync(contractPath)) {
        throw new Error(`Contract file not found: ${contractPath}`);
      }

      const contractCode = fs.readFileSync(contractPath, 'utf-8');
      
      // Validate contract syntax
      this.contractRuntime = new CompactRuntime(contractCode);
      
      console.log('✅ Contract loaded and validated');
      console.log(`   File: ${contractPath}`);
      console.log(`   Size: ${contractCode.length} bytes`);

    } catch (error) {
      console.error('❌ Failed to load contract:', error);
      throw error;
    }
  }

  async deployContract() {
    console.log('🚀 Deploying JobBoard contract...');
    
    try {
      if (!this.contractRuntime || !this.wallet) {
        throw new Error('Contract or wallet not initialized');
      }

      // Create deployment transaction
      const deployTx = await this.contractRuntime.createDeployTransaction({
        code: fs.readFileSync(this.config.contractPath, 'utf-8'),
        initArgs: [], // JobBoard constructor takes no arguments
        gasLimit: this.config.gasLimit,
        gasPrice: this.config.gasPrice
      });

      console.log('📝 Signing deployment transaction...');
      const signedTx = await this.wallet.signTransaction(deployTx);

      console.log('📡 Broadcasting transaction to network...');
      const result = await this.ledger.submitTransaction(signedTx);

      console.log('✅ Contract deployed successfully!');
      console.log(`   Contract Address: ${result.contractAddress}`);
      console.log(`   Transaction Hash: ${result.txHash}`);
      console.log(`   Block Number: ${result.blockNumber}`);
      console.log(`   Gas Used: ${result.gasUsed}`);

      // Save deployment info
      await this.saveDeploymentInfo({
        contractAddress: result.contractAddress,
        transactionHash: result.txHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        deployedAt: new Date().toISOString(),
        networkId: this.config.networkId,
        deployer: await this.wallet.getAddress()
      });

      return result;

    } catch (error) {
      console.error('❌ Contract deployment failed:', error);
      throw error;
    }
  }

  async verifyDeployment(contractAddress: string) {
    console.log('🔍 Verifying contract deployment...');
    
    try {
      // Query contract state to ensure it's deployed correctly
      const contractState = await this.ledger.getContractState(contractAddress);
      
      console.log('✅ Contract verification successful');
      console.log(`   State Size: ${JSON.stringify(contractState).length} bytes`);
      
      // Test basic contract functionality
      const jobCount = await this.contractRuntime!.query({
        method: 'getJobCount',
        args: []
      });
      
      console.log(`   Initial Job Count: ${jobCount}`);
      
      return true;
    } catch (error) {
      console.error('❌ Contract verification failed:', error);
      return false;
    }
  }

  private async createWalletFromMnemonic(mnemonic: string): Promise<WalletAPI> {
    // In a real implementation, this would create a wallet from mnemonic
    // For now, return a mock wallet
    return {
      getAddress: async () => 'midnight1deployer' + Math.random().toString(36).substr(2, 20),
      getBalance: async () => ({ amount: 10000000, denom: 'DUST' }),
      signTransaction: async (tx: any) => ({ ...tx, signature: 'mock_signature' })
    } as any;
  }

  private async connectBrowserWallet(): Promise<WalletAPI> {
    // In a real implementation, this would connect to browser wallet
    throw new Error('Browser wallet connection not implemented in CLI deployment');
  }

  private async saveDeploymentInfo(info: any) {
    const deploymentFile = path.join(__dirname, '..', 'deployments', `${this.config.networkId}.json`);
    const deploymentDir = path.dirname(deploymentFile);
    
    // Ensure deployments directory exists
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir, { recursive: true });
    }

    // Load existing deployments
    let deployments = {};
    if (fs.existsSync(deploymentFile)) {
      deployments = JSON.parse(fs.readFileSync(deploymentFile, 'utf-8'));
    }

    // Add new deployment
    (deployments as any).JobBoard = info;

    // Save updated deployments
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2));
    
    console.log(`💾 Deployment info saved to: ${deploymentFile}`);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const network = args[0] || 'testnet';
  
  console.log('🔐 GhostHire Contract Deployment');
  console.log('================================\n');

  // Configuration based on network
  const configs: Record<string, DeploymentConfig> = {
    testnet: {
      rpcUrl: process.env.MIDNIGHT_TESTNET_RPC || 'https://rpc.testnet.midnight.network',
      networkId: 'midnight-testnet',
      contractPath: path.join(__dirname, '..', 'contracts', 'JobBoard.compact'),
      gasLimit: 5000000,
      gasPrice: '1000000'
    },
    mainnet: {
      rpcUrl: process.env.MIDNIGHT_MAINNET_RPC || 'https://rpc.midnight.network',
      networkId: 'midnight-mainnet',
      contractPath: path.join(__dirname, '..', 'contracts', 'JobBoard.compact'),
      gasLimit: 5000000,
      gasPrice: '1000000'
    },
    local: {
      rpcUrl: process.env.MIDNIGHT_LOCAL_RPC || 'http://localhost:26657',
      networkId: 'midnight-local',
      contractPath: path.join(__dirname, '..', 'contracts', 'JobBoard.compact'),
      gasLimit: 5000000,
      gasPrice: '1000000'
    }
  };

  const config = configs[network];
  if (!config) {
    console.error(`❌ Unknown network: ${network}`);
    console.log('Available networks: testnet, mainnet, local');
    process.exit(1);
  }

  // Add wallet mnemonic from environment if available
  if (process.env.DEPLOYER_MNEMONIC) {
    config.walletMnemonic = process.env.DEPLOYER_MNEMONIC;
  }

  const deployer = new ContractDeployer(config);

  try {
    // Deployment process
    await deployer.initialize();
    await deployer.connectWallet();
    await deployer.loadContract();
    
    console.log('\n🚀 Starting deployment...\n');
    
    const result = await deployer.deployContract();
    
    console.log('\n🔍 Verifying deployment...\n');
    
    const verified = await deployer.verifyDeployment(result.contractAddress);
    
    if (verified) {
      console.log('\n🎉 Deployment completed successfully!');
      console.log('\n📋 Next steps:');
      console.log(`   1. Update your .env files with the contract address: ${result.contractAddress}`);
      console.log(`   2. Update frontend configuration to use the deployed contract`);
      console.log(`   3. Test the deployment with the verification script`);
      console.log('\n🔗 Useful commands:');
      console.log(`   npm run verify-contract ${network}`);
      console.log(`   npm run test-contract ${network}`);
    } else {
      console.log('\n⚠️  Deployment completed but verification failed');
      console.log('   Please check the contract manually');
    }

  } catch (error) {
    console.error('\n💥 Deployment failed:', error);
    process.exit(1);
  }
}

// Handle CLI execution
if (require.main === module) {
  main().catch(console.error);
}

export { ContractDeployer };
