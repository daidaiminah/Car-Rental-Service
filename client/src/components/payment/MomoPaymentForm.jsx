import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const MomoPaymentForm = ({ 
  amount, 
  rentalId, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing,
  onPaymentStatusChange
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // 'idle', 'pending', 'success', 'failed'
  const [pollingInterval, setPollingInterval] = useState(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    // Format phone number (remove any non-digit characters and add country code if needed)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    if (formattedPhone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    setError('');
    setPaymentStatus('pending');
    
    try {
      // Initiate MOMO payment
      const response = await api.post('/payments', {
        rentalId,
        paymentMethod: 'momo',
        paymentData: {
          phoneNumber: formattedPhone,
          amount,
          currency: 'UGX', // or get from rental/backend
        },
      });

      const { paymentId } = response;
      
      // Start polling for payment status
      startPolling(paymentId);
      
    } catch (err) {
      console.error('MOMO payment error:', err);
      const errorMessage = err.response?.data?.error || 'Payment initiation failed. Please try again.';
      setError(errorMessage);
      setPaymentStatus('failed');
      onError(errorMessage);
      setIsProcessing(false);
    }
  };

  const startPolling = (paymentId) => {
    // Clear any existing interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Set up new polling
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/payments/verify/momo/${paymentId}`);
        const { status } = response;
        
        if (status === 'SUCCESSFUL') {
          // Payment successful
          clearInterval(interval);
          setPaymentStatus('success');
          onSuccess(response);
          toast.success('Payment successful!');
        } else if (status === 'FAILED') {
          // Payment failed
          clearInterval(interval);
          setPaymentStatus('failed');
          setError('Payment failed. Please try again.');
          onError('Payment failed');
        }
        // If status is PENDING, do nothing and continue polling
      } catch (err) {
        console.error('Error polling payment status:', err);
        // Don't stop polling on error, just log it
      }
    }, 3000); // Poll every 3 seconds

    setPollingInterval(interval);
    
    // Stop polling after 5 minutes (300 seconds)
    setTimeout(() => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        if (paymentStatus === 'pending') {
          setError('Payment verification timeout. Please check your mobile money and refresh the page.');
          setPaymentStatus('failed');
          onError('Payment verification timeout');
        }
      }
    }, 300000);
  };

  return (
    <div className="space-y-6">
      {paymentStatus === 'pending' ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-700 mb-2">Waiting for payment confirmation...</p>
          <p className="text-sm text-gray-500">
            Please check your mobile phone and complete the payment on your MOMO app.
          </p>
        </div>
      ) : paymentStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Payment Successful!</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your payment of UGX {amount.toLocaleString()} has been received.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Mobile Money Number
            </label>
            <div className="mt-1 relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">+256</span>
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-16 sm:pl-14 sm:text-sm border-gray-300 rounded-md"
                placeholder="700000000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isProcessing}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter your mobile money number to receive a payment request
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isProcessing}
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay UGX ${amount.toLocaleString()}`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MomoPaymentForm;
