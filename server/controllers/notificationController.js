import { getUnreadNotifications, markAsRead } from '../utils/notificationService.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await getUnreadNotifications(userId);
    
    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message,
    });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const userId = req.user.id;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of notification IDs',
      });
    }

    // Verify that all notifications belong to the user
    const notifications = await Notification.findAll({
      where: {
        id: notificationIds,
        userId,
      },
    });

    if (notifications.length !== notificationIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark some notifications as read',
      });
    }

    const updatedCount = await markAsRead(notificationIds);

    return res.status(200).json({
      success: true,
      message: `Marked ${updatedCount} notifications as read`,
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read',
      error: error.message,
    });
  }
};

export default {
  getNotifications,
  markNotificationsAsRead,
};
