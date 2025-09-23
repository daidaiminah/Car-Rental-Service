import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useGetRentalQuery } from '../store/features/rentals/rentalsApiSlice';
import { toast } from 'react-toastify';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  
  // Extract session_id from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionIdParam = searchParams.get('session_id');
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    } else {
      // If no session_id, redirect to home
      toast.error('Invalid booking session');
      navigate('/');
    }
  }, [location.search, navigate]);
  
  // Get rental ID from URL
  const rentalId = new URLSearchParams(location.search).get('rental_id');
  
  // Fetch rental details using the rental ID
  const { data: rental, isLoading, isError } = useGetRentalQuery(
    rentalId,
    { skip: !rentalId }
  );
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Processing your booking...</p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your booking details. Please check your email for confirmation or contact support.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-blue-800">
            <div className="flex items-center">
              <div className="bg-white p-2 rounded-full mr-4">
                <FiCheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
                <p className="mt-1 text-blue-100">Your payment was successful</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Details</h3>
                <dl className="space-y-4">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">#{rental?.id?.substring(0, 8)?.toUpperCase()}</dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Car</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {rental?.car?.make} {rental?.car?.model} {rental?.car?.year}
                    </dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Rental Period</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {new Date(rental?.startDate).toLocaleDateString()} - {new Date(rental?.endDate).toLocaleDateString()}
                      <span className="text-gray-500 ml-2">({rental?.totalDays} days)</span>
                    </dd>
                  </div>
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Pickup Location</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {rental?.pickupAddress || 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Subtotal</span>
                    <span className="text-sm font-medium">${rental?.totalAmount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Taxes & Fees</span>
                    <span className="text-sm font-medium">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <span className="text-base font-medium">Total</span>
                      <span className="text-base font-bold">${rental?.totalAmount?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">What's next?</h4>
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email with all the details. 
                    Please bring your driver's license and payment method when picking up the car.
                  </p>
                  
                  <div className="mt-6">
                    <button
                      onClick={() => navigate('/my-bookings')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View My Bookings
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full mt-3 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
