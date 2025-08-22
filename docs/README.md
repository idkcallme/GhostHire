# GhostHire Documentation

Welcome to GhostHire, a privacy-preserving job board built on Midnight Network that uses zero-knowledge proofs to verify job eligibility without revealing sensitive applicant data.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Technical Details](#technical-details)
- [API Reference](#api-reference)
- [Security & Privacy](#security--privacy)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Overview

GhostHire solves the privacy problem in job applications by allowing candidates to prove they meet job requirements (skills, location, salary expectations) without revealing their exact data. This is achieved through zero-knowledge proofs (ZKPs) built on Midnight Network.

### Key Features

- **Zero-Knowledge Proofs**: Prove eligibility without revealing sensitive data
- **Skill Threshold Verification**: Prove skills meet minimum requirements
- **Region Membership**: Prove location eligibility using Merkle trees
- **Salary Range Checks**: Prove salary expectations fit within budget
- **Anti-Sybil Protection**: Per-applicant nullifiers prevent spam
- **Selective Disclosure**: Optionally reveal specific attributes post-application

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web DApp      │    │  Proof Server   │    │  Midnight       │
│   (React/TS)    │◄──►│   (Docker)      │◄──►│  Network        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Wallet SDK    │    │  Compact        │    │  Mock Issuer    │
│   Integration   │    │  Contracts      │    │  (Node.js)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Job Creation**: Employers create jobs with requirements (skill thresholds, regions, salary range)
2. **Application**: Applicants generate ZK proofs proving they meet requirements
3. **Verification**: Smart contract verifies proofs on-chain
4. **Acceptance**: Only proof validity and minimal public signals are stored

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Midnight wallet
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ghosthire.git
   cd ghosthire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start infrastructure**
   ```bash
   npm run infra:up
   ```

4. **Deploy contracts**
   ```bash
   npm run deploy
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

### Development Setup

1. **Start all services**
   ```bash
   # Start infrastructure (proof server, mock issuer, database)
   npm run infra:up
   
   # Start development server
   npm run dev
   
   # In another terminal, start mock issuer
   npm run dev --workspace=mock-issuer
   ```

2. **Run tests**
   ```bash
   npm run test
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## Technical Details

### Zero-Knowledge Proofs

GhostHire uses ZKPs to prove three main statements:

1. **Skill Thresholds**: ∀k, skills[k] ≥ thresholds[k]
2. **Region Membership**: region ∈ allowed_regions (Merkle tree)
3. **Salary Range**: min_salary ≤ expected_salary ≤ max_salary

### Smart Contract

The main contract (`JobBoard.compact`) handles:

- Job registration with requirements
- Proof verification
- Application tracking
- Anti-replay protection via nullifiers

### Circuit Design

The ZK circuit (`eligibility.circom`) implements:

- Skill comparison using GreaterEqualThan components
- Merkle tree membership verification
- Salary range checks
- Nullifier generation using Poseidon hash

### Proof Generation Flow

1. **Witness Building**: Client constructs private inputs
2. **Proof Generation**: Local proof server generates ZK proof
3. **Verification**: Contract verifies proof on-chain
4. **Application**: Only proof + minimal public signals stored

## API Reference

### Mock Issuer API

The mock issuer provides demo data and credential generation:

#### Endpoints

- `GET /health` - Health check
- `GET /api/profiles` - Get all mock profiles
- `GET /api/profiles/:id` - Get specific profile
- `POST /api/profiles/:id/credential` - Generate credential for profile
- `GET /api/jobs` - Get all mock jobs
- `GET /api/jobs/:id` - Get specific job
- `POST /api/applications/generate` - Generate sample application data

#### Example Usage

```javascript
// Get all profiles
const response = await fetch('/api/profiles');
const { profiles } = await response.json();

// Generate credential
const credentialResponse = await fetch(`/api/profiles/${profileId}/credential`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ jobId: 1 })
});
const { credential, nullifier } = await credentialResponse.json();
```

### Frontend API

The React application uses these main hooks and utilities:

- `useWallet()` - Wallet connection and management
- `proofGenerator` - ZK proof generation utilities
- React Query for data fetching and caching

## Security & Privacy

### Privacy Guarantees

- **Witness Privacy**: Sensitive data never leaves the client
- **Proof Privacy**: Only proof validity is revealed, not inputs
- **Selective Disclosure**: Optional post-proof attribute revelation

### Security Measures

- **Anti-Replay**: Per-application nullifiers prevent duplicate submissions
- **Binding**: Proofs are bound to specific jobs and applicants
- **Verification**: All proofs verified on-chain before acceptance

### Threat Model

GhostHire protects against:

- **Data Leakage**: Sensitive applicant data is never transmitted
- **Sybil Attacks**: Cryptographic nullifiers prevent spam
- **Replay Attacks**: Each application has unique nullifier
- **Front-running**: Proofs bound to specific job and applicant

## Development Guide

### Project Structure

```
ghosthire/
├── contracts/           # Compact contracts
│   ├── JobBoard.compact
│   ├── circuits/        # ZK circuits
│   └── tests/          # Contract tests
├── app/                # React DApp
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── zk/         # Witness builders & proof calls
│   │   └── wallet/     # Wallet connectors
│   └── public/
├── mock-issuer/        # Mock attribute issuer
├── infra/              # Infrastructure setup
│   ├── docker-compose.yml
│   └── scripts/
└── docs/               # Documentation
```

### Adding New Features

1. **New Proof Types**: Add circuits in `contracts/circuits/`
2. **UI Components**: Create in `app/src/components/`
3. **Pages**: Add to `app/src/pages/`
4. **API Endpoints**: Extend mock issuer in `mock-issuer/src/`

### Testing

```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:contracts
npm run test:app

# Run E2E tests
npm run test:e2e
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Husky for pre-commit hooks

## Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   # Set environment variables
   export MIDNIGHT_NETWORK=mainnet
   export PROOF_SERVER_URL=https://your-proof-server.com
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Deploy Contracts**
   ```bash
   npm run deploy --workspace=contracts
   ```

4. **Deploy Infrastructure**
   ```bash
   # Deploy to your preferred cloud provider
   docker-compose -f infra/docker-compose.prod.yml up -d
   ```

### Monitoring

- Health checks for all services
- Log aggregation and monitoring
- Performance metrics
- Error tracking

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](../LICENSE) file for details.

## Support

- [Documentation](https://docs.ghosthire.dev)
- [GitHub Issues](https://github.com/your-username/ghosthire/issues)
- [Discord Community](https://discord.gg/ghosthire)

## Acknowledgments

- Built on [Midnight Network](https://midnight.network)
- Uses [Circom](https://docs.circom.io/) for ZK circuits
- Inspired by privacy-first design principles
