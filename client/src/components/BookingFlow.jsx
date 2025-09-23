import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCheck, FiCreditCard } from 'react-icons/fi';
import { FaMobile } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCreateRentalMutation } from '../store/features/rentals/rentalsApiSlice';
import { useCreateCheckoutSessionMutation } from '../store/features/payment/paymentApiSlice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAuth } from '../store/authContext';
import { useNavigate } from 'react-router-dom';

// Stripe Elements configuration
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);



const BookingFlow = ({ car, onClose, onComplete, userId }) => {
  console.log('Car object in BookingFlow:', car);
  
  // Ensure car object has required properties
  const safeCar = {
    ...car,
    rentalPricePerDay: Number(car?.rentalPricePerDay) || 0,
    id: car?.id || '',
    make: car?.make || 'Unknown',
    model: car?.model || 'Car'
  };
  const [createRental] = useCreateRentalMutation();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth(); // Get the authenticated user from context
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    carId: safeCar.id,
    userId: userId,
    startDate: '',
    endDate: '',
    pickupAddress: '',
    paymentMethod: 'credit_card', // Default payment method
    totalDays: 0,
    totalAmount: safeCar.rentalPricePerDay || 0,
    status: 'pending_payment'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1;
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    const basePrice = days * safeCar.rentalPricePerDay;
    // Add any additional fees or taxes here if needed
    return basePrice;
  };

  const checkCarAvailability = async (carId, startDate, endDate) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/cars/available?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to check car availability');
      }
      
      const result = await response.json();
      
      // Check if the specific car is in the available cars list
      const isAvailable = result.data?.some(car => car.id === carId) || false;
      
      if (!isAvailable) {
        console.log('Car not available. Available cars:', result.data);
      }
      
      return isAvailable;
    } catch (error) {
      console.error('Error checking car availability:', error);
      return false; // Assume car is not available if there's an error
    }
  };

  useEffect(() => {
    // Only check availability if both dates are selected
    if (bookingData.startDate && bookingData.endDate) {
      const check = async () => {
        const isAvailable = await checkCarAvailability(
          safeCar.id,
          bookingData.startDate,
          bookingData.endDate
        );
        if (!isAvailable) {
          toast.warn('This car is not available for the selected dates.');
        }
      };
      check();
    }
  }, [bookingData.startDate, bookingData.endDate]);

  const handlePayment = async () => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to complete your booking');
      return;
    }

    if (!bookingData.paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    if (!bookingData.startDate || !bookingData.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    // For Orange Money, we need the mobile number
    if (bookingData.paymentMethod === 'orange_money' && !bookingData.mobileNumber) {
      toast.error('Please enter your Orange Money mobile number');
      return;
    }

    if (!bookingData.pickupAddress) {
      toast.error('Please enter a pickup address');
      return;
    }

    setIsProcessing(true);

    try {
      // Re-check availability right before creating the rental to avoid race conditions
      const isAvailable = await checkCarAvailability(
        safeCar.id,
        bookingData.startDate,
        bookingData.endDate
      );

      if (!isAvailable) {
        toast.error('This car is no longer available for the selected dates. Please choose different dates or another car.');
        setIsProcessing(false);
        return;
      }
      const totalDays = calculateTotalDays();
      const totalAmount = calculateTotalPrice();
      
      // First create a rental record with pending_payment status
      const rental = await createRental({
        carId: safeCar.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalDays: totalDays,
        totalAmount: totalAmount,
        pickupAddress: bookingData.pickupAddress,
        paymentMethod: bookingData.paymentMethod,
        status: 'pending', // This will be updated after payment
        paymentStatus: 'pending',
      }).unwrap();

      console.log('[BookingFlow] Response from createRental:', rental);

      // For both payment methods, we'll use Stripe Checkout
      const { url } = await createCheckoutSession({
        rentalId: rental.data.id, // Correctly access the nested ID
        carId: safeCar.id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickupAddress: bookingData.pickupAddress,
        totalAmount: totalAmount,
        totalDays: totalDays,
        userId: userId,
        userEmail: user?.email || '',
        userName: user?.name || 'Customer',
        paymentMethod: bookingData.paymentMethod,
        ...(bookingData.paymentMethod === 'orange_money' && {
          mobileNumber: bookingData.mobileNumber
        })
      }).unwrap();

      // Redirect to payment page
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      
      // Handle specific error cases
      if (error.data) {
        console.error('Error details:', error.data);
        
        if (error.data.message?.includes('not available')) {
          // Show a more user-friendly message for availability issues
          toast.error('This car is no longer available for the selected dates. Please choose different dates or another car.');
          // Reset the form or take the user back to the search
          onBackToSearch();
        } else if (error.status === 400) {
          // Handle other 400 errors
          toast.error(error.data.message || 'Please check your booking details and try again.');
        } else if (error.status === 401) {
          // Handle unauthorized errors
          toast.error('Your session has expired. Please log in again.');
          // Redirect to login
          navigate('/login', { state: { from: window.location.pathname } });
        } else {
          // Generic error message for other cases
          toast.error(error.data.message || 'An error occurred. Please try again later.');
        }
      } else {
        // Fallback for network errors or other unexpected errors
        toast.error('Failed to process your request. Please check your connection and try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const validateDates = () => {
    if (!bookingData.startDate) {
      toast.error('Please select a start date');
      return false;
    }
    if (!bookingData.endDate) {
      toast.error('Please select an end date');
      return false;
    }
    
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (start < today) {
      toast.error('Start date cannot be in the past');
      return false;
    }
    
    if (end <= start) {
      toast.error('End date must be after start date');
      return false;
    }
    
    return true;
  };

  const handleSubmitBooking = async () => {
    try{
     if (!validateDates()) {
      return;
    }
  
    if (!bookingData.pickupAddress) {
      toast.error('Please provide a pickup address');
      console.error('Error creating booking:', error);
      toast.error(error.data?.message || 'Failed to create booking. Please try again.');
    }} finally {
      setIsSubmitting(false);
    }
  
  }
  
  const handleContinueToPayment = async () => {
    if (!validateDates()) {
      return;
    }
    
    if (!bookingData.pickupAddress) {
      toast.error('Please provide a pickup address');
      return;
    }
    
    // Update booking data with calculated values
    setBookingData(prev => ({
      ...prev,
      totalDays: calculateTotalDays(),
      totalAmount: calculateTotalPrice()
    }));
    
    setCurrentStep(2);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {currentStep > 1 ? <FiCheck className="w-4 h-4" /> : '1'}
      </div>
      <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {currentStep > 2 ? <FiCheck className="w-4 h-4" /> : '2'}
      </div>
      <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
        currentStep === 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        3
      </div>
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex items-center justify-center mb-8 text-sm">
      <div className={`text-center w-24 ${currentStep === 1 ? 'text-primary font-medium' : 'text-gray-500'}`}>
        Select Dates
      </div>
      <div className="w-8"></div>
      <div className={`text-center w-24 ${currentStep === 2 ? 'text-primary font-medium' : 'text-gray-500'}`}>
        Payment
      </div>
      <div className="w-8"></div>
      <div className={`text-center w-24 ${currentStep === 3 ? 'text-primary font-medium' : 'text-gray-500'}`}>
        Confirmation
      </div>
    </div>
  );

  const renderDateSelection = () => (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Select Rental Dates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
          <input
            type="date"
            name="startDate"
            value={bookingData.startDate}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
          <input
            type="date"
            name="endDate"
            value={bookingData.endDate}
            onChange={handleInputChange}
            min={bookingData.startDate || new Date().toISOString().split('T')[0]}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={!bookingData.startDate}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
        <input
          type="text"
          name="pickupAddress"
          value={bookingData.pickupAddress}
          onChange={handleInputChange}
          placeholder="Enter pickup address"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Rental Summary</h3>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Daily Rate:</span>
          <span>${safeCar.rentalPricePerDay.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-600">Number of Days:</span>
          <span>{calculateTotalDays()}</span>
        </div>
        <div className="border-t border-blue-200 my-2"></div>
        <div className="flex justify-between font-medium">
          <span>Total Amount:</span>
          <span>${calculateTotalPrice().toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!bookingData.startDate || !bookingData.endDate || !bookingData.pickupAddress}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Car:</span>
            <span className="font-medium">{car.make} {car.model}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Rental Period:</span>
            <span>{new Date(bookingData.startDate).toLocaleDateString()} - {new Date(bookingData.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Pickup Location:</span>
            <span>{bookingData.pickupAddress || 'Not specified'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Total Days:</span>
            <span>{calculateTotalDays()} {calculateTotalDays() === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
            <span>Total Amount:</span>
            <span>${calculateTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              bookingData.paymentMethod === 'credit_card' 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setBookingData(prev => ({...prev, paymentMethod: 'credit_card'}))}
          >
            <div className="flex items-center">
              <FiCreditCard className={`mr-2 text-xl ${bookingData.paymentMethod === 'credit_card' ? 'text-blue-600' : 'text-gray-600'}`} />
              <span className={bookingData.paymentMethod === 'credit_card' ? 'font-medium text-blue-600' : 'text-gray-700'}>
                Credit / Debit Card
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Pay securely with your credit or debit card</p>
          </div>
          
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              bookingData.paymentMethod === 'orange_money' 
                ? 'border-orange-500 bg-orange-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setBookingData(prev => ({...prev, paymentMethod: 'orange_money'}))}
          >
            <div className="flex items-center">
              <FaMobile className={`mr-2 text-xl ${bookingData.paymentMethod === 'orange_money' ? 'text-orange-500' : 'text-gray-600'}`} />
              <span className={bookingData.paymentMethod === 'orange_money' ? 'font-medium text-orange-500' : 'text-gray-700'}>
                Orange Money
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Pay with your Orange Money account</p>
          </div>
          
          <div 
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              bookingData.paymentMethod === 'momo_money' 
                ? 'border-purple-600 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setBookingData(prev => ({...prev, paymentMethod: 'momo_money'}))}
          >
            <div className="flex items-center">
              <FaMobile className={`mr-2 ${bookingData.paymentMethod === 'momo_money' ? 'text-purple-600' : 'text-gray-600'}`} />
              <span className={bookingData.paymentMethod === 'momo_money' ? 'font-medium text-purple-600' : 'text-gray-700'}>
                Momo Money
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Pay with your Momo Money account</p>
          </div>
        </div>

        {bookingData.paymentMethod === 'credit_card' ? (
          <div className="mt-6">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? 'Processing...' : `Pay $${calculateTotalPrice().toFixed(2)} with Credit Card`}
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center">You'll be redirected to Stripe's secure payment page</p>
          </div>
        ) : bookingData.paymentMethod === 'orange_money' ? (
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={bookingData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter your Orange Money number"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing || !bookingData.mobileNumber}
              className={`w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? 'Processing...' : `Pay $${calculateTotalPrice().toFixed(2)} with Orange Money`}
            </button>
            <p className="text-sm text-gray-500 mt-2 text-center">You'll be redirected to complete your payment</p>
          </div>
        ) : bookingData.paymentMethod === 'momo_money' ? (
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={bookingData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter your Momo number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSubmitBooking}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
              disabled={!bookingData.mobileNumber}
            >
              Pay with Momo
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
      <p className="text-gray-600 mb-6">Your booking has been successfully processed.</p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-primary/80 text-white rounded-md hover:bg-primary"
      >
        Close
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Complete Your Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isProcessing}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex-1 border-t-2 ${currentStep >= 1 ? 'border-blue-600' : 'border-gray-300'} pt-1`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 1 ? <FiCheck className="text-white" /> : '1'}
                </div>
                <p className="text-center text-sm mt-1">Details</p>
              </div>
              <div className={`flex-1 border-t-2 ${currentStep >= 2 ? 'border-blue-600' : 'border-gray-300'} pt-1`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {currentStep > 2 ? <FiCheck className="text-white" /> : '2'}
                </div>
                <p className="text-center text-sm mt-1">Payment</p>
              </div>
              <div className={`flex-1 border-t-2 ${currentStep >= 3 ? 'border-blue-600' : 'border-gray-300'} pt-1`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
                <p className="text-center text-sm mt-1">Confirmation</p>
              </div>
            </div>
          </div>
          
          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && renderDateSelection()}
            {currentStep === 2 && renderPayment()}
            {currentStep === 3 && renderConfirmation()}
          </div>
        </div>
      </div>
    </div>
  );

};

export default BookingFlow;
