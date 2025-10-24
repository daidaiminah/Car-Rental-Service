import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createRental,
  getMyRentals,
  getRentalById,
  getAvailableCars,
  deleteRental,
  getOwnerRentals,
  updateRentalStatus
} from '../controllers/rentalController.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// Create a new rental
router.post('/', createRental);

// Get current user's rentals
router.get('/my-rentals', getMyRentals);

// Get rentals for a specific renter (user)
router.get('/renter/:userId', getMyRentals);

// Get rentals for cars owned by the current user (using JWT)
router.get('/owner/me', getOwnerRentals);

// Get rentals for cars owned by a specific owner ID
router.get('/owner/:ownerId', getOwnerRentals);

// Get available cars for a date range
router.get('/available-cars', getAvailableCars);

// Get rental by ID
router.get('/:id', getRentalById);

// Update rental status
router.patch('/:rentalId/status', updateRentalStatus);

// Cancel a rental
router.delete('/:id', deleteRental);

export default router;


// import express from 'express';
// import { protect, isCarOwner } from '../middleware/authMiddleware.js';
// import {
//   createRental,
//   getMyRentals,
//   getAvailableCars,
//   getRentalById,
//   getOwnerRentals,
//   updateRentalStatus,
//   deleteRental,
// } from '../controllers/rentalController.js';

// const router = express.Router();

// // Public routes
// router.get('/available', getAvailableCars);

// // Protected routes (require authentication)
// router.use(protect);

// // User's rentals
// router.get('/my-rentals', getMyRentals);
// router.get('/:id', getRentalById);
// router.post('/', createRental);

// // Owner routes (require car owner or admin)
// router.get('/owner/rentals', isCarOwner, getOwnerRentals);
// router.put('/:rentalId/status', isCarOwner, updateRentalStatus);

// // Admin routes (if needed in the future)
// router.delete('/:id', protect, isAdmin, deleteRental);

// export default router;
