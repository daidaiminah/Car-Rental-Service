import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createRental,
  getMyRentals,
  getRentalById,
  getAvailableCars,
  deleteRental
} from '../controllers/rentalController.js';

const router = express.Router();

// Protected routes (require authentication)
router.use(protect);

// Create a new rental
router.post('/', createRental);

// Get current user's rentals
router.get('/my-rentals', getMyRentals);

// Get available cars for a date range
router.get('/available-cars', getAvailableCars);

// Get rental by ID
router.get('/:id', getRentalById);

// Cancel a rental
router.delete('/:id', deleteRental);

export default router;
