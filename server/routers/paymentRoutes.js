import express from 'express';
import { createPaymentIntent, confirmPayment } from '../services/stripeService.js';
import { protect } from '../middlewares/authMiddleware.js';
import { createCheckoutSession, handleStripeWebhook, getUserPaymentSummary } from '../controllers/paymentController.js';

const router = express.Router();

// Stripe webhook endpoint (must be before body parser)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Create Stripe Checkout Session
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/my-summary', protect, getUserPaymentSummary);

// Create payment intent
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const result = await createPaymentIntent({
      amount,
      currency,
      metadata: {
        ...metadata,
        userId: req.user.id, // Add user ID to metadata
      },
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm-payment', protect, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const result = await confirmPayment(paymentIntentId);
    
    if (!result.success) {
      return res.status(400).json({ 
        error: result.error || 'Failed to confirm payment',
        status: result.status
      });
    }

    res.json({
      success: true,
      status: result.status,
      rentalId: result.rentalId,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;
