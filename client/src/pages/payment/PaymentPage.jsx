import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import PaymentMethodSelector from '../../components/payment/PaymentMethodSelector';
import Loader from '../../components/common/Loader';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentPage = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [rental, setRental] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch rental details
  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await api.get(`/rentals/${rentalId}`);
        setRental(response);
      } catch (err) {
        console.error('Error fetching rental:', err);
        setError('Failed to load rental details. Please try again.');
        toast.error('Failed to load rental details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRental();
  }, [rentalId]);

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    toast.success('Payment successful!');
    // Redirect to success page or rental details
    navigate(`/rentals/${rentalId}/success`);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setError(error.message || 'Payment failed. Please try again.');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Error</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Complete Your Payment
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Choose your preferred payment method to complete your rental booking
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rental ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {rental.id}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Vehicle</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {rental.car?.make} {rental.car?.model} ({rental.car?.year})
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rental Period</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900 sm:mt-0 sm:col-span-2">
                  ${rental.totalCost?.toFixed(2)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
              Select Payment Method
            </h3>
            
            <Elements stripe={stripePromise}>
              <PaymentMethodSelector 
                rental={rental} 
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
