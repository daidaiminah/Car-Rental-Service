import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { UnauthenticatedError, UnauthorizedError } from '../errors/index.js';

const User = db.User;
const Car = db.Car;

const protect = async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token is required',
      code: 'AUTH_TOKEN_REQUIRED'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized',
      code: 'AUTH_FAILED'
    });
  }
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized as an admin',
      code: 'ADMIN_ACCESS_REQUIRED'
    });
  }
};

// Check if user is the owner of a car
const isCarOwner = async (req, res, next) => {
  try {
    const { carId } = req.params;
    
    if (!carId) {
      return res.status(400).json({
        status: 'error',
        message: 'Car ID is required',
        code: 'CAR_ID_REQUIRED'
      });
    }

    const car = await Car.findByPk(carId);
    
    if (!car) {
      return res.status(404).json({
        status: 'error',
        message: 'Car not found',
        code: 'CAR_NOT_FOUND'
      });
    }

    // Check if the user is the owner of the car or an admin
    if (car.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to perform this action',
        code: 'UNAUTHORIZED_ACTION'
      });
    }

    req.car = car;
    next();
  } catch (error) {
    console.error('isCarOwner error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while verifying car ownership',
      code: 'SERVER_ERROR',
      details: error.message
    });
  }
};

export { protect, admin, isCarOwner };
