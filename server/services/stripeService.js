import Stripe from 'stripe';
import db from '../models/index.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Rental = db.Rental;

/**
 * Create a payment intent for Stripe
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} Payment intent details
 */
export const createPaymentIntent = async (bookingData) => {
  try {
    // Calculate amount in cents (Stripe uses smallest currency unit)
    const amount = Math.round(bookingData.amount * 100);
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        carId: bookingData.carId,
        userId: bookingData.userId,
        bookingId: bookingData.bookingId || 'temp_' + Date.now(),
      },
      // Add description for better tracking in Stripe dashboard
      description: `Payment for car rental (${bookingData.carId})`,
      // Enable automatic confirmation for future use with webhooks
      confirm: false,
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Confirm a payment and update the booking status
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Result of the payment confirmation
 */
export const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update the booking status in your database
      const rental = await Rental.findOne({
        where: { paymentIntentId: paymentIntent.id }
      });
      
      if (rental) {
        await rental.update({ status: 'confirmed' });
      }
      
      return {
        success: true,
        status: paymentIntent.status,
        rentalId: rental?.id
      };
    }
    
    return {
      success: false,
      status: paymentIntent.status,
      error: 'Payment not completed'
    };
  } catch (error) {
    console.error('Error confirming payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Handle Stripe webhook events
 * @param {Object} event - Stripe event object
 * @returns {Promise<Object>} Result of webhook handling
 */
export const handleStripeWebhook = async (event) => {
  let paymentIntent;
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent.id);
      // Update your database here
      await confirmPayment(paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.last_payment_error?.message);
      // Update your database here
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { received: true };
};

export default {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook
};
