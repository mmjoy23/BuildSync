import { NotificationService } from '../services/notification.service.js';

export class NotificationController {
  /**
   * GET /api/notifications
   * List all notifications for the authenticated user, newest first.
   */
  static async getNotifications(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
      const notifications = await NotificationService.getUserNotifications(req.user.id, { limit });
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Get count of unread notifications for the authenticated user.
   */
  static async getUnreadCount(req, res, next) {
    try {
      const result = await NotificationService.getUnreadCount(req.user.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Mark a single notification as read.
   */
  static async markAsRead(req, res, next) {
    try {
      const notification = await NotificationService.markAsRead(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/read-all
   * Mark all unread notifications for the authenticated user as read.
   */
  static async markAllAsRead(req, res, next) {
    try {
      const result = await NotificationService.markAllAsRead(req.user.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
