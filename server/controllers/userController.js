import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;
    console.log('Fetching user profile for user ID:', userId);
    
    if (!userId) {
      console.error('No user ID provided in request');
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // First, get the basic user data
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      // Temporarily remove associations to fix the error
      // We'll add them back once the basic functionality works
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { name, phone, address, city, country, currentPassword, newPassword } = req.body;
    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update basic info (email is intentionally excluded as it's used as an identifier)
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.city = city || user.city;
    user.country = country || user.country;

    // Check if a new profile image has been uploaded
    if (req.file) {
      // Construct the URL path for the new image
      user.profileImage = `/uploads/avatars/${req.file.filename}`;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    // Remove password from response
    const userData = user.get();
    delete userData.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle duplicate email error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In a real app, you might want to handle related data (e.g., set to inactive instead of deleting)
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Your account has been deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
