import nodemailer from 'nodemailer';
import { WebSocket } from 'ws';
import { prisma } from '../index';

interface NotificationData {
  userId: string;
  type: 'APPLICATION_RECEIVED' | 'APPLICATION_STATUS_CHANGE' | 'JOB_MATCH' | 'SYSTEM_UPDATE' | 'PRIVACY_ALERT';
  title: string;
  message: string;
  data?: any;
  email?: boolean;
  push?: boolean;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter;
  private wsConnections: Map<string, WebSocket> = new Map();

  constructor() {
    // Initialize email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send notification to user via multiple channels
   */
  async sendNotification(data: NotificationData): Promise<void> {
    try {
      // 1. Save to database
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data || {}
        }
      });

      // 2. Send real-time notification via WebSocket
      await this.sendWebSocketNotification(data.userId, {
        id: notification.id,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        createdAt: notification.createdAt
      });

      // 3. Send email notification if enabled
      if (data.email !== false) {
        await this.sendEmailNotification(data);
      }

      // 4. Track analytics
      await prisma.analytics.create({
        data: {
          event: 'notification_sent',
          data: {
            userId: data.userId,
            type: data.type,
            channels: ['database', 'websocket', ...(data.email !== false ? ['email'] : [])]
          }
        }
      });

    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: NotificationData[]): Promise<void> {
    const promises = notifications.map(notification => 
      this.sendNotification(notification).catch(error => {
        console.error(`Failed to send notification to ${notification.userId}:`, error);
        return null; // Continue with other notifications
      })
    );

    await Promise.all(promises);
  }

  /**
   * Send real-time notification via WebSocket
   */
  private async sendWebSocketNotification(userId: string, notification: any): Promise<void> {
    const ws = this.wsConnections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(data: NotificationData): Promise<void> {
    try {
      // Get user email
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true, name: true }
      });

      if (!user?.email) {
        console.warn(`No email found for user ${data.userId}`);
        return;
      }

      // Generate email template
      const template = this.generateEmailTemplate(data);

      // Send email
      await this.emailTransporter.sendMail({
        from: `GhostHire <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: template.subject,
        text: template.text,
        html: template.html
      });

    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't throw - email failure shouldn't block other notifications
    }
  }

  /**
   * Generate email template based on notification type
   */
  private generateEmailTemplate(data: NotificationData): EmailTemplate {
    const baseStyle = `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; }
        .content { background: white; padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
        .button { background: #5b8cff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        .privacy-badge { background: #e3f2fd; color: #1565c0; padding: 4px 12px; border-radius: 16px; font-size: 12px; }
      </style>
    `;

    switch (data.type) {
      case 'APPLICATION_RECEIVED':
        return {
          subject: `🔐 New Privacy-Preserving Application - GhostHire`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>🔐 GhostHire</h1>
                <p>Privacy-Preserving Recruitment</p>
              </div>
              <div class="content">
                <h2>New Application Received</h2>
                <p>${data.message}</p>
                ${data.data?.privacyScore ? `<p><span class="privacy-badge">Privacy Score: ${data.data.privacyScore}%</span></p>` : ''}
                <p>The applicant has proven their eligibility through zero-knowledge proofs without revealing sensitive personal information.</p>
                <a href="${process.env.CORS_ORIGIN}/applications" class="button">Review Applications</a>
              </div>
              <div class="footer">
                <p>This application was verified on-chain with complete privacy preservation.</p>
              </div>
            </div>
          `,
          text: `New Privacy-Preserving Application\n\n${data.message}\n\nPrivacy Score: ${data.data?.privacyScore || 'N/A'}%\n\nReview at: ${process.env.CORS_ORIGIN}/applications`
        };

      case 'APPLICATION_STATUS_CHANGE':
        return {
          subject: `📋 Application Status Update - GhostHire`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>🔐 GhostHire</h1>
                <p>Privacy-Preserving Recruitment</p>
              </div>
              <div class="content">
                <h2>Application Status Updated</h2>
                <p>${data.message}</p>
                ${data.data?.reviewNotes ? `<p><strong>Review Notes:</strong> ${data.data.reviewNotes}</p>` : ''}
                ${data.data?.rejectionReason ? `<p><strong>Reason:</strong> ${data.data.rejectionReason}</p>` : ''}
                <a href="${process.env.CORS_ORIGIN}/applications" class="button">View Applications</a>
              </div>
              <div class="footer">
                <p>Your privacy remains protected throughout the process.</p>
              </div>
            </div>
          `,
          text: `Application Status Update\n\n${data.message}\n\n${data.data?.reviewNotes ? `Notes: ${data.data.reviewNotes}\n` : ''}${data.data?.rejectionReason ? `Reason: ${data.data.rejectionReason}\n` : ''}\nView at: ${process.env.CORS_ORIGIN}/applications`
        };

      case 'JOB_MATCH':
        return {
          subject: `🎯 New Job Match Found - GhostHire`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>🔐 GhostHire</h1>
                <p>Privacy-Preserving Recruitment</p>
              </div>
              <div class="content">
                <h2>🎯 Job Match Found</h2>
                <p>${data.message}</p>
                <p>We found a job that matches your skills and preferences while maintaining your privacy.</p>
                <a href="${process.env.CORS_ORIGIN}/jobs" class="button">Browse Jobs</a>
              </div>
              <div class="footer">
                <p>Matched based on your private profile data.</p>
              </div>
            </div>
          `,
          text: `Job Match Found\n\n${data.message}\n\nBrowse jobs at: ${process.env.CORS_ORIGIN}/jobs`
        };

      case 'PRIVACY_ALERT':
        return {
          subject: `🛡️ Privacy Alert - GhostHire`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>🔐 GhostHire</h1>
                <p>Privacy-Preserving Recruitment</p>
              </div>
              <div class="content">
                <h2>🛡️ Privacy Alert</h2>
                <p>${data.message}</p>
                <p>Your privacy and data security are our top priorities.</p>
                <a href="${process.env.CORS_ORIGIN}/profile" class="button">Review Settings</a>
              </div>
              <div class="footer">
                <p>Stay informed about your privacy protection.</p>
              </div>
            </div>
          `,
          text: `Privacy Alert\n\n${data.message}\n\nReview settings at: ${process.env.CORS_ORIGIN}/profile`
        };

      default:
        return {
          subject: `📢 Notification - GhostHire`,
          html: `
            ${baseStyle}
            <div class="container">
              <div class="header">
                <h1>🔐 GhostHire</h1>
                <p>Privacy-Preserving Recruitment</p>
              </div>
              <div class="content">
                <h2>${data.title}</h2>
                <p>${data.message}</p>
                <a href="${process.env.CORS_ORIGIN}" class="button">Visit GhostHire</a>
              </div>
              <div class="footer">
                <p>Thank you for using GhostHire.</p>
              </div>
            </div>
          `,
          text: `${data.title}\n\n${data.message}\n\nVisit: ${process.env.CORS_ORIGIN}`
        };
    }
  }

  /**
   * Register WebSocket connection for real-time notifications
   */
  registerWebSocketConnection(userId: string, ws: WebSocket): void {
    this.wsConnections.set(userId, ws);
    
    ws.on('close', () => {
      this.wsConnections.delete(userId);
    });

    ws.on('error', (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
      this.wsConnections.delete(userId);
    });
  }

  /**
   * Get unread notifications for a user
   */
  async getUnreadNotifications(userId: string): Promise<any[]> {
    return prisma.notification.findMany({
      where: {
        userId,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to most recent 50
    });
  }

  /**
   * Mark notifications as read
   */
  async markAsRead(userId: string, notificationIds: string[]): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        id: { in: notificationIds }
      },
      data: {
        read: true,
        readAt: new Date()
      }
    });
  }

  /**
   * Send job match notifications based on user preferences
   */
  async sendJobMatchNotifications(jobId: string): Promise<void> {
    // This would implement intelligent job matching based on user skills/preferences
    // For demo purposes, we'll send to users who might be interested
    
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: { name: true }
        }
      }
    });

    if (!job) return;

    // Find users with matching skills (simplified matching logic)
    const skillKeys = Object.keys(job.skillRequirements as any);
    const potentialMatches = await prisma.user.findMany({
      where: {
        role: 'APPLICANT',
        skills: {
          path: skillKeys,
          array_contains: skillKeys
        }
      },
      select: { id: true }
    });

    // Send notifications to potential matches
    const notifications = potentialMatches.map(user => ({
      userId: user.id,
      type: 'JOB_MATCH' as const,
      title: 'New Job Match Found',
      message: `A new ${job.title} position at ${job.company} matches your skills!`,
      data: {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company
      }
    }));

    await this.sendBulkNotifications(notifications);
  }
}
