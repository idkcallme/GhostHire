# 🔐 GhostHire Complete Tutorial & Setup Guide

**Privacy-Preserving Job Board with Real Midnight Network Integration**

---

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Detailed Setup](#%EF%B8%8F-detailed-setup)
- [🌙 Midnight Network Integration](#-midnight-network-integration)
- [💼 User Guide](#-user-guide)
- [🔒 Privacy Features](#-privacy-features)
- [🛠️ Developer Guide](#%EF%B8%8F-developer-guide)
- [🧪 Testing & Validation](#-testing--validation)
- [🚢 Deployment](#-deployment)
- [🔧 Troubleshooting](#-troubleshooting)

---

## 🌟 Overview

### What is GhostHire?

GhostHire is a revolutionary job board that solves the **privacy paradox** in hiring:
- **Job seekers** need to prove their qualifications
- **Employers** need verified candidate information  
- **Both parties** want to protect sensitive data

**Solution**: Zero-Knowledge Proofs powered by the Midnight Network

### 🎯 Key Innovation

**Prove you're qualified without revealing personal details!**

```
Traditional Job Application:
"I have 5 years React experience, live in New York, expect $120k salary"
❌ All personal data exposed

GhostHire ZK Application:
"I meet your technical requirements" + ZK Proof
✅ Qualifications verified, privacy protected
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** 
- **npm 8+**
- **Git**
- **Optional**: Docker for production deployment

### 1-Minute Setup

```bash
# Clone the repository
git clone https://github.com/idkcallme/GhostHire.git
cd GhostHire

# Install all dependencies
npm install

# Start the full application
npm run dev

# 🎉 Open browser to http://localhost:5173
```

**That's it!** The application runs with simulated Midnight Network features.

---

## ⚙️ Detailed Setup

### Step 1: Environment Setup

```bash
# Clone and navigate
git clone https://github.com/idkcallme/GhostHire.git
cd GhostHire

# Check Node.js version (should be 18+)
node --version

# Install dependencies for all workspaces
npm install
```

### Step 2: Database Setup

```bash
# Navigate to backend
cd backend

# Create database and run migrations
npx prisma generate
npx prisma db push

# Optional: Seed with sample data
npx prisma db seed
```

### Step 3: Environment Configuration

**Frontend (.env)**:
```bash
# Copy environment template
cp app/.env.example app/.env
```

Edit `app/.env`:
```env
# Basic Configuration
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=GhostHire

# Midnight Network Configuration
VITE_MIDNIGHT_MODE=development          # 'development' or 'production'
VITE_MIDNIGHT_NETWORK_ID=testnet-02     # Midnight network ID
VITE_MIDNIGHT_RPC_URL=https://rpc.testnet-02.midnight.network
VITE_MIDNIGHT_INDEXER_URL=https://indexer.testnet-02.midnight.network
VITE_MIDNIGHT_PROOF_SERVER=http://localhost:6300

# Privacy Settings
VITE_ENABLE_REAL_ZK_PROOFS=true         # Enable real ZK proof generation
VITE_PRIVACY_SCORE_THRESHOLD=70         # Minimum privacy score
```

**Backend (.env)**:
```bash
# Copy environment template
cp backend/env.example backend/.env
```

Edit `backend/.env`:
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# API Configuration
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Midnight Network
MIDNIGHT_NETWORK_MODE=development
MIDNIGHT_RPC_URL=https://rpc.testnet-02.midnight.network
MIDNIGHT_PROOF_PROVIDER_URL=http://localhost:6300
```

### Step 4: Start Services

**Option A: All Services Together**
```bash
# Start everything with one command
npm run dev
```

**Option B: Individual Services**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd app
npm run dev

# Terminal 3: Optional Midnight Proof Server
cd proof-server
npm start
```

---

## 🌙 Midnight Network Integration

### Real Midnight Network Packages

GhostHire uses **actual Midnight Network SDK packages**:

```json
{
  "@midnight-ntwrk/wallet": "^5.0.0",
  "@midnight-ntwrk/wallet-api": "^5.0.0", 
  "@midnight-ntwrk/zswap": "^4.0.0",
  "@midnight-ntwrk/compact-runtime": "^0.8.1",
  "@midnight-ntwrk/ledger": "^4.0.0",
  "@midnight-ntwrk/midnight-js-http-client-proof-provider": "^2.0.2",
  "@midnight-ntwrk/midnight-js-network-id": "^2.0.2",
  "@midnight-ntwrk/midnight-js-types": "^2.0.2",
  "@midnight-ntwrk/wallet-sdk-hd": "^2.0.0"
}
```

### Midnight Network Modes

#### 🔄 Development Mode (Default)
- Uses enhanced simulation with realistic timing
- No external network dependencies
- Perfect for development and testing
- Includes privacy scoring and proof generation

```bash
# Start in development mode
VITE_MIDNIGHT_MODE=development npm run dev
```

#### 🌙 Production Mode (Real Network)
- Connects to actual Midnight TestNet-02
- Real ZK proof generation via Midnight SDK
- Requires network connectivity
- Full blockchain integration

```bash
# Start with real Midnight Network
VITE_MIDNIGHT_MODE=production npm run dev
```

### Smart Contracts (Compact)

Deploy real Midnight Network smart contracts:

```bash
# Navigate to contracts directory
cd contracts

# Install Compact compiler
npm install -g @midnight-ntwrk/compact

# Compile contracts
npm run compile

# Deploy to TestNet
npm run deploy:testnet

# Verify deployment
npm run verify
```

**JobBoard.compact Contract Features**:
- Privacy-preserving job storage
- ZK proof verification
- Anti-Sybil protection
- Application tracking

---

## 💼 User Guide

### For Job Seekers

#### Step 1: Browse Available Jobs
1. Visit the GhostHire homepage
2. Click **"Browse Jobs"** 
3. Filter by skills, location, or salary range
4. Find interesting positions

#### Step 2: Connect Wallet (Privacy Mode)
1. Click **"Connect Wallet"** on any job
2. Choose your privacy preferences:
   - **High Privacy**: Minimal data sharing
   - **Balanced**: Some details for better matching  
   - **Transparent**: More details, faster hiring

#### Step 3: Generate Privacy Proof
1. Click **"Apply Privately"** on a job
2. **Skill Assessment** (Step 1/3):
   ```
   Rate your skills (stays private):
   ✓ React: ████████░░ 8/10
   ✓ TypeScript: ██████░░░░ 6/10
   ✓ Node.js: ███████░░░ 7/10
   ```

2. **Location Preference** (Step 2/3):
   ```
   Choose your region preference:
   ○ Remote Worldwide
   ○ North America  
   ● Europe (selected)
   ○ Asia Pacific
   ```

3. **Generate ZK Proof** (Step 3/3):
   ```
   🔒 Generating privacy-preserving proof...
   
   ⚡ Proof Generation: Complete
   🛡️ Privacy Score: 94%
   ✅ Eligibility: Confirmed
   🔐 Your details remain private
   ```

#### Step 4: Submit Application
1. Review your privacy proof summary
2. Click **"Submit Private Application"**
3. Receive blockchain receipt and application ID
4. Track status in your dashboard

### For Employers

#### Step 1: Post a Job
1. Click **"Post a Job"**
2. **Job Details** (Step 1/4):
   ```
   Title: Senior React Developer
   Company: TechCorp Inc.
   Description: Build next-gen privacy apps...
   ```

3. **Required Skills** (Step 2/4):
   ```
   Add required skills:
   + React (Required)
   + TypeScript (Preferred)  
   + Node.js (Nice to have)
   ```

4. **Compensation** (Step 3/4):
   ```
   Salary Range: $80,000 - $120,000
   Benefits: Health, Dental, Remote OK
   ```

5. **Location** (Step 4/4):
   ```
   Allowed Regions:
   ☑ Remote Worldwide
   ☑ North America
   ☐ Europe
   ☑ Asia Pacific
   ```

#### Step 2: Review Applications
1. Go to **"My Posted Jobs"**
2. See privacy-preserving applications:
   ```
   Application #A1234
   ✅ Meets all requirements (ZK verified)
   🛡️ Privacy Score: 91%
   🔐 Skills: Verified privately
   📍 Region: Eligible (no exact location)
   💰 Salary: Within range (no exact expectation)
   
   [Contact Applicant] [Request Details]
   ```

3. Contact qualified candidates while respecting privacy

---

## 🔒 Privacy Features

### What Stays Completely Private

✅ **Exact Skill Levels**: "I know React" not "React: 8/10"  
✅ **Precise Location**: "I'm in Europe" not "Berlin, Germany"  
✅ **Specific Salary**: "Within your range" not "$95,000"  
✅ **Personal Identity**: Zero personal identifiers shared  
✅ **Application History**: Previous applications stay private  

### What Gets Proven Publicly

✅ **Qualification Match**: ZK proof of meeting requirements  
✅ **Eligibility Verification**: Cryptographic confirmation  
✅ **Uniqueness**: Anti-Sybil protection (haven't applied before)  
✅ **Authenticity**: Proof cannot be forged or replayed  

### Privacy Score Calculation

```javascript
Privacy Score = Base Match (60%) + Privacy Bonus (25%) + Diversification (15%)

Example:
- 5/5 required skills matched: +60%
- 8 total skills (noise): +24%  
- 4 skill categories (diversity): +12%
- Final Score: 96% Privacy Protection
```

### Zero-Knowledge Technology

**Circom Circuits** (Enhanced Mode):
```circom
template EligibilityCheck() {
    signal input skills[10];        // Private: Your skill levels
    signal input requirements[5];   // Public: Job requirements  
    signal input location;          // Private: Your location
    signal input salary;            // Private: Salary expectation
    
    signal output eligible;         // Public: Are you qualified?
    signal output nullifier;        // Public: Uniqueness proof
    
    // ZK logic: Prove eligibility without revealing details
}
```

---

## 🛠️ Developer Guide

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Express API   │    │ Midnight Network│
│                 │    │                 │    │                 │
│ • UI Components │◄──►│ • REST APIs     │◄──►│ • Smart Contract│
│ • ZK Proof Gen  │    │ • WebSocket     │    │ • ZK Verification│
│ • Wallet Connect│    │ • Database      │    │ • Blockchain    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components

**Frontend Architecture**:
```typescript
// Real Midnight SDK Integration
import { WalletBuilder } from '@midnight-ntwrk/wallet';
import { NetworkId } from '@midnight-ntwrk/zswap';

class GracefulMidnightProvider {
  async generateProof(data: ProofData): Promise<ZKProof> {
    try {
      // Try real Midnight Network first
      const wallet = await WalletBuilder.build(/* TestNet config */);
      return await this.generateRealProof(wallet, data);
    } catch (error) {
      // Graceful fallback to enhanced simulation
      return await this.generateSimulatedProof(data);
    }
  }
}
```

**Backend Services**:
```typescript
// Midnight Network Service
export class MidnightNetworkService {
  private httpProofProvider: HttpClientProofProvider;
  
  async verifyProof(proof: ZKProof): Promise<boolean> {
    // Real verification via Midnight SDK
    return await this.httpProofProvider.verifyProof(proof);
  }
}
```

### Development Workflow

```bash
# 1. Make changes to frontend
cd app/src/components/
# Edit React components...

# 2. Update backend APIs  
cd backend/src/routes/
# Modify Express endpoints...

# 3. Test changes
npm run test:e2e

# 4. Build for production
npm run build

# 5. Deploy
npm run deploy
```

### Adding New Features

**Example: Add New Privacy Mode**

1. **Update Types**:
```typescript
// app/src/types/privacy.ts
export type PrivacyMode = 'stealth' | 'balanced' | 'transparent' | 'maximum';
```

2. **Modify ZK Service**:
```typescript
// app/src/services/midnightZK.ts
export class MidnightZKService {
  async generateProofWithMode(data: any, mode: PrivacyMode) {
    const privacyMultiplier = this.getPrivacyMultiplier(mode);
    // Generate proof with privacy adjustments...
  }
}
```

3. **Update UI Components**:
```typescript
// app/src/components/PrivacySelector.tsx
export function PrivacySelector() {
  const modes = ['stealth', 'balanced', 'transparent', 'maximum'];
  // Render privacy mode selection...
}
```

---

## 🧪 Testing & Validation

### Automated Testing

**End-to-End Test Suite**:
```bash
# Run complete E2E tests
npm run test:e2e

# Run specific test suites
npm run test:jobs        # Job posting/browsing
npm run test:privacy     # ZK proof generation  
npm run test:applications # Application workflow
```

**Test Coverage Areas**:
- ✅ Job posting and display
- ✅ Privacy proof generation
- ✅ Application submission
- ✅ Wallet connection simulation
- ✅ Midnight Network integration
- ✅ Error handling and fallbacks

### Manual Testing Checklist

**Job Poster Workflow**:
- [ ] Create account and login
- [ ] Post job with all required fields
- [ ] See job appear in browse section
- [ ] Receive ZK-verified applications
- [ ] Contact qualified candidates

**Job Seeker Workflow**:
- [ ] Browse available positions
- [ ] Connect wallet (simulated)
- [ ] Generate privacy-preserving proof
- [ ] Submit application successfully
- [ ] Track application status
- [ ] Receive confirmation receipt

**Privacy Validation**:
- [ ] Skill levels stay private
- [ ] Location remains general
- [ ] Salary expectations hidden
- [ ] ZK proofs verify correctly
- [ ] Privacy scores > 90%

### Midnight Network Testing

**Development Mode Tests**:
```bash
# Test with simulated Midnight Network
VITE_MIDNIGHT_MODE=development npm run test

# Verify graceful fallbacks work
npm run test:fallback-mode
```

**Production Mode Tests**:
```bash
# Test with real Midnight Network (requires connectivity)
VITE_MIDNIGHT_MODE=production npm run test:network

# Test smart contract interactions
npm run test:contracts
```

---

## 🚢 Deployment

### Local Development
```bash
# Start full development environment
npm run dev

# Access points:
# Frontend: http://localhost:5173
# Backend: http://localhost:3001  
# API Docs: http://localhost:3001/docs
```

### Production Deployment

#### Option 1: Traditional VPS/Cloud

```bash
# Build for production
npm run build

# Start production services
NODE_ENV=production npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
```

#### Option 2: Docker Deployment

```bash
# Build and start with Docker Compose
docker-compose -f docker-compose.production.yml up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose up -d --scale app=3
```

#### Option 3: Cloud Deployment (Vercel + Railway)

**Frontend (Vercel)**:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd app
vercel --prod
```

**Backend (Railway)**:
```bash
# Connect to Railway
railway login
railway link

# Deploy backend with environment variables
railway up --environment production
```

### Environment Variables for Production

**Frontend (.env.production)**:
```env
VITE_MIDNIGHT_MODE=production
VITE_API_URL=https://your-api-domain.com
VITE_MIDNIGHT_RPC_URL=https://rpc.testnet-02.midnight.network
```

**Backend (.env.production)**:
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
CORS_ORIGIN=https://your-frontend-domain.com
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Node.js Version Conflicts
```bash
# Check Node version (must be 18+)
node --version

# Use nvm to switch versions
nvm install 18
nvm use 18
```

#### 2. Midnight Network Connection Issues
```bash
# Check if running in correct mode
echo $VITE_MIDNIGHT_MODE

# Test network connectivity
curl https://rpc.testnet-02.midnight.network/health

# Fall back to development mode
VITE_MIDNIGHT_MODE=development npm run dev
```

#### 3. Database Connection Problems
```bash
# Reset database
cd backend
rm -f prisma/dev.db
npx prisma db push
npx prisma generate
```

#### 4. Port Conflicts
```bash
# Check what's running on ports
netstat -tulpn | grep :3001
netstat -tulpn | grep :5173

# Kill processes if needed
kill -9 $(lsof -t -i:3001)
kill -9 $(lsof -t -i:5173)
```

#### 5. Build Errors
```bash
# Clear all caches
npm run clean
npm install

# Rebuild from scratch
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Getting Help

**Check Application Logs**:
```bash
# Frontend logs (browser console)
Open DevTools → Console tab

# Backend logs  
cd backend
npm run dev # Check terminal output

# Docker logs
docker-compose logs -f
```

**Community Support**:
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/idkcallme/GhostHire/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/idkcallme/GhostHire/discussions)  
- 🌙 **Midnight Network**: [Official Discord](https://discord.gg/midnight)
- 📧 **Direct Contact**: Create an issue with detailed logs

---

## 🎯 Advanced Configuration

### Custom Privacy Settings

**Ultra-High Privacy Mode**:
```typescript
// app/src/config/privacy.ts
export const ULTRA_PRIVACY_CONFIG = {
  minPrivacyScore: 95,
  skillNoiseFactor: 0.8,
  locationObfuscation: 'continent',
  salaryBanding: 'quartile',
  additionalDiversification: true
};
```

**Performance Optimization**:
```typescript
// app/src/config/performance.ts
export const PERFORMANCE_CONFIG = {
  proofGenerationTimeout: 30000,
  walletConnectionTimeout: 10000,
  enableProofCaching: true,
  batchApplications: false
};
```

### Smart Contract Customization

**Modify Compact Contract**:
```compact
// contracts/JobBoard.compact
contract JobBoard {
  // Add custom privacy parameters
  function postJob(
    jobData: JobData,
    privacyLevel: PrivacyLevel,
    customSettings: PrivacySettings
  ) -> Result<JobId, Error> {
    // Custom job posting logic
  }
}
```

### Analytics and Monitoring

**Privacy Analytics Dashboard**:
```typescript
// Add to backend/src/routes/analytics.ts
router.get('/privacy-metrics', async (req, res) => {
  const metrics = {
    averagePrivacyScore: await calculateAveragePrivacyScore(),
    proofGenerationTimes: await getProofTimes(),
    networkConnectivity: await testMidnightConnection(),
    applicationSuccessRate: await getSuccessRate()
  };
  res.json(metrics);
});
```

---

**🎉 Congratulations!** You now have a complete understanding of GhostHire and can set up, use, and customize the privacy-preserving job board.

**Next Steps**:
- 🚀 Deploy to production with real Midnight Network
- 🔧 Customize privacy settings for your use case  
- 🌟 Contribute improvements to the open-source project
- 📢 Share your privacy-preserving hiring success stories!

---

*Built with 🌙 for the Midnight Network "Protect That Data" Challenge*

**GhostHire: Where Privacy Meets Opportunity**
