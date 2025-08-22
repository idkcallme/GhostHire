# Contributing to GhostHire

Thank you for your interest in contributing to GhostHire! This document provides guidelines for contributing to our privacy-preserving job board project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Git
- Basic understanding of TypeScript, React, and zero-knowledge proofs

### Development Setup
```bash
# Clone the repository
git clone https://github.com/idkcallme/GhostHire.git
cd GhostHire

# Install dependencies
npm install

# Set up the database
cd backend
npx prisma generate
npx prisma db push

# Start development servers
npm run dev:all
```

## 📝 How to Contribute

### 1. Fork and Clone
- Fork the repository on GitHub
- Clone your fork locally
- Add the original repository as upstream

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow our coding standards
- Add tests for new functionality
- Update documentation as needed

### 4. Test Your Changes
```bash
# Run all tests
npm run test

# Run E2E tests
npm run test:e2e

# Test the full application flow
npm run dev:all
```

### 5. Submit a Pull Request
- Push your branch to your fork
- Create a pull request with a clear description
- Reference any related issues

## 🎯 Areas for Contribution

### High Priority
- **ZK Circuit Optimization** - Improve proof generation speed
- **Privacy Features** - Additional privacy-preserving mechanisms
- **Mobile Responsiveness** - Enhanced mobile experience
- **Performance** - Frontend and backend optimizations

### Medium Priority
- **UI/UX Improvements** - Design enhancements
- **Testing** - Additional test coverage
- **Documentation** - Tutorials and guides
- **Accessibility** - WCAG compliance improvements

### Advanced
- **Real Midnight Integration** - Actual blockchain integration
- **Advanced Analytics** - Privacy-preserving metrics
- **Scalability** - Database and API optimizations
- **Security Audits** - Cryptographic security reviews

## 📋 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper error handling with try/catch
- Document complex functions with JSDoc

### React
- Use functional components with hooks
- Follow React best practices
- Use proper prop typing
- Implement proper error boundaries

### Zero-Knowledge
- Follow Circom best practices for circuits
- Properly document proof generation logic
- Use secure randomness for nullifiers
- Validate all ZK proofs server-side

### Git
- Use conventional commit messages
- Keep commits atomic and focused
- Write clear commit descriptions
- Rebase instead of merge for clean history

## 🧪 Testing Guidelines

### Frontend Tests
- Unit tests for components
- Integration tests for user flows
- E2E tests for critical paths

### Backend Tests
- API endpoint testing
- Database integration tests
- ZK proof verification tests

### Privacy Tests
- Verify no sensitive data leakage
- Test privacy score calculations
- Validate nullifier uniqueness

## 📖 Documentation

### Code Documentation
- Document all public APIs
- Explain complex algorithms
- Add inline comments for ZK circuits
- Update README for new features

### User Documentation
- Update setup instructions
- Add new feature tutorials
- Include troubleshooting guides
- Maintain API documentation

## 🔒 Security

### Reporting Security Issues
- **DO NOT** open public issues for security vulnerabilities
- Email security@ghosthire.dev with details
- Allow time for proper disclosure and patching

### Security Best Practices
- Never commit secrets or private keys
- Validate all user inputs
- Use proper authentication and authorization
- Follow OWASP security guidelines

## 📞 Getting Help

### Communication Channels
- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Email** - security@ghosthire.dev for security issues

### Code Review Process
1. All contributions require code review
2. Maintainers will review within 48 hours
3. Address feedback promptly
4. Squash commits before final merge

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Invited to join the core team (for significant contributions)

## 📄 License

By contributing to GhostHire, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for helping make privacy-preserving recruitment a reality! 🔐✨
