import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// MoMO API Configuration
const MOMO_CONFIG = {
  baseUrl: process.env.MOMO_ENV === 'production' 
    ? 'https://api.mtn.com' 
    : 'https://sandbox.momodeveloper.mtn.com',
  subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY,
  apiUserId: process.env.MOMO_API_USER,
  apiKey: process.env.MOMO_API_KEY,
  callbackUrl: process.env.MOMO_CALLBACK_URL || 'https://your-app.com/momo/callback'
};

/**
 * Process payment using the selected payment method
 * @param {Object} paymentData - Payment details
 * @param {string} paymentMethod - 'stripe' or 'momo'
 * @returns {Promise<Object>} - Payment result
 */
export const processPayment = async (paymentData, paymentMethod = 'stripe') => {
  try {
    switch (paymentMethod.toLowerCase()) {
      case 'stripe':
        return await processStripePayment(paymentData);
      case 'momo':
        return await processMomoPayment(paymentData);
      default:
        throw new Error('Unsupported payment method');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
};

/**
 * Process payment using Stripe
 */
const processStripePayment = async (paymentData) => {
  const { amount, currency, description, customerEmail, paymentMethodId } = paymentData;

  try {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      description,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: paymentData.returnUrl,
      receipt_email: customerEmail,
      metadata: {
        rentalId: paymentData.rentalId,
        userId: paymentData.userId
      }
    });

    return {
      success: true,
      paymentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      requiresAction: paymentIntent.status === 'requires_action',
      paymentStatus: paymentIntent.status
    };
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw new Error(error.message || 'Payment processing failed');
  }
};

/**
 * Process payment using MoMo
 */
const processMomoPayment = async (paymentData) => {
  const { amount, currency, phoneNumber, externalId } = paymentData;
  
  try {
    // First, get access token
    const token = await getMomoToken();
    
    // Create payment request
    const referenceId = uuidv4();
    const response = await axios.post(
      `${MOMO_CONFIG.baseUrl}/collection/v1_0/requesttopay`,
      {
        amount: amount.toFixed(2),
        currency: currency || 'EUR',
        externalId: externalId || referenceId,
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber.replace(/[^0-9]/g, '')
        },
        payerMessage: 'Car Rental Payment',
        payeeNote: 'Thank you for your payment',
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Reference-Id': referenceId,
          'X-Target-Environment': process.env.MOMO_ENV || 'sandbox',
          'Ocp-Apim-Subscription-Key': MOMO_CONFIG.subscriptionKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      paymentId: referenceId,
      status: 'PENDING',
      message: 'Payment request sent to your mobile phone'
    };
  } catch (error) {
    console.error('MoMo payment error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'MoMo payment processing failed');
  }
};

/**
 * Get MoMo API access token
 */
const getMomoToken = async () => {
  try {
    const auth = Buffer.from(`${MOMO_CONFIG.apiUserId}:${MOMO_CONFIG.apiKey}`).toString('base64');
    
    const response = await axios.post(
      `${MOMO_CONFIG.baseUrl}/collection/token/`,
      {},
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Ocp-Apim-Subscription-Key': MOMO_CONFIG.subscriptionKey,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting MoMo token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with MoMo API');
  }
};

/**
 * Verify MoMo payment status
 */
export const verifyMomoPayment = async (referenceId) => {
  try {
    const token = await getMomoToken();
    
    const response = await axios.get(
      `${MOMO_CONFIG.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Target-Environment': process.env.MOMO_ENV || 'sandbox',
          'Ocp-Apim-Subscription-Key': MOMO_CONFIG.subscriptionKey,
        },
      }
    );

    return {
      status: response.data.status,
      amount: response.data.amount,
      currency: response.data.currency,
      financialTransactionId: response.data.financialTransactionId,
      referenceId: referenceId
    };
  } catch (error) {
    console.error('Error verifying MoMo payment:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  processPayment,
  verifyMomoPayment
};
