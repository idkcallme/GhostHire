import express from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { NotificationService } from '../services/notification';

const router = express.Router();
const notificationService = new NotificationService();

// Get notifications for authenticated user
router.get('/', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { page = 1, limit = 20, type, read } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  const where: any = {
    userId: req.user!.id
  };

  if (type) {
    where.type = type;
  }

  if (read !== undefined) {
    where.read = read === 'true';
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
router.put('/read', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    notificationIds: z.array(z.string()).optional(),
    markAllRead: z.boolean().optional()
  });

  const { notificationIds, markAllRead } = schema.parse(req.body);

  if (markAllRead) {
    await notificationService.markAsRead(req.user!.id, []);
  } else if (notificationIds && notificationIds.length > 0) {
    await notificationService.markAsRead(req.user!.id, notificationIds);
  } else {
    throw createError('Either notificationIds or markAllRead must be provided', 400);
  }

  res.json({ message: 'Notifications marked as read' });
}));

// Get notification settings
router.get('/settings', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  // In a real app, you'd have a separate settings table
  // For now, return default settings
  const settings = {
    email: {
      applicationReceived: true,
      applicationStatusChange: true,
      jobMatch: true,
      systemUpdates: false,
      privacyAlerts: true
    },
    push: {
      applicationReceived: true,
      applicationStatusChange: true,
      jobMatch: false,
      systemUpdates: false,
      privacyAlerts: true
    },
    frequency: 'immediate' // immediate, daily, weekly
  };

  res.json({ settings });
}));

// Update notification settings
router.put('/settings', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    email: z.object({
      applicationReceived: z.boolean(),
      applicationStatusChange: z.boolean(),
      jobMatch: z.boolean(),
      systemUpdates: z.boolean(),
      privacyAlerts: z.boolean()
    }).optional(),
    push: z.object({
      applicationReceived: z.boolean(),
      applicationStatusChange: z.boolean(),
      jobMatch: z.boolean(),
      systemUpdates: z.boolean(),
      privacyAlerts: z.boolean()
    }).optional(),
    frequency: z.enum(['immediate', 'daily', 'weekly']).optional()
  });

  const validatedData = schema.parse(req.body);

  // In a real app, you'd save these settings to a user_settings table
  // For now, just return success
  res.json({
    message: 'Notification settings updated successfully',
    settings: validatedData
  });
}));

// Delete notifications
router.delete('/', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
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

// Get unread count
router.get('/unread-count', authenticateToken, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const unreadCount = await prisma.notification.count({
    where: {
      userId: req.user!.id,
      read: false
    }
  });

  res.json({ unreadCount });
}));

export default router;
