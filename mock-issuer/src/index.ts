import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// Mock data
const mockProfiles = [
  {
    id: 'profile-1',
    name: 'Alice Johnson',
    skills: { rust: 85, typescript: 78, zk: 72 },
    region: 'US-CA',
    expectedSalary: 120000,
    secret: 'alice-secret-123',
  },
  {
    id: 'profile-2',
    name: 'Bob Smith',
    skills: { rust: 92, typescript: 65, zk: 88 },
    region: 'CA-ON',
    expectedSalary: 95000,
    secret: 'bob-secret-456',
  },
  {
    id: 'profile-3',
    name: 'Carol Davis',
    skills: { rust: 70, typescript: 85, zk: 60 },
    region: 'US-NY',
    expectedSalary: 110000,
    secret: 'carol-secret-789',
  },
  {
    id: 'profile-4',
    name: 'David Wilson',
    skills: { rust: 88, typescript: 72, zk: 95 },
    region: 'UK-LON',
    expectedSalary: 85000,
    secret: 'david-secret-012',
  },
  {
    id: 'profile-5',
    name: 'Eva Brown',
    skills: { rust: 75, typescript: 90, zk: 68 },
    region: 'DE-BER',
    expectedSalary: 78000,
    secret: 'eva-secret-345',
  },
]

const mockJobs = [
  {
    id: 1,
    title: 'Senior Rust Developer',
    company: 'TechCorp',
    thresholds: { rust: 80, typescript: 60, zk: 50 },
    allowedRegions: ['US-CA', 'US-NY', 'CA-ON'],
    salaryMin: 100000,
    salaryMax: 150000,
  },
  {
    id: 2,
    title: 'ZK Protocol Engineer',
    company: 'CryptoStartup',
    thresholds: { rust: 70, typescript: 50, zk: 85 },
    allowedRegions: ['US-CA', 'US-NY', 'UK-LON', 'DE-BER'],
    salaryMin: 80000,
    salaryMax: 130000,
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    thresholds: { rust: 60, typescript: 80, zk: 40 },
    allowedRegions: ['US-CA', 'CA-ON', 'UK-LON'],
    salaryMin: 70000,
    salaryMax: 110000,
  },
]

// Utility functions
function generateCredential(profile: any, jobId: number) {
  const credentialId = uuidv4()
  const timestamp = Date.now()
  
  return {
    id: credentialId,
    type: 'skill-assessment',
    issuer: 'mock-issuer.ghosthire.dev',
    issuedAt: new Date(timestamp).toISOString(),
    expiresAt: new Date(timestamp + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    subject: {
      id: profile.id,
      name: profile.name,
    },
    claims: {
      skills: profile.skills,
      region: profile.region,
      expectedSalary: profile.expectedSalary,
    },
    proof: {
      type: 'mock-signature',
      signature: crypto.randomBytes(64).toString('hex'),
      publicKey: crypto.randomBytes(32).toString('hex'),
    },
  }
}

function generateNullifier(jobId: number, secret: string) {
  const input = `${jobId}-${secret}`
  return crypto.createHash('sha256').update(input).digest('hex')
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Get all mock profiles
app.get('/api/profiles', (req, res) => {
  res.json({
    profiles: mockProfiles.map(profile => ({
      id: profile.id,
      name: profile.name,
      skills: profile.skills,
      region: profile.region,
      expectedSalary: profile.expectedSalary,
    }))
  })
})

// Get a specific profile
app.get('/api/profiles/:id', (req, res) => {
  const profile = mockProfiles.find(p => p.id === req.params.id)
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' })
  }
  
  res.json({
    id: profile.id,
    name: profile.name,
    skills: profile.skills,
    region: profile.region,
    expectedSalary: profile.expectedSalary,
  })
})

// Generate credential for a profile
app.post('/api/profiles/:id/credential', (req, res) => {
  const { jobId } = req.body
  
  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' })
  }
  
  const profile = mockProfiles.find(p => p.id === req.params.id)
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' })
  }
  
  const credential = generateCredential(profile, jobId)
  const nullifier = generateNullifier(jobId, profile.secret)
  
  res.json({
    credential,
    nullifier,
    secret: profile.secret, // Only for demo purposes
  })
})

// Get all mock jobs
app.get('/api/jobs', (req, res) => {
  res.json({ jobs: mockJobs })
})

// Get a specific job
app.get('/api/jobs/:id', (req, res) => {
  const job = mockJobs.find(j => j.id === parseInt(req.params.id))
  if (!job) {
    return res.status(404).json({ error: 'Job not found' })
  }
  
  res.json(job)
})

// Generate sample application data
app.post('/api/applications/generate', (req, res) => {
  const { profileId, jobId } = req.body
  
  if (!profileId || !jobId) {
    return res.status(400).json({ error: 'profileId and jobId are required' })
  }
  
  const profile = mockProfiles.find(p => p.id === profileId)
  const job = mockJobs.find(j => j.id === parseInt(jobId))
  
  if (!profile || !job) {
    return res.status(404).json({ error: 'Profile or job not found' })
  }
  
  const credential = generateCredential(profile, jobId)
  const nullifier = generateNullifier(jobId, profile.secret)
  
  // Check if profile meets job requirements
  const meetsRequirements = 
    profile.skills.rust >= job.thresholds.rust &&
    profile.skills.typescript >= job.thresholds.typescript &&
    profile.skills.zk >= job.thresholds.zk &&
    job.allowedRegions.includes(profile.region) &&
    profile.expectedSalary >= job.salaryMin &&
    profile.expectedSalary <= job.salaryMax
  
  res.json({
    profile,
    job,
    credential,
    nullifier,
    meetsRequirements,
    applicationData: {
      jobId: parseInt(jobId),
      nullifier,
      applicant: profile.id,
      timestamp: Date.now(),
    }
  })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Mock issuer service running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(`API docs: http://localhost:${PORT}/api`)
})
