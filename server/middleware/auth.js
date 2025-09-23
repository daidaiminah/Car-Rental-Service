import { protect } from '../middlewares/authMiddleware.js';

// Authenticate requests using existing protect middleware
const authenticate = protect;

// Authorize based on allowed roles array
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // If no roles specified, allow authenticated users
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        return next();
      }

      const userRole = req.user.role || (req.user.isAdmin ? 'admin' : undefined);

      if (userRole && allowedRoles.includes(userRole)) {
        return next();
      }

      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    } catch (err) {
      return next(err);
    }
  };
};

export { authenticate, authorize };
