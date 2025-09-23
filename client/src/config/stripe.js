import { loadStripe } from '@stripe/stripe-js';

// Make sure to replace with your publishable key from Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const createCheckoutSession = async (bookingData) => {
  try {
    const response = await fetch('/api/payments/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
