import prisma from '../config/prisma.js';

export class NotificationService {
  /**
   * Create a notification record in PostgreSQL.
   * Can accept an optional Prisma transaction client tx.
   *
   * @param {Object} data
   * @param {string} data.userId - Recipient user UUID
   * @param {string} data.type - Event category: BILL_CREATED | PAYMENT_SUBMITTED | PAYMENT_VERIFIED | BILL_PAID | GENERAL
   * @param {string} data.title - Short notification title
   * @param {string} data.message - Detailed notification content
   * @param {Object} [tx] - Optional Prisma transaction client
   */
  static async createNotification({ userId, type = 'GENERAL', title, message }, tx = null) {
    if (!userId) {
      throw new Error('Notification recipient userId is required.');
    }
    if (!title || !title.trim()) {
      throw new Error('Notification title cannot be empty.');
    }
    if (!message || !message.trim()) {
      throw new Error('Notification message cannot be empty.');
    }

    const client = tx || prisma;
    return client.notification.create({
      data: {
        userId,
        type,
        title: title.trim(),
        message: message.trim(),
        isRead: false,
      },
    });
  }

  /**
   * Retrieve all notifications for the authenticated user, newest first.
   *
   * @param {string} userId - Authenticated user UUID
   * @param {Object} [options]
   * @param {number} [options.limit=50]
   */
  static async getUserNotifications(userId, { limit = 50 } = {}) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get unread notification count for the authenticated user.
   *
   * @param {string} userId - Authenticated user UUID
   */
  static async getUnreadCount(userId) {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  /**
   * Mark a single notification as read, ensuring it belongs to the authenticated user.
   *
   * @param {string} notificationId - Notification UUID
   * @param {string} userId - Authenticated user UUID
   */
  static async markAsRead(notificationId, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      const error = new Error('Notification not found.');
      error.statusCode = 404;
      throw error;
    }

    if (notification.userId !== userId) {
      const error = new Error('Forbidden. You do not have permission to modify this notification.');
      error.statusCode = 403;
      throw error;
    }

    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  /**
   * Mark all notifications belonging to the authenticated user as read.
   *
   * @param {string} userId - Authenticated user UUID
   */
  static async markAllAsRead(userId) {
    const result = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { updatedCount: result.count };
  }
}
