# 🔐 GhostHire Account Setup & Usage Guide

**Complete Guide to Setting Up and Using the Privacy-Preserving Job Board**

---

## 📋 Table of Contents

- [🚀 Quick Setup (5 Minutes)](#-quick-setup-5-minutes)
- [💼 Account Types & Features](#-account-types--features)
- [🔧 Environment Configuration](#-environment-configuration)
- [🌙 Midnight Network Setup](#-midnight-network-setup)
- [📱 User Account Management](#-user-account-management)
- [🔒 Privacy Settings](#-privacy-settings)
- [🛠️ Developer Account Setup](#%EF%B8%8F-developer-account-setup)
- [🧪 Testing Accounts](#-testing-accounts)
- [🚢 Production Deployment](#-production-deployment)

---

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- **Node.js 18+** and **npm 8+**
- **Git** for version control
- **Web browser** (Chrome, Firefox, Safari, Edge)

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/idkcallme/GhostHire.git
cd GhostHire

# Install all dependencies
npm install

# Start the application
npm run dev
```

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/docs

### 3. Create Your First Account
1. Open http://localhost:5173 in your browser
2. Click **"Get Started"** or **"Create Account"**
3. Choose your account type:
   - **Job Seeker**: Apply to jobs with privacy protection
   - **Employer**: Post jobs and review private applications
4. Complete the simple registration form
5. Start using GhostHire immediately!

---

## 💼 Account Types & Features

### 🔍 Job Seeker Account

**What You Can Do:**
- Browse privacy-preserving job listings
- Apply to jobs with zero-knowledge proofs
- Keep your personal details completely private
- Track application status and privacy scores
- Manage multiple applications simultaneously

**Privacy Features:**
- ✅ **Skill Privacy**: Prove competency without revealing exact levels
- ✅ **Location Privacy**: Show regional eligibility without precise address
- ✅ **Salary Privacy**: Confirm range compatibility without exact expectation
- ✅ **Identity Protection**: No personal information shared with employers
- ✅ **Application History**: Previous applications stay private

**Account Setup Process:**
```bash
# Access registration
Visit: http://localhost:5173/register

# Fill out basic information:
1. Email address (for login only)
2. Password (secure, stored encrypted)
3. Account type: "Job Seeker"
4. Privacy preferences (High/Balanced/Standard)

# Optional profile setup:
- Skills inventory (stays private)
- Location preferences (general regions)
- Experience level (broad categories)
- Privacy settings customization
```

### 🏢 Employer Account

**What You Can Do:**
- Post detailed job listings with requirements
- Receive privacy-preserving applications
- Review ZK-verified candidate qualifications
- Contact qualified applicants
- Manage multiple job postings

**Privacy-Respecting Features:**
- ✅ **Verified Qualifications**: Know candidates meet requirements
- ✅ **Privacy Scores**: See how much privacy candidates maintained
- ✅ **Anti-Fraud Protection**: Cryptographic proof against fake applications
- ✅ **Selective Contact**: Choose to request more details only from qualified candidates
- ✅ **Compliance Ready**: Privacy-first hiring process

**Account Setup Process:**
```bash
# Access registration
Visit: http://localhost:5173/register

# Fill out company information:
1. Company email address
2. Secure password
3. Account type: "Employer"
4. Company name and details
5. Verification preferences

# Complete company profile:
- Company description and culture
- Hiring preferences and policies
- Privacy commitment level
- Contact information for candidates
```

---

## 🔧 Environment Configuration

### Frontend Configuration

Create `app/.env` file:
```env
# Basic Application Settings
VITE_APP_NAME=GhostHire
VITE_API_URL=http://localhost:3001
VITE_APP_VERSION=1.0.0

# Midnight Network Configuration
VITE_MIDNIGHT_MODE=development
VITE_MIDNIGHT_NETWORK_ID=testnet-02
VITE_MIDNIGHT_RPC_URL=https://rpc.testnet-02.midnight.network
VITE_MIDNIGHT_INDEXER_URL=https://indexer.testnet-02.midnight.network
VITE_MIDNIGHT_PROOF_SERVER=http://localhost:6300

# Privacy Settings
VITE_ENABLE_REAL_ZK_PROOFS=true
VITE_PRIVACY_SCORE_THRESHOLD=70
VITE_DEFAULT_PRIVACY_MODE=high

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ACCESSIBILITY=true

# Development Settings
VITE_DEBUG_MODE=false
VITE_LOG_LEVEL=info
```

### Backend Configuration

Create `backend/.env` file:
```env
# Database Configuration
DATABASE_URL="file:./dev.db"
# For PostgreSQL: DATABASE_URL="postgresql://username:password@localhost:5432/ghosthire"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3001
NODE_ENV=development
HOST=localhost

# CORS Settings
CORS_ORIGIN=http://localhost:5173
CORS_CREDENTIALS=true

# Midnight Network
MIDNIGHT_NETWORK_MODE=development
MIDNIGHT_RPC_URL=https://rpc.testnet-02.midnight.network
MIDNIGHT_PROOF_PROVIDER_URL=http://localhost:6300
MIDNIGHT_CONTRACT_ADDRESS=""

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=info
LOG_FORMAT=combined

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🌙 Midnight Network Setup

### Development Mode (Default)
```bash
# Start with enhanced simulation
VITE_MIDNIGHT_MODE=development npm run dev
```

**Features:**
- Enhanced privacy simulation with realistic timing
- No external network dependencies
- Full privacy scoring and proof generation
- Perfect for development and demonstrations

### Production Mode (Real Network)
```bash
# Start with real Midnight Network
VITE_MIDNIGHT_MODE=production npm run dev
```

**Requirements:**
- Active internet connection
- Access to Midnight TestNet-02
- Optional: Local proof server for faster generation

**Setup Steps:**
1. **Configure Network Settings**:
   ```env
   VITE_MIDNIGHT_MODE=production
   VITE_MIDNIGHT_RPC_URL=https://rpc.testnet-02.midnight.network
   VITE_MIDNIGHT_INDEXER_URL=https://indexer.testnet-02.midnight.network
   ```

2. **Install Midnight Proof Server** (Optional):
   ```bash
   # Download from Midnight Network
   wget https://releases.midnight.network/proof-server-latest.tar.gz
   tar -xzf proof-server-latest.tar.gz
   ./proof-server --port 6300 --network testnet-02
   ```

3. **Test Connection**:
   ```bash
   # Verify network connectivity
   curl https://rpc.testnet-02.midnight.network/health
   
   # Check application logs for connection status
   # Look for: "✅ Real Midnight Network connected successfully!"
   ```

---

## 📱 User Account Management

### Registration Process

#### For Job Seekers:
```bash
# 1. Access registration page
Visit: http://localhost:5173/register

# 2. Fill out form:
Email: your-email@example.com
Password: SecurePassword123!
Confirm Password: SecurePassword123!
Account Type: Job Seeker
Privacy Level: High Privacy

# 3. Complete profile (optional but recommended):
- Skills inventory (remains private)
- General location preferences
- Experience level categories
- Salary range expectations
- Privacy settings customization
```

#### For Employers:
```bash
# 1. Access registration page
Visit: http://localhost:5173/register

# 2. Fill out company form:
Company Email: hiring@yourcompany.com
Password: SecureCompanyPassword123!
Company Name: Your Company Inc.
Account Type: Employer

# 3. Complete company profile:
- Company description and mission
- Industry and company size
- Hiring policies and preferences
- Privacy commitment statement
- Contact information for candidates
```

### Login Process
```bash
# Access login page
Visit: http://localhost:5173/login

# Enter credentials:
Email: your-email@example.com
Password: YourSecurePassword

# Optional: Enable "Remember me" for convenience
# (uses secure JWT tokens with expiration)
```

### Profile Management

#### Job Seeker Profile:
- **Skills Management**: Add/remove skills while keeping proficiency levels private
- **Privacy Settings**: Adjust privacy levels per application
- **Application History**: View all applications and their privacy scores
- **Preferences**: Set default location, salary ranges, and privacy modes

#### Employer Profile:
- **Company Information**: Update company details and hiring practices
- **Job Management**: Create, edit, and manage job postings
- **Application Review**: Access privacy-preserving candidate information
- **Communication**: Manage candidate outreach and responses

---

## 🔒 Privacy Settings

### Privacy Levels

#### 🔐 High Privacy (Recommended)
```javascript
Settings: {
  skillVisibility: "proof-only",        // Only prove competency, hide levels
  locationSharing: "region-only",       // Share continent/region, not city
  salaryDisclosure: "range-compatible", // Only confirm range compatibility
  identityProtection: "maximum",        // No personal identifiers
  applicationHistory: "private"         // Previous applications hidden
}

Privacy Score: 95-100%
Best For: Sensitive positions, privacy-conscious candidates
```

#### ⚖️ Balanced Privacy
```javascript
Settings: {
  skillVisibility: "categories-only",   // Show skill categories, not exact levels
  locationSharing: "city-region",       // Share city/region, not exact address
  salaryDisclosure: "range-indication", // Indicate general salary range
  identityProtection: "high",           // Minimal personal identifiers
  applicationHistory: "summary-only"    // Show application count only
}

Privacy Score: 80-94%
Best For: Standard positions, balanced approach
```

#### 🌟 Standard Privacy
```javascript
Settings: {
  skillVisibility: "broad-levels",      // Show general skill levels
  locationSharing: "metropolitan",      // Share metropolitan area
  salaryDisclosure: "expectations",     // Share salary expectations
  identityProtection: "moderate",       // Some personal information shared
  applicationHistory: "aggregated"      // Show aggregated statistics
}

Privacy Score: 65-79%
Best For: Open positions, faster hiring process
```

### Customizing Privacy Settings

```bash
# Access privacy settings
Visit: http://localhost:5173/settings/privacy

# Customize each aspect:
1. Skill Privacy Level
   - Proof Only (highest privacy)
   - Categories Only
   - General Levels
   - Detailed (lowest privacy)

2. Location Sharing
   - Region Only (continent/major region)
   - Country Level
   - State/Province Level
   - City Level (lowest privacy)

3. Salary Information
   - Range Compatible Only (just yes/no)
   - Broad Range Indication
   - Specific Range
   - Exact Expectation (lowest privacy)

4. Application History
   - Completely Private
   - Summary Statistics Only
   - Aggregated Data
   - Full History (lowest privacy)
```

---

## 🛠️ Developer Account Setup

### Development Environment
```bash
# Clone repository
git clone https://github.com/idkcallme/GhostHire.git
cd GhostHire

# Install dependencies
npm install

# Setup development database
cd backend
npx prisma generate
npx prisma db push

# Create development environment files
cp app/.env.example app/.env
cp backend/env.example backend/.env

# Start development servers
npm run dev
```

### API Access & Testing
```bash
# Backend API runs on: http://localhost:3001
# Available endpoints:

# Authentication
POST /api/auth/register    # Create new account
POST /api/auth/login       # Login to existing account
POST /api/auth/logout      # Logout and invalidate token

# Jobs
GET  /api/jobs            # List all jobs with privacy filters
POST /api/jobs            # Create new job posting
GET  /api/jobs/:id        # Get specific job details
PUT  /api/jobs/:id        # Update job posting (owner only)

# Applications
POST /api/applications    # Submit privacy-preserving application
GET  /api/applications    # List user's applications
GET  /api/applications/:id # Get specific application details

# ZK Proofs
POST /api/zk/generate-proof    # Generate zero-knowledge proof
POST /api/zk/verify-proof      # Verify submitted proof

# Privacy Analytics
GET  /api/analytics/privacy    # Privacy metrics and statistics
```

### Testing Account Credentials
```bash
# Pre-configured test accounts:

# Job Seeker Account
Email: jobseeker@test.com
Password: TestSeeker123!
Features: High privacy settings, sample skills

# Employer Account  
Email: employer@test.com
Password: TestEmployer123!
Features: Company profile, sample job postings

# Admin Account (Development)
Email: admin@test.com
Password: TestAdmin123!
Features: Full system access, analytics
```

---

## 🧪 Testing Accounts

### Sample Job Seeker Profiles

#### High Privacy Developer
```bash
Email: dev.private@test.com
Password: PrivateDev123!
Skills: React, TypeScript, Node.js, Python
Privacy Level: Maximum (98% privacy score)
Location: Europe (no specific country)
```

#### Balanced Privacy Designer
```bash
Email: designer.balanced@test.com
Password: BalancedDesign123!
Skills: UI/UX, Figma, Adobe Creative Suite
Privacy Level: Balanced (87% privacy score)
Location: North America (regional)
```

### Sample Employer Profiles

#### Tech Startup
```bash
Email: hiring@techstartup.test
Password: StartupHiring123!
Company: InnovateTech Inc.
Jobs: Senior React Developer, UX Designer
Hiring Approach: Privacy-respecting, fast process
```

#### Enterprise Corporation
```bash
Email: hr@enterprise.test
Password: EnterpriseHR123!
Company: Global Solutions Corp
Jobs: Multiple enterprise positions
Hiring Approach: Traditional with privacy compliance
```

### Test Scenarios

#### Complete Application Flow
```bash
# 1. Login as employer and post a job
# 2. Login as job seeker and apply with ZK proof
# 3. View application from employer perspective
# 4. Test privacy preservation at each step
```

#### Privacy Score Validation
```bash
# 1. Apply with different privacy levels
# 2. Verify privacy scores match expected ranges
# 3. Confirm no private data leaks to employer view
# 4. Test anti-Sybil protection (duplicate applications)
```

---

## 🚢 Production Deployment

### Environment Setup for Production

#### Frontend Production Environment
```env
# app/.env.production
VITE_MIDNIGHT_MODE=production
VITE_API_URL=https://api.yourdomain.com
VITE_MIDNIGHT_RPC_URL=https://rpc.testnet-02.midnight.network
VITE_MIDNIGHT_INDEXER_URL=https://indexer.testnet-02.midnight.network
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=error
```

#### Backend Production Environment
```env
# backend/.env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/ghosthire_prod
JWT_SECRET=your-super-secure-production-jwt-secret
CORS_ORIGIN=https://yourdomain.com
MIDNIGHT_NETWORK_MODE=production
LOG_LEVEL=warn
```

### Deployment Options

#### Option 1: Docker Deployment
```bash
# Build and deploy with Docker Compose
docker-compose -f docker-compose.production.yml up -d

# Scale services as needed
docker-compose up -d --scale app=3 --scale api=2

# Monitor logs
docker-compose logs -f
```

#### Option 2: Cloud Deployment
```bash
# Frontend (Vercel)
cd app
vercel --prod

# Backend (Railway/Heroku)
railway login
railway up --environment production

# Database (managed service)
# Use PostgreSQL from AWS RDS, Google Cloud SQL, etc.
```

### Production Account Management

#### Admin Account Setup
```bash
# Create admin account via CLI (development only)
cd backend
npm run seed:admin

# Or create via API
POST /api/auth/register
{
  "email": "admin@yourdomain.com",
  "password": "SecureAdminPassword123!",
  "role": "admin"
}
```

#### User Registration Flow
```bash
# Production registration includes:
1. Email verification
2. Terms of service acceptance
3. Privacy policy acknowledgment
4. Account type verification
5. Security question setup (optional)
```

### Security Considerations

#### Authentication Security
- Use strong JWT secrets (256-bit minimum)
- Enable HTTPS in production
- Implement rate limiting
- Add CSRF protection
- Use secure session cookies

#### Privacy Protection
- Encrypt sensitive data at rest
- Use secure communication channels
- Implement data retention policies
- Regular security audits
- Compliance with privacy regulations (GDPR, CCPA)

---

## 🔧 Troubleshooting Account Issues

### Common Account Problems

#### Registration Issues
```bash
# Problem: Email already exists
Solution: Use password reset or try different email

# Problem: Weak password error
Solution: Use password with 8+ chars, uppercase, lowercase, number, symbol

# Problem: Account verification failing
Solution: Check email spam folder, resend verification
```

#### Login Problems
```bash
# Problem: Invalid credentials
Solution: Use password reset, check caps lock

# Problem: Account locked
Solution: Wait 15 minutes or contact support

# Problem: JWT token expired
Solution: Login again, tokens expire for security
```

#### Privacy Settings Issues
```bash
# Problem: Privacy score lower than expected
Solution: Increase privacy levels in settings

# Problem: Applications not private enough
Solution: Review privacy settings before applying

# Problem: Can't change privacy level
Solution: Some settings locked after application submission
```

### Getting Help

**Support Channels:**
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/idkcallme/GhostHire/issues)
- 💬 **Questions**: [GitHub Discussions](https://github.com/idkcallme/GhostHire/discussions)
- 📧 **Account Issues**: Create issue with account details (no passwords!)
- 🌙 **Midnight Network**: [Official Discord](https://discord.gg/midnight)

**Self-Help Resources:**
- Check browser console for error messages
- Verify environment configuration
- Test with different browsers
- Clear browser cache and cookies
- Check network connectivity

---

## 🎯 Next Steps

### For Job Seekers
1. **Complete your profile** with skills and preferences
2. **Set your privacy level** based on your needs
3. **Browse available jobs** and apply with ZK proofs
4. **Track your applications** and privacy scores
5. **Engage with employers** while maintaining privacy

### For Employers
1. **Set up your company profile** with hiring policies
2. **Post your first job** with detailed requirements
3. **Review privacy-preserving applications**
4. **Contact qualified candidates** respectfully
5. **Provide feedback** to improve the platform

### For Developers
1. **Explore the codebase** and architecture
2. **Run the test suite** to understand functionality
3. **Experiment with privacy features**
4. **Contribute improvements** via pull requests
5. **Build extensions** for your use case

---

**🎉 Welcome to GhostHire - Where Privacy Meets Opportunity!** 🌙

*Your journey to privacy-preserving hiring starts here.*
