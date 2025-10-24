import express from 'express';
import { createReview, getCarReviews, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new review
router.post('/', protect, createReview);

// Get reviews for a car
router.get('/car/:carId', getCarReviews);

// Delete a review
router.delete('/:id', protect, deleteReview);

export default router;
