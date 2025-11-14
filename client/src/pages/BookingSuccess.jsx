import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  FiCheck, 
  FiCalendar, 
  FiMapPin, 
  FiAlertCircle, 
  FiClock, 
  FiDollarSign,
  FiUser
} from 'react-icons/fi';
import { useGetRentalQuery } from '../store/features/rentals/rentalsApiSlice';
import { toast } from 'react-toastify';

const BookingSuccess = () => {
  const { rentalId: paramRentalId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [rentalId, setRentalId] = useState('');
  
  // Extract rental_id and session_id from URL
  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    const rentalIdFromUrl = searchParams.get('rental_id') || paramRentalId;
    
    console.log('URL Parameters:', { sessionIdParam, rentalIdFromUrl, paramRentalId });
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
    }
    
    if (rentalIdFromUrl) {
      setRentalId(rentalIdFromUrl);
    } else {
      console.error('No rental ID found in URL');
      toast.error('Invalid booking reference. Please check your email for confirmation.');
    }
  }, [searchParams, paramRentalId]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  };

  // Get rental details
  const { 
    data: rentalResponse, 
    isLoading, 
    isError,
    error
  } = useGetRentalQuery(rentalId, {
    skip: !rentalId,
    refetchOnMountOrArgChange: true
  });
  
  const rental = useMemo(() => {
    if (!rentalResponse) return null;
    if (rentalResponse?.data) return rentalResponse.data;
    return rentalResponse;
  }, [rentalResponse]);
  
  console.log('Rental data:', { rentalResponse, rental, isLoading, isError, error, rentalId });
  
  const toNumber = (value) => {
    if (value === undefined || value === null) return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const totalAmount = rental
    ? toNumber(rental.totalCost) ||
      (toNumber(rental.car?.rentalPricePerDay) * toNumber(rental.totalDays))
    : 0;

  const carName = rental?.car 
    ? `${rental.car.make || ''} ${rental.car.model || ''} ${rental.car.year || ''}`.trim()
    : 'Car details not available';
    
  const formatPrice = (price) => toNumber(price).toFixed(2);

  const rentalStatus = (rental?.status || 'pending').toLowerCase();
  const paymentStatus = (rental?.paymentStatus || 'pending').toLowerCase();

  const bookingReference = useMemo(() => {
    if (rental?.id) return rental.id;
    if (rentalId) return rentalId;
    return null;
  }, [rental?.id, rentalId]);

  const statusMap = {
    pending: {
      label: 'Pending Confirmation',
      badgeClass: 'bg-yellow-100 text-yellow-800',
      heading: 'Booking Received!',
      message: "We've logged your booking and it is awaiting confirmation. We'll notify you soon."
    },
    confirmed: {
      label: 'Confirmed',
      badgeClass: 'bg-green-100 text-green-800',
      heading: 'Booking Confirmed!',
      message: 'Thank you for your booking. Everything is set—check your email for the confirmation details.'
    },
    in_progress: {
      label: 'In Progress',
      badgeClass: 'bg-blue-100 text-blue-800',
      heading: 'Your Trip Is Underway!',
      message: 'Enjoy your ride. Reach out if you need any assistance during your trip.'
    },
    completed: {
      label: 'Completed',
      badgeClass: 'bg-gray-200 text-gray-800',
      heading: 'Trip Completed',
      message: 'Thanks for riding with us—we hope you had a great experience!'
    },
    cancelled: {
      label: 'Cancelled',
      badgeClass: 'bg-red-100 text-red-800',
      heading: 'Booking Cancelled',
      message: 'This booking was cancelled. Contact support if you need further assistance.'
    }
  };

  const paymentStatusMap = {
    pending: { label: 'Pending', badgeClass: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'Paid', badgeClass: 'bg-green-100 text-green-800' },
    partially_refunded: { label: 'Partially Refunded', badgeClass: 'bg-blue-100 text-blue-800' },
    refunded: { label: 'Refunded', badgeClass: 'bg-gray-200 text-gray-800' },
    failed: { label: 'Payment Failed', badgeClass: 'bg-red-100 text-red-800' }
  };

  const statusDetails = statusMap[rentalStatus] || statusMap.pending;
  const paymentStatusDetails = paymentStatusMap[paymentStatus] || paymentStatusMap.pending;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your booking details...</p>
          {rentalId && (
            <p className="text-sm text-gray-500 mt-2">Reference: {rentalId}</p>
          )}
        </div>
      </div>
    );
  }

  if (isError || (rentalId && !rental)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg text-center">
          <div className="text-[#faeb1c] text-6xl mb-4 flex justify-center">
            <FiAlertCircle className="h-16 w-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Booking Details Not Found</h1>
          <p className="text-gray-600 mb-4">
            We're having trouble loading your booking details. This might be because:
          </p>
          <ul className="text-left text-gray-600 mb-6 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>The booking is still being processed (please wait a moment and refresh)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You may have navigated to this page directly without a valid booking reference</span>
            </li>
          </ul>
          
          {rentalId && (
            <div className="bg-gray-100 p-4 rounded-md mb-6 text-left">
              <p className="text-sm font-medium text-gray-700">Reference ID:</p>
              <p className="font-mono text-sm bg-white p-2 rounded mt-1">{rentalId}</p>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm border border-gray-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success case - display booking confirmation
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <FiCheck className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
            {statusDetails.heading}
          </h1>
          <p className="text-lg text-gray-600">
            {statusDetails.message}
          </p>
          {bookingReference && (
            <p className="mt-2 text-sm text-gray-500">
              Booking Reference: {bookingReference.toString().toUpperCase()}
            </p>
          )}
          {!bookingReference && sessionId && (
            <p className="mt-2 text-sm text-gray-500">
              Stripe Session: {sessionId.substring(0, 8)}...
            </p>
          )}
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white overflow-hidden rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Booking Summary</h2>
          </div>
          
          <div className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Booking Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiCalendar className="mr-2 text-blue-600" />
                  Booking Details
                </h3>
                
                <dl className="space-y-4">
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Booking ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono sm:col-span-2">
                      {bookingReference
                        ? bookingReference.toString().toUpperCase()
                        : 'N/A'}
                    </dd>
                  </div>
                  
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDetails.badgeClass}`}>
                        {statusDetails.label}
                      </span>
                    </dd>
                  </div>
                  
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                    <dd className="mt-1">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${paymentStatusDetails.badgeClass}`}>
                        {paymentStatusDetails.label}
                      </span>
                    </dd>
                  </div>
                  
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Pickup Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {formatDate(rental?.startDate)}
                    </dd>
                  </div>
                  
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Return Date</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {formatDate(rental?.endDate)}
                    </dd>
                  </div>
                  
                  <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                      {rental?.totalDays || 'N/A'} days
                    </dd>
                  </div>
                </dl>
              </div>
              
              {/* Right Column - Car Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="mr-2 text-blue-600" />
                  Car Details
                </h3>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden bg-gray-200">
                    <img
                      src={rental?.car?.imageUrl || 'https://via.placeholder.com/80?text=Car'}
                      alt={carName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/80?text=Car';
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{carName}</h4>
                    <p className="text-sm text-gray-500">
                      {rental?.car?.type || 'N/A'} • {rental?.car?.seats || 'N/A'} Seats
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      <FiDollarSign className="inline mr-1" />
                      {formatPrice(totalAmount)} total
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Pickup Location</h4>
                  <p className="text-sm text-gray-900">
                    {rental?.pickupLocation || rental?.pickupAddress || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-white overflow-hidden rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">What's Next?</h2>
          </div>
          <div className="px-6 py-5">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-green-600">
                  <FiCheck className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Booking Confirmed</p>
                  <p className="text-sm text-gray-500">
                    We've received your booking request and are processing it now.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                  <FiUser className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Verify Your ID</p>
                  <p className="text-sm text-gray-500">
                    Please bring your driver's license and payment method when picking up the car.
                  </p>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-gray-400">
                  <FiClock className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Pick Up Your Car</p>
                  <p className="text-sm text-gray-500">
                    Arrive 15 minutes before your scheduled pickup time to complete the paperwork.
                  </p>
                </div>
              </li>
            </ul>
            
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500">
                If you have any questions about your booking, please contact our support team at{' '}
                <a href="mailto:support@carrental.com" className="text-blue-600 hover:text-blue-500">
                  support@carrental.com
                </a>{' '}
                or call us at <span className="font-medium">(123) 456-7890</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
