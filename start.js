#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting GhostHire Development Environment...\n');

// Check if we're in the right directory
const rootDir = process.cwd();
const packageJsonPath = path.join(rootDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Please run this script from the GhostHire root directory');
  process.exit(1);
}

// Check if backend .env exists
const backendEnvPath = path.join(rootDir, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  console.error('❌ Backend .env file not found. Please check backend setup.');
  process.exit(1);
}

// Start both frontend and backend
console.log('🔧 Starting backend and frontend servers...');
console.log('📝 Backend API: http://localhost:3001');
console.log('🌐 Frontend App: http://localhost:5173');
console.log('📊 Database Browser: npm run db:studio --workspace=backend');
console.log('\n' + '='.repeat(60) + '\n');

const isWindows = process.platform === 'win32';
const command = isWindows ? 'npm.cmd' : 'npm';

const child = spawn(command, ['run', 'dev:full'], {
  stdio: 'inherit',
  shell: true,
  cwd: rootDir
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down GhostHire...');
  child.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down GhostHire...');
  child.kill('SIGTERM');
  process.exit(0);
});

child.on('close', (code) => {
  console.log(`\n✅ GhostHire shut down with code ${code}`);
  process.exit(code);
});
