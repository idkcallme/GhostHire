#!/bin/bash

# GhostHire - Complete Production Setup Script
echo "🚀 Setting up GhostHire - Privacy-Preserving Job Board"
echo "================================================================"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_NODE="18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_NODE" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_NODE" ]; then 
    echo "❌ Node.js $REQUIRED_NODE or higher is required. Current: $NODE_VERSION"
    exit 1
fi

echo "✅ Node.js version check passed: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "📝 Created backend/.env from template"
    echo "⚠️  Please update backend/.env with your actual configuration"
fi

if [ ! -f app/.env.local ]; then
    cat > app/.env.local << EOL
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
VITE_ENVIRONMENT=development
EOL
    echo "📝 Created app/.env.local"
fi

# Database setup
echo "🗄️  Setting up database..."
echo "Note: This requires PostgreSQL to be running"
echo "You can start it with: docker run -d --name ghosthire-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=ghosthire -p 5432:5432 postgres:15"

read -p "Do you want to set up the database now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:setup
    echo "✅ Database setup completed"
fi

# Install Circom for ZK circuits (optional)
echo "🔐 Setting up ZK circuit compilation..."
read -p "Do you want to install Circom for real ZK circuit compilation? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if ! command -v circom &> /dev/null; then
        echo "Installing circom..."
        # Instructions for different platforms
        echo "Please install circom from: https://docs.circom.io/getting-started/installation/"
        echo "For Ubuntu/Debian:"
        echo "  curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh"
        echo "  source ~/.cargo/env"
        echo "  git clone https://github.com/iden3/circom.git"
        echo "  cd circom && cargo build --release && cargo install --path circom"
    else
        echo "✅ Circom already installed"
    fi
    
    # Download powers of tau file if not exists
    if [ ! -f circuits/powersOfTau28_hez_final_15.ptau ]; then
        echo "📥 Downloading powers of tau file..."
        mkdir -p circuits
        curl -o circuits/powersOfTau28_hez_final_15.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau
    fi
    
    # Compile circuit if circom is available
    if command -v circom &> /dev/null; then
        echo "🔨 Compiling ZK circuit..."
        cd circuits
        circom eligibility.circom --r1cs --wasm --sym --c
        cd ..
        echo "✅ ZK circuit compiled"
    fi
fi

# Create required directories
echo "📁 Creating required directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p circuits/keys
mkdir -p test-data

# Generate test data
echo "🧪 Generating test data..."
cat > test-data/sample-profile.json << EOL
{
  "skills": {
    "programming": 85,
    "problemSolving": 90,
    "rust": 75,
    "frontend": 70,
    "backend": 80,
    "blockchain": 65,
    "zk": 60,
    "devops": 55
  },
  "region": "US-CA",
  "expectedSalary": 120000,
  "experience": 5,
  "name": "Anonymous Developer"
}
EOL

echo "✅ Test data created"

# Setup Git hooks (if git repo)
if [ -d ".git" ]; then
    echo "🔗 Setting up Git hooks..."
    npx husky install
    npx husky add .husky/pre-commit "npx lint-staged"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your database and email configuration"
echo "2. Start PostgreSQL database (if not already running)"
echo "3. Run 'npm run dev:all' to start both frontend and backend"
echo "4. Visit http://localhost:5173 to see the application"
echo ""
echo "🚀 Available commands:"
echo "  npm run dev          - Start frontend only"
echo "  npm run dev:backend  - Start backend only" 
echo "  npm run dev:all      - Start both frontend and backend"
echo "  npm run build:all    - Build for production"
echo "  npm run test         - Run all tests"
echo "  npm run db:studio    - Open database management UI"
echo ""
echo "📚 Documentation:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:3001"
echo "  Database Studio: npm run db:studio"
echo ""
echo "Happy coding! 🔐✨"
