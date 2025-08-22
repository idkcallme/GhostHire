const { MidnightNodeClient } = require('@midnight-ntwrk/midnight-js-node-client');
const { CompactRuntime } = require('@midnight-ntwrk/compact-runtime');
const fs = require('fs');
const path = require('path');

// Configuration based on environment
const NETWORKS = {
  local: {
    rpcUrl: 'http://localhost:6565',
    networkId: 'midnight-local',
    deployerKey: process.env.LOCAL_DEPLOYER_KEY || 'default-local-key'
  },
  testnet: {
    rpcUrl: 'https://rpc.testnet.midnight.network',
    networkId: 'midnight-testnet',
    deployerKey: process.env.TESTNET_DEPLOYER_KEY
  },
  mainnet: {
    rpcUrl: 'https://rpc.midnight.network',
    networkId: 'midnight-mainnet',
    deployerKey: process.env.MAINNET_DEPLOYER_KEY
  }
};

async function deployContract() {
  const network = process.env.NETWORK || 'local';
  const config = NETWORKS[network];
  
  if (!config) {
    throw new Error(`Unknown network: ${network}`);
  }

  if (network !== 'local' && !config.deployerKey) {
    throw new Error(`Deployer key required for ${network} deployment`);
  }

  console.log(`🚀 Deploying JobBoard contract to ${network}...`);
  console.log(`📡 RPC URL: ${config.rpcUrl}`);

  try {
    // Initialize Midnight client
    const client = new MidnightNodeClient({
      rpcUrl: config.rpcUrl,
      networkId: config.networkId
    });

    // Read compiled contract
    const contractPath = path.join(__dirname, '../build/JobBoard.json');
    if (!fs.existsSync(contractPath)) {
      throw new Error('Contract not compiled. Run `npm run build` first.');
    }

    const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    
    // Initialize Compact runtime
    const runtime = new CompactRuntime(client);

    // Deploy contract
    console.log('📦 Deploying contract...');
    const deploymentResult = await runtime.deploy({
      contract: contractData,
      deployerKey: config.deployerKey,
      initialState: {
        jobCount: 0,
        jobs: {},
        applications: {},
        nullifiers: new Set()
      }
    });

    console.log('✅ Contract deployed successfully!');
    console.log(`📄 Contract Address: ${deploymentResult.contractAddress}`);
    console.log(`🔗 Transaction Hash: ${deploymentResult.transactionHash}`);

    // Save deployment info
    const deploymentInfo = {
      network,
      contractAddress: deploymentResult.contractAddress,
      transactionHash: deploymentResult.transactionHash,
      deployedAt: new Date().toISOString(),
      deployerAddress: deploymentResult.deployerAddress,
      blockHeight: deploymentResult.blockHeight
    };

    const deploymentPath = path.join(__dirname, `../deployments/${network}.json`);
    fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

    console.log(`💾 Deployment info saved to ${deploymentPath}`);

    // Update .env file for frontend
    updateEnvironmentFile(network, deploymentResult.contractAddress);

    return deploymentResult;

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

function updateEnvironmentFile(network, contractAddress) {
  const envFiles = [
    path.join(__dirname, '../../app/.env'),
    path.join(__dirname, '../../backend/.env')
  ];

  envFiles.forEach(envFile => {
    try {
      let envContent = '';
      if (fs.existsSync(envFile)) {
        envContent = fs.readFileSync(envFile, 'utf8');
      }

      // Update or add contract address
      const contractAddressLine = `VITE_JOB_BOARD_CONTRACT_ADDRESS=${contractAddress}`;
      const networkLine = `VITE_MIDNIGHT_NETWORK=${network}`;

      if (envContent.includes('VITE_JOB_BOARD_CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(
          /VITE_JOB_BOARD_CONTRACT_ADDRESS=.*/,
          contractAddressLine
        );
      } else {
        envContent += `\n${contractAddressLine}`;
      }

      if (envContent.includes('VITE_MIDNIGHT_NETWORK=')) {
        envContent = envContent.replace(
          /VITE_MIDNIGHT_NETWORK=.*/,
          networkLine
        );
      } else {
        envContent += `\n${networkLine}`;
      }

      fs.writeFileSync(envFile, envContent);
      console.log(`📝 Updated ${envFile}`);
    } catch (error) {
      console.warn(`⚠️ Could not update ${envFile}:`, error.message);
    }
  });
}

// Run deployment if this script is executed directly
if (require.main === module) {
  deployContract().catch(console.error);
}

module.exports = { deployContract };
