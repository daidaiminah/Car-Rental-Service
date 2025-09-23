import jwt from 'jsonwebtoken';
import db from '../models/index.js';

// Protect routes - user must be authenticated
const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');

      // Get user from the token
      const user = await db.User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] } // Don't return the password
      });

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, user not found' 
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, invalid token' 
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized, token expired' 
        });
      }
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, authentication failed' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }
};

// Admin middleware - must be used after protect middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };
