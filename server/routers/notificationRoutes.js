import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

// Get unread notifications for the current user
router.get('/', getNotifications);

// Mark notifications as read
router.post('/mark-as-read', markNotificationsAsRead);

export default router;
