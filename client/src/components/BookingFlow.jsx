import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCreateRentalMutation } from '../store/features/rentals/rentalsApiSlice';
import { FaCreditCard, FaMobile } from 'react-icons/fa';

const BookingFlow = ({ car, onClose, onComplete, userId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    carId: car.id,
    userId: userId,
    startDate: '',
    endDate: '',
    pickupAddress: '',
    paymentMethod: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    mobileNumber: '',
    totalDays: 0,
    totalAmount: 0,
    status: 'pending'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    return diffDays || 1; // Minimum 1 day
  };

  const calculateTotalPrice = () => {
    const days = calculateTotalDays();
    return days * car.rentalPricePerDay;
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
    try {
      // Validate payment method specific fields
      if (bookingData.paymentMethod === 'credit_card') {
        if (!bookingData.cardNumber || !bookingData.cardExpiry || !bookingData.cardCvv) {
          toast.error('Please fill in all card details');
          return;
        }
      } else if (bookingData.paymentMethod === 'orange_money' || bookingData.paymentMethod === 'lonestar_money') {
        if (!bookingData.mobileNumber) {
          toast.error('Please enter your mobile number');
          return;
        }
      }
      
      if (!bookingData.pickupAddress) {
        toast.error('Please enter a pickup address');
        return;
      }
      
      setIsSubmitting(true);
      
      // Create rental data object
      const rentalData = {
        carId: bookingData.carId,
        userId: bookingData.userId,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        pickupAddress: bookingData.pickupAddress,
        paymentMethod: bookingData.paymentMethod,
        totalDays: calculateTotalDays(),
        totalPrice: calculateTotalPrice(),
        status: 'confirmed',
        paymentDetails: {}
      };

      // Add payment details if paying by card or mobile money
      if (bookingData.paymentMethod === 'credit_card') {
        rentalData.paymentDetails = {
          cardNumber: bookingData.cardNumber,
          cardExpiry: bookingData.cardExpiry,
          cardCvv: bookingData.cardCvv
        };
      } else if (bookingData.paymentMethod === 'orange_money' || bookingData.paymentMethod === 'lonestar_money') {
        rentalData.paymentDetails = {
          mobileNumber: bookingData.mobileNumber
        };
      }

      // Call the createRental mutation
      const response = await createRental(rentalData).unwrap();
      
      // Show success message
      toast.success('Booking confirmed successfully!');
      
      // Move to the confirmation step
      setCurrentStep(3);
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete(response);
      }
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error(error.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToPayment = () => {
    if (validateDates()) {
      setCurrentStep(2);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${currentStep === 1 ? 'bg-primary text-light' : 'bg-light-dark text-secondary'}`}>
          1
        </div>
        <div className={`h-1 w-16 transition-colors duration-200 ${currentStep > 1 ? 'bg-primary' : 'bg-light-dark'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${currentStep === 2 ? 'bg-primary text-light' : currentStep > 2 ? 'bg-primary text-light' : 'bg-light-dark text-secondary'}`}>
          2
        </div>
        <div className={`h-1 w-16 transition-colors duration-200 ${currentStep > 2 ? 'bg-primary' : 'bg-light-dark'}`}></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${currentStep === 3 ? 'bg-primary text-light' : 'bg-light-dark text-secondary'}`}>
          3
        </div>
      </div>
    );
  };

  const renderStepLabels = () => {
    return (
      <div className="flex items-center justify-center mb-8 text-sm">
        <div className={`text-center w-24 transition-colors duration-200 ${currentStep === 1 ? 'text-primary font-medium' : 'text-secondary-light'}`}>
          Select Dates
        </div>
        <div className="w-8"></div>
        <div className={`text-center w-24 transition-colors duration-200 ${currentStep === 2 ? 'text-primary font-medium' : 'text-secondary-light'}`}>
          Payment
        </div>
        <div className="w-8"></div>
        <div className={`text-center w-24 transition-colors duration-200 ${currentStep === 3 ? 'text-primary font-medium' : 'text-secondary-light'}`}>
          Confirmation
        </div>
      </div>
    );
  };

  const renderDateSelection = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">When you wan' use the car?</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={bookingData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                name="endDate"
                value={bookingData.endDate}
                onChange={handleInputChange}
                min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiCalendar className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleContinueToPayment}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-light font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-200"
        >
          Continue to Payment
        </button>
      </div>
    );
  };

  const renderPayment = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-secondary-dark">How you wan' pay?</h2>
        
        <div className="mb-6">
          <label className="block text-secondary-dark mb-2 font-medium">Choose Payment Method</label>
          <div className="grid grid-cols-3 gap-4">
            <div 
              className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all duration-200 ${bookingData.paymentMethod === 'credit_card' ? 'border-primary bg-light shadow-md' : 'border-light-dark hover:border-primary-light'}`}
              onClick={() => handleInputChange({ target: { name: 'paymentMethod', value: 'credit_card' } })}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <FaCreditCard className={`text-2xl ${bookingData.paymentMethod === 'credit_card' ? 'text-primary' : 'text-secondary-light'}`} />
              </div>
              <span className="text-center text-sm font-medium">Credit/Debit<br/>Card</span>
              <span className="text-xs text-secondary-light mt-1">Visa, Mastercard</span>
            </div>
            
            <div 
              className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all duration-200 ${bookingData.paymentMethod === 'orange_money' ? 'border-primary bg-light shadow-md' : 'border-light-dark hover:border-primary-light'}`}
              onClick={() => handleInputChange({ target: { name: 'paymentMethod', value: 'orange_money' } })}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <FaMobile className={`text-2xl ${bookingData.paymentMethod === 'orange_money' ? 'text-primary' : 'text-secondary-light'}`} />
              </div>
              <span className="text-center text-sm font-medium">Orange Money</span>
              <span className="text-xs text-secondary-light mt-1">Mobile payment</span>
            </div>
            
            <div 
              className={`border rounded-md p-4 flex flex-col items-center cursor-pointer transition-all duration-200 ${bookingData.paymentMethod === 'lonestar_money' ? 'border-primary bg-light shadow-md' : 'border-light-dark hover:border-primary-light'}`}
              onClick={() => handleInputChange({ target: { name: 'paymentMethod', value: 'lonestar_money' } })}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-2">
                <FaMobile className={`text-2xl ${bookingData.paymentMethod === 'lonestar_money' ? 'text-primary' : 'text-secondary-light'}`} />
              </div>
              <span className="text-center text-sm font-medium">Lonestar<br/>Mobile Money</span>
              <span className="text-xs text-secondary-light mt-1">Mobile payment</span>
            </div>
          </div>
        </div>
        
        {/* Payment method specific fields */}
        {bookingData.paymentMethod === 'credit_card' && (
          <div className="mb-6 p-4 border border-light-dark rounded-md bg-light-gray">
            <div className="mb-4">
              <label className="block text-secondary-dark mb-1 text-sm">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={bookingData.cardNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-dark rounded-md"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-secondary-dark mb-1 text-sm">Expiry Date</label>
                <input
                  type="text"
                  name="cardExpiry"
                  value={bookingData.cardExpiry}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-light-dark rounded-md"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-secondary-dark mb-1 text-sm">CVV</label>
                <input
                  type="text"
                  name="cardCvv"
                  value={bookingData.cardCvv}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-light-dark rounded-md"
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        )}
        
        {(bookingData.paymentMethod === 'orange_money' || bookingData.paymentMethod === 'lonestar_money') && (
          <div className="mb-6 p-4 border border-light-dark rounded-md bg-light-gray">
            <div className="mb-4">
              <label className="block text-secondary-dark mb-1 text-sm">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={bookingData.mobileNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-light-dark rounded-md"
                placeholder="+231 XX XXX XXXX"
                required
              />
            </div>
            <p className="text-xs text-secondary-light">You will receive a payment confirmation code on this number</p>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-secondary-dark mb-1 text-sm">Pickup Address</label>
          <input
            type="text"
            name="pickupAddress"
            value={bookingData.pickupAddress}
            onChange={handleInputChange}
            className="w-full p-2 border border-light-dark rounded-md"
            placeholder="Enter pickup address"
            required
          />
        </div>
        
        <button
          onClick={handleSubmitBooking}
          disabled={isSubmitting || !bookingData.paymentMethod}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-light font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-200 mb-4"
        >
          {isSubmitting ? 'Processing...' : `Pay $${calculateTotalPrice()}`}
        </button>
        
        <div className="text-center text-xs text-secondary-light">
          <p>By clicking Pay, you agree to our <span className="text-primary cursor-pointer">Terms & Conditions</span></p>
        </div>
      </div>
    );
  };

  const renderConfirmation = () => {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">Your booking has been successfully completed.</p>
        <p className="text-gray-600 mb-8">A confirmation email has been sent to your registered email address.</p>
        <button
          onClick={onClose}
          className="py-2 px-4 bg-primary hover:bg-primary-dark text-light font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-200"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-light-gray z-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto bg-light shadow-lg rounded-lg my-8 border border-light-dark">
        <div className="p-4 border-b border-light-dark flex items-center">
          <button 
            onClick={onClose}
            className="text-primary hover:text-primary-dark flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Vehicle
          </button>
        </div>
        
        <div className="p-6 pt-8">
          {renderStepIndicator()}
          {renderStepLabels()}
        </div>
        
        {currentStep === 1 && renderDateSelection()}
        {currentStep === 2 && renderPayment()}
        {currentStep === 3 && renderConfirmation()}
        
        <div className="border-t border-light-dark p-4">
          <div className="flex items-center">
            <img 
              src={car.imageUrl || 'https://via.placeholder.com/60x60'} 
              alt={car.make} 
              className="w-12 h-12 object-cover rounded border border-light-dark"
            />
            <div className="ml-3">
              <h3 className="font-medium text-secondary-dark">{car.make} {car.model}</h3>
              <p className="text-sm text-secondary-light">{car.year}</p>
              <p className="text-sm text-secondary-light">{car.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
