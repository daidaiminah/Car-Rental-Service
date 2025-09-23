import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

const BookingCancel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const rentalId = searchParams.get('rental_id');
    
    if (rentalId) {
      // Here you could update the rental status to 'cancelled' via API if needed
      console.log(`Booking ${rentalId} was cancelled by user`);
    }
    
    toast.warning('Your booking was cancelled. No payment was processed.');
  }, [location.search]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
          <FiAlertCircle className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Booking Cancelled</h1>
        <p className="mt-2 text-gray-600">
          Your booking was not completed. No payment has been processed.
        </p>
        
        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/cars')}
            className="w-full mt-3 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
          >
            Browse Cars
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCancel;
