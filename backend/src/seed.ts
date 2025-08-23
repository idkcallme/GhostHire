import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const hashedPassword = await bcryptjs.hash('password123', 12);

  // Job Seeker
  const jobSeeker = await prisma.user.upsert({
    where: { email: 'candidate@ghosthire.com' },
    update: {},
    create: {
      email: 'candidate@ghosthire.com',
      username: 'candidate',
      passwordHash: hashedPassword,
      name: 'Alice Johnson',
      role: 'APPLICANT',
      skills: JSON.stringify([
        { skill: 'JavaScript', proficiency: 8 },
        { skill: 'React', proficiency: 9 },
        { skill: 'TypeScript', proficiency: 7 },
        { skill: 'Node.js', proficiency: 6 }
      ]),
      location: 'San Francisco, CA',
      salaryExpectation: 120000,
      experience: 3,
      bio: 'Passionate frontend developer with a focus on React and modern web technologies.',
      privacyScore: 85.5
    }
  });

  // Employer
  const employer = await prisma.user.upsert({
    where: { email: 'employer@ghosthire.com' },
    update: {},
    create: {
      email: 'employer@ghosthire.com',
      username: 'techcorp',
      passwordHash: hashedPassword,
      name: 'TechCorp Recruiter',
      role: 'EMPLOYER',
      location: 'New York, NY',
      bio: 'Leading technology company focused on innovation and privacy.',
      privacyScore: 92.0
    }
  });

  // Create sample jobs
  const job1 = await prisma.job.create({
    data: {
      title: 'Senior Frontend Developer',
      description: 'We are looking for a skilled frontend developer to join our team and build amazing user experiences with React and TypeScript. You will work on cutting-edge privacy-preserving technologies.',
      company: 'TechCorp',
      skillRequirements: JSON.stringify([
        { skill: 'React', minLevel: 7 },
        { skill: 'TypeScript', minLevel: 6 },
        { skill: 'JavaScript', minLevel: 8 }
      ]),
      salaryMin: 100000,
      salaryMax: 150000,
      allowedRegions: JSON.stringify(['US', 'CA', 'EU']),
      regionMerkleRoot: '0x1234567890abcdef',
      tags: JSON.stringify(['React', 'TypeScript', 'Frontend', 'Remote']),
      remote: true,
      experience: 'SENIOR',
      department: 'Engineering',
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      employerId: employer.id,
      publishedAt: new Date()
    }
  });

  const job2 = await prisma.job.create({
    data: {
      title: 'Privacy Engineer',
      description: 'Join our privacy team to build zero-knowledge proof systems and help create the future of private computing. Experience with cryptography and blockchain technologies preferred.',
      company: 'CryptoPrivacy Inc',
      skillRequirements: JSON.stringify([
        { skill: 'Cryptography', minLevel: 8 },
        { skill: 'Rust', minLevel: 7 },
        { skill: 'Zero-Knowledge Proofs', minLevel: 6 }
      ]),
      salaryMin: 130000,
      salaryMax: 200000,
      allowedRegions: JSON.stringify(['US', 'CA']),
      regionMerkleRoot: '0xabcdef1234567890',
      tags: JSON.stringify(['Cryptography', 'ZK', 'Privacy', 'Blockchain']),
      remote: true,
      experience: 'SENIOR',
      department: 'Research',
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      employerId: employer.id,
      publishedAt: new Date()
    }
  });

  const job3 = await prisma.job.create({
    data: {
      title: 'Full Stack Developer',
      description: 'Looking for a versatile developer comfortable with both frontend and backend technologies. You will help build scalable web applications with a focus on user privacy.',
      company: 'StartupX',
      skillRequirements: JSON.stringify([
        { skill: 'JavaScript', minLevel: 7 },
        { skill: 'Node.js', minLevel: 6 },
        { skill: 'React', minLevel: 6 },
        { skill: 'PostgreSQL', minLevel: 5 }
      ]),
      salaryMin: 80000,
      salaryMax: 120000,
      allowedRegions: JSON.stringify(['US', 'CA', 'EU', 'APAC']),
      regionMerkleRoot: '0x9876543210fedcba',
      tags: JSON.stringify(['Full Stack', 'JavaScript', 'Node.js', 'Startup']),
      remote: false,
      experience: 'MID',
      department: 'Engineering',
      status: 'ACTIVE',
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      employerId: employer.id,
      publishedAt: new Date()
    }
  });

  // Create a sample application
  await prisma.application.create({
    data: {
      zkProofHash: '0xsampleproof123456789abcdef',
      zkPublicInputs: JSON.stringify({
        skillScore: 75,
        experienceYears: 3,
        regionCode: 'US'
      }),
      nullifierHash: '0xnullifier123456789abcdef',
      eligibilityProof: JSON.stringify({
        proof: 'sample_proof_data',
        publicSignals: [75, 3, 1],
        metadata: { generatedAt: new Date().toISOString() }
      }),
      privacyScore: 88.5,
      dataRevealed: JSON.stringify({
        skillsRevealed: false,
        exactLocationRevealed: false,
        salaryRangeRevealed: true
      }),
      status: 'PENDING',
      applicantId: jobSeeker.id,
      jobId: job1.id
    }
  });

  // Create sample notifications
  await prisma.notification.create({
    data: {
      title: 'Application Submitted',
      message: 'Your application for Senior Frontend Developer has been submitted successfully.',
      type: 'APPLICATION_STATUS_CHANGE',
      userId: jobSeeker.id,
      data: JSON.stringify({ jobId: job1.id, status: 'submitted' })
    }
  });

  await prisma.notification.create({
    data: {
      title: 'New Application Received',
      message: 'You have received a new application for Senior Frontend Developer.',
      type: 'APPLICATION_RECEIVED',
      userId: employer.id,
      data: JSON.stringify({ jobId: job1.id, applicantId: jobSeeker.id })
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Job Seeker: ${jobSeeker.email} (password: password123)`);
  console.log(`🏢 Employer: ${employer.email} (password: password123)`);
  console.log(`💼 Created ${3} jobs`);
  console.log(`📝 Created ${1} application`);
  console.log(`🔔 Created ${2} notifications`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
