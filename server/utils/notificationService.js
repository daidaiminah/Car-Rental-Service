import db from "../models/index.js";
import { Op } from 'sequelize';

const Notification = db.Notification;

/**
 * Send a notification to a user
 * @param {Object} params - Notification parameters
 * @param {number} params.userId - ID of the user to notify
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} params.type - Notification type (e.g., 'rental_request', 'rental_status_update')
 * @param {Object} [params.data] - Additional data to store with the notification
 * @returns {Promise<Object>} The created notification
 */
export const sendNotification = async ({ userId, title, message, type, data = {} }) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      data,
      isRead: false,
    });

    // Here you would typically also send a real-time notification (e.g., via WebSocket)
    // For example: socketService.notifyUser(userId, notification);

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Get unread notifications for a user
 * @param {number} userId - ID of the user
 * @returns {Promise<Array>} List of unread notifications
 */
export const getUnreadNotifications = async (userId) => {
  try {
    return await Notification.findAll({
      where: {
        userId,
        isRead: false,
      },
      order: [['createdAt', 'DESC']],
    });
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    throw error;
  }
};

/**
 * Mark notifications as read
 * @param {number|Array<number>} notificationIds - Single ID or array of notification IDs
 * @returns {Promise<number>} Number of updated notifications
 */
export const markAsRead = async (notificationIds) => {
  try {
    const ids = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    
    const [updatedCount] = await Notification.update(
      { isRead: true },
      {
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }
    );

    return updatedCount;
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    throw error;
  }
};

export default {
  sendNotification,
  getUnreadNotifications,
  markAsRead,
};
