import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
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
          applications: true,
          notifications: true
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
  const schema = z.object({
    name: z.string().min(1).optional(),
    username: z.string().min(3).optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    salaryExpectation: z.number().positive().optional(),
    experience: z.number().min(0).optional(),
    skills: z.record(z.number().min(0).max(100)).optional(),
    avatar: z.string().url().optional()
  });

  const validatedData = schema.parse(req.body);

  // Check username uniqueness
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

// Get user notifications
router.get('/notifications', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where: any = {
    userId: req.user!.id
  };

  if (unreadOnly === 'true') {
    where.read = false;
  }

  const [notifications, totalCount, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: Number(limit)
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: {
        userId: req.user!.id,
        read: false
      }
    })
  ]);

  const totalPages = Math.ceil(totalCount / Number(limit));

  res.json({
    notifications,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      totalCount,
      totalPages,
      hasNextPage: Number(page) < totalPages,
      hasPrevPage: Number(page) > 1
    },
    unreadCount
  });
}));

// Mark notifications as read
router.put('/notifications/read', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    notificationIds: z.array(z.string()).optional(),
    markAllRead: z.boolean().optional()
  });

  const { notificationIds, markAllRead } = schema.parse(req.body);

  if (markAllRead) {
    await prisma.notification.updateMany({
      where: {
        userId: req.user!.id,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });
  } else if (notificationIds && notificationIds.length > 0) {
    await prisma.notification.updateMany({
      where: {
        userId: req.user!.id,
        id: { in: notificationIds }
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });
  }

  res.json({ message: 'Notifications marked as read' });
}));

// Delete notifications
router.delete('/notifications', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    notificationIds: z.array(z.string())
  });

  const { notificationIds } = schema.parse(req.body);

  await prisma.notification.deleteMany({
    where: {
      userId: req.user!.id,
      id: { in: notificationIds }
    }
  });

  res.json({ message: 'Notifications deleted successfully' });
}));

// Get user activity feed
router.get('/activity', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const activities = await prisma.analytics.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    skip: offset,
    take: Number(limit),
    select: {
      id: true,
      event: true,
      data: true,
      createdAt: true
    }
  });

  res.json({ activities });
}));

export default router;
