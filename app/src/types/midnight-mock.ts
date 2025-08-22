// Mock types for Midnight Network SDK until official packages are available
// These will be replaced with actual imports when the packages are published

export interface WalletAPI {
  request(args: { method: string; params?: any[] }): Promise<any>;
  signTransaction(transaction: any): Promise<any>;
  isConnected(): boolean;
  getAccount(): Promise<string>;
}

export interface TransactionResult {
  transactionHash: string;
  returnValue: any;
  blockHeight: number;
  gasUsed: number;
}

export interface ProofData {
  a: string[];
  b: string[][];
  c: string[];
}

export interface NodeClientConfig {
  rpcUrl: string;
  networkId: string;
}

export interface ProofProviderConfig {
  url: string;
}

export interface NetworkStatus {
  blockHeight: number;
  nodeVersion: string;
  networkId: string;
  connected: boolean;
}

// Mock implementations for development
export class MidnightHttpClientProofProvider {
  private config: ProofProviderConfig;

  constructor(config: ProofProviderConfig) {
    this.config = config;
  }

  async generateProof(params: { circuitName: string; inputs: any }): Promise<{
    proof: ProofData;
    publicInputs: string[];
  }> {
    console.log('🔧 Mock proof generation for circuit:', params.circuitName);
    
    // Simulate proof generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      proof: {
        a: ['0x123...', '0x456...'],
        b: [['0x789...', '0xabc...'], ['0xdef...', '0x012...']],
        c: ['0x345...', '0x678...']
      },
      publicInputs: [
        params.inputs.jobId || '1',
        params.inputs.nullifier || '0x789...',
        '1', // eligible
        params.inputs.timestamp?.toString() || Math.floor(Date.now() / 1000).toString()
      ]
    };
  }
}

export class MidnightNodeClient {
  private config: NodeClientConfig;

  constructor(config: NodeClientConfig) {
    this.config = config;
  }

  async getStatus(): Promise<NetworkStatus> {
    console.log('🔧 Mock network status check');
    
    return {
      blockHeight: Math.floor(Math.random() * 1000000) + 100000,
      nodeVersion: 'midnight-node-v0.1.15-mock',
      networkId: this.config.networkId,
      connected: false // Indicates this is mock mode
    };
  }

  async submitTransaction(signedTx: any): Promise<TransactionResult> {
    console.log('🔧 Mock transaction submission');
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      transactionHash: '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
      returnValue: 'mock_result_' + Date.now(),
      blockHeight: Math.floor(Math.random() * 1000000) + 100000,
      gasUsed: Math.floor(Math.random() * 100000) + 21000
    };
  }
}

export class CompactRuntime {
  private nodeClient: MidnightNodeClient;

  constructor(nodeClient: MidnightNodeClient) {
    this.nodeClient = nodeClient;
  }

  async createContractTransaction(params: {
    contractAddress: string;
    method: string;
    args: any[];
  }): Promise<any> {
    console.log('🔧 Mock contract transaction creation for method:', params.method);
    
    return {
      to: params.contractAddress,
      data: 'mock_encoded_data',
      method: params.method,
      args: params.args,
      gasLimit: 300000
    };
  }

  async query(params: {
    contractAddress: string;
    method: string;
    args: any[];
  }): Promise<any> {
    console.log('🔧 Mock contract query for method:', params.method);
    
    // Return mock data based on method
    switch (params.method) {
      case 'getJob':
        return {
          id: params.args[0],
          title: 'Mock Job from Contract',
          description: 'This is a mock job fetched from the contract',
          employer: 'midnight1employer...',
          skillThresholds: { programming: 70, rust: 60 },
          salaryMin: 80000,
          salaryMax: 120000,
          allowedRegions: ['US-CA', 'US-NY'],
          isActive: true,
          createdAt: Date.now() - 86400000,
          applicationCount: Math.floor(Math.random() * 10)
        };
      case 'getPrivacyStats':
        return [95, 150]; // [averagePrivacyScore, totalApplications]
      default:
        return null;
    }
  }

  async deploy(params: {
    contract: any;
    deployerKey: string;
    initialState: any;
  }): Promise<TransactionResult> {
    console.log('🔧 Mock contract deployment');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      transactionHash: '0x' + Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join(''),
      returnValue: 'midnight1contract' + Math.random().toString(36).substr(2, 39),
      blockHeight: Math.floor(Math.random() * 1000000) + 100000,
      gasUsed: Math.floor(Math.random() * 500000) + 100000
    };
  }
}

// Export types that would normally come from @midnight-ntwrk/midnight-js-types
export type {
  WalletAPI as MidnightWalletAPI,
  TransactionResult as MidnightTransactionResult,
  ProofData as MidnightProofData,
  NodeClientConfig as MidnightNodeClientConfig,
  ProofProviderConfig as MidnightProofProviderConfig,
  NetworkStatus as MidnightNetworkStatus
};
