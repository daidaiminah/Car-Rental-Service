//I want to be able to edit the user profile page on the front end, create all the routes that it needs

import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  getUserProfile, 
  updateUserProfile, 
  deleteUserAccount 
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Ensure the upload directory exists ---
import fs from 'fs';
const uploadDir = path.join(__dirname, '../public/uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// --- End directory check ---

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads/avatars'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
  }
});

// Validation middleware
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[0-9\-\+\(\)\s]{10,20}$/)
    .withMessage('Please provide a valid phone number'),
  body('currentPassword')
    .if(body('newPassword').exists())
    .notEmpty()
    .withMessage('Current password is required when changing password'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Protected routes (require authentication)
router.use(protect);

// @route   GET /api/user/profile/:userId
// @desc    Get user profile
// @access  Private
router.get('/profile/:userId', getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', upload.single('profileImage'), validateProfileUpdate, updateUserProfile);


// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', deleteUserAccount);

export default router;
