// Test what's actually exported from Midnight packages
async function testImports() {
  try {
    console.log('Testing @midnight-ntwrk/wallet-api...');
    const walletApi = await import('@midnight-ntwrk/wallet-api');
    console.log('wallet-api exports:', Object.keys(walletApi));
    
    console.log('\nTesting @midnight-ntwrk/compact-runtime...');
    const runtime = await import('@midnight-ntwrk/compact-runtime');
    console.log('compact-runtime exports:', Object.keys(runtime));
    
    console.log('\nTesting @midnight-ntwrk/ledger...');
    const ledger = await import('@midnight-ntwrk/ledger');
    console.log('ledger exports:', Object.keys(ledger));
    
    console.log('\nTesting @midnight-ntwrk/midnight-js-http-client-proof-provider...');
    const proofProvider = await import('@midnight-ntwrk/midnight-js-http-client-proof-provider');
    console.log('proof-provider exports:', Object.keys(proofProvider));
    
  } catch (error) {
    console.error('Import test failed:', error);
  }
}

testImports();
