import db from "../models/index.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT token
const generateToken = (id, role = 'customer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'your_jwt_secret_key',
    { expiresIn: '30d' }
  );
};

// User Login
const loginUser = async (req, res) => {
  try {
    const { email, password, role = 'customer' } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await db.User.findOne({ where: { email } });

    // Check if user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if user has the requested role
      if (role && user.role !== role) {
        return res.status(403).json({ 
          success: false,
          message: `You don't have permission to access ${role} dashboard` 
        });
      }

      // Generate JWT token with role
      const token = generateToken(user.id, user.role);

      // Return user data and token (exclude password)
      res.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'customer',
          token
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find admin by email
    const admin = await db.User.findOne({ 
      where: { 
        email,
        isAdmin: true 
      } 
    });

    // Check if admin exists and password is correct
    if (admin && (await bcrypt.compare(password, admin.password))) {
      // Generate JWT token with admin flag
      const token = generateToken(admin.id, true);

      // Return admin data and token (exclude password)
      res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isAdmin: true,
        token
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin authentication' });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Exclude password from the response
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { loginUser, loginAdmin, getMe };
