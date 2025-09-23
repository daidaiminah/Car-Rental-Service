import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const StripePaymentForm = ({ 
  amount, 
  rentalId, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment method using card element
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // Process payment with our backend
      const response = await api.post('/payments', {
        rentalId,
        paymentMethod: 'stripe',
        paymentData: {
          paymentMethodId: paymentMethod.id,
          amount,
          currency: 'usd',
        },
      });

      const { requiresAction, clientSecret } = response.paymentResult;

      if (requiresAction) {
        // Handle 3D Secure authentication if needed
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret);
        
        if (confirmError) {
          throw new Error(confirmError.message);
        }

        if (paymentIntent.status === 'succeeded') {
          onSuccess(paymentIntent);
        } else {
          throw new Error('Payment failed. Please try again.');
        }
      } else {
        // Payment succeeded without 3D Secure
        onSuccess(response.payment);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="border border-gray-300 rounded-md p-4">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={isProcessing}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};

export default StripePaymentForm;
