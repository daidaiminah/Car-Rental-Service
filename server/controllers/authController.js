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
    console.log('Login attempt:', { email, role });

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await db.User.findOne({ where: { email } });
    console.log('User found:', user ? { id: user.id, role: user.role } : 'No user found');

    // Check if user exists and password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Fix: Don't check role on login - allow users to access their dashboard based on their actual role
      // Instead of blocking login, we'll return their actual role so frontend can redirect correctly
      
      // Generate JWT token with user's actual role
      const token = generateToken(user.id, user.role);

      // Return user data and token (exclude password)
      const responseData = {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'customer',
          token
        }
      };
      
      console.log('Login successful:', { userId: user.id, role: user.role });
      res.json(responseData);
    } else {
      console.log('Login failed: Invalid credentials');
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
      // Generate JWT token with admin role
      const token = generateToken(admin.id, 'admin');

      // Return admin data and token (exclude password)
      res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
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
