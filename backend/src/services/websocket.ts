import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { NotificationService } from './notification';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

export function setupWebSocket(wss: WebSocketServer): void {
  const notificationService = new NotificationService();

  wss.on('connection', (ws: AuthenticatedWebSocket, request) => {
    ws.isAlive = true;

    // Handle authentication
    ws.on('message', async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'auth' && data.token) {
          // Authenticate the WebSocket connection
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as any;
          ws.userId = decoded.userId;
          
          // Register with notification service
          notificationService.registerWebSocketConnection(ws.userId, ws);
          
          // Send confirmation
          ws.send(JSON.stringify({
            type: 'auth_success',
            userId: ws.userId
          }));

          // Send any pending notifications
          const unreadNotifications = await notificationService.getUnreadNotifications(ws.userId);
          if (unreadNotifications.length > 0) {
            ws.send(JSON.stringify({
              type: 'pending_notifications',
              data: unreadNotifications
            }));
          }
        }

        if (data.type === 'ping') {
          ws.isAlive = true;
          ws.send(JSON.stringify({ type: 'pong' }));
        }

        if (data.type === 'mark_read' && data.notificationIds && ws.userId) {
          await notificationService.markAsRead(ws.userId, data.notificationIds);
          ws.send(JSON.stringify({
            type: 'marked_read',
            notificationIds: data.notificationIds
          }));
        }

      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    // Handle connection close
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'WebSocket connected. Please authenticate.'
    }));
  });

  // Heartbeat to keep connections alive
  const interval = setInterval(() => {
    wss.clients.forEach((ws: AuthenticatedWebSocket) => {
      if (ws.isAlive === false) {
        ws.terminate();
        return;
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  console.log('WebSocket server setup complete');
}
