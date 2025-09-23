import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from './StripePaymentForm';
import MomoPaymentForm from './MomoPaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentMethodSelector = ({ rental, onPaymentSuccess, onPaymentError }) => {
  const [selectedMethod, setSelectedMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => handlePaymentMethodChange('stripe')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedMethod === 'stripe'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Credit/Debit Card
          </button>
          <button
            onClick={() => handlePaymentMethodChange('momo')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              selectedMethod === 'momo'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mobile Money (MOMO)
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {selectedMethod === 'stripe' ? (
          <Elements stripe={stripePromise}>
            <StripePaymentForm 
              amount={rental.totalCost}
              onSuccess={onPaymentSuccess}
              onError={onPaymentError}
              rentalId={rental.id}
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </Elements>
        ) : (
          <MomoPaymentForm 
            amount={rental.totalCost}
            onSuccess={onPaymentSuccess}
            onError={onPaymentError}
            rentalId={rental.id}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
