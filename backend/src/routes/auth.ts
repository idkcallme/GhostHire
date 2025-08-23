import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['job_seeker', 'employer']).default('job_seeker').transform(role => 
    role === 'job_seeker' ? 'APPLICANT' : 'EMPLOYER'
  )
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const updateProfileSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(3).optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  salaryExpectation: z.number().positive().optional(),
  experience: z.number().min(0).optional(),
  skills: z.record(z.number().min(0).max(100)).optional(), // skill -> proficiency mapping
});

// Register endpoint
router.post('/register', asyncHandler(async (req, res) => {
  const validatedData = registerSchema.parse(req.body);
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email }
  });
  
  if (existingUser) {
    throw createError('User already exists with this email', 409);
  }
  
  // Check username uniqueness if provided
  if (validatedData.username) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: validatedData.username }
    });
    
    if (existingUsername) {
      throw createError('Username already taken', 409);
    }
  }
  
  // Hash password
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);
  
  // Create user
  const user = await prisma.user.create({
    data: {
      email: validatedData.email,
      username: validatedData.username,
      passwordHash,
      name: validatedData.name,
      role: validatedData.role,
      privacyScore: 100.0, // Start with perfect privacy score
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      privacyScore: true,
      createdAt: true
    }
  });
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  
  res.status(201).json({
    message: 'User registered successfully',
    user,
    token
  });
}));

// Login endpoint
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      role: true,
      passwordHash: true,
      privacyScore: true,
      lastActiveAt: true
    }
  });
  
  if (!user || !user.passwordHash) {
    throw createError('Invalid email or password', 401);
  }
  
  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    throw createError('Invalid email or password', 401);
  }
  
  // Update last active timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActiveAt: new Date() }
  });
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
  
  // Remove password hash from response
  const { passwordHash, ...userResponse } = user;
  
  res.json({
    message: 'Login successful',
    user: userResponse,
    token
  });
}));

// Get current user profile
router.get('/me', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      skills: true,
      location: true,
      salaryExpectation: true,
      experience: true,
      bio: true,
      privacyScore: true,
      createdAt: true,
      lastActiveAt: true,
      _count: {
        select: {
          jobs: true,
          applications: true
        }
      }
    }
  });
  
  if (!user) {
    throw createError('User not found', 404);
  }
  
  res.json({ user });
}));

// Update user profile
router.put('/profile', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const validatedData = updateProfileSchema.parse(req.body);
  
  // Check username uniqueness if being updated
  if (validatedData.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: validatedData.username,
        NOT: { id: req.user!.id }
      }
    });
    
    if (existingUser) {
      throw createError('Username already taken', 409);
    }
  }
  
  const updatedUser = await prisma.user.update({
    where: { id: req.user!.id },
    data: validatedData,
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      avatar: true,
      role: true,
      skills: true,
      location: true,
      salaryExpectation: true,
      experience: true,
      bio: true,
      privacyScore: true,
      updatedAt: true
    }
  });
  
  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
}));

// Change password
router.put('/password', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters')
  });
  
  const { currentPassword, newPassword } = schema.parse(req.body);
  
  // Get current user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { passwordHash: true }
  });
  
  if (!user || !user.passwordHash) {
    throw createError('User not found', 404);
  }
  
  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValidPassword) {
    throw createError('Current password is incorrect', 400);
  }
  
  // Hash new password
  const saltRounds = 12;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
  
  // Update password
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { passwordHash: newPasswordHash }
  });
  
  res.json({ message: 'Password updated successfully' });
}));

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  // In a more advanced implementation, you might want to blacklist the token
  // For now, we just return success since JWT tokens are stateless
  
  res.json({ message: 'Logged out successfully' });
}));

export default router;
