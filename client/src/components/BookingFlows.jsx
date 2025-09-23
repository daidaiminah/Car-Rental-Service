// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft, FiCalendar, FiCheck } from 'react-icons/fi';
// import { toast } from 'react-toastify';
// import { useCreateRentalMutation } from '../store/features/rentals/rentalsApiSlice';
// import { FaCreditCard, FaMobile } from 'react-icons/fa';

// const BookingFlow = ({ car, onClose, onComplete, userId }) => {
//     const [createRental, { isLoading }] = useCreateRentalMutation();
//   const navigate = useNavigate();
//   const [currentStep, setCurrentStep] = useState(1);
//   const [bookingData, setBookingData] = useState({
//     carId: car.id,
//     userId: userId,
//     startDate: '',
//     endDate: '',
//     pickupAddress: '',
//     paymentMethod: '',
//     cardNumber: '',
//     cardExpiry: '',
//     cardCvv: '',
//     mobileNumber: '',
//     totalDays: 0,
//     totalAmount: 0,
//     status: 'pending'
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);


//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setBookingData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const calculateTotalDays = () => {
//     if (!bookingData.startDate || !bookingData.endDate) return 0;
    
//     const start = new Date(bookingData.startDate);
//     const end = new Date(bookingData.endDate);
//     const diffTime = Math.abs(end - start);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//     return diffDays || 1; // Minimum 1 day
//   };

//   const calculateTotalPrice = () => {
//     const days = calculateTotalDays();
//     return days * car.rentalPricePerDay;
//   };

//   const validateDates = () => {
//     if (!bookingData.startDate) {
//       toast.error('Please select a start date');
//       return false;
//     }
//     if (!bookingData.endDate) {
//       toast.error('Please select an end date');
//       return false;
//     }
    
//     const start = new Date(bookingData.startDate);
//     const end = new Date(bookingData.endDate);
//     const today = new Date();
    
//     if (start < today) {
//       toast.error('Start date cannot be in the past');
//       return false;
//     }
    
//     if (end <= start) {
//       toast.error('End date must be after start date');
//       return false;
//     }
    
//     return true;
//   };

//   const handleSubmitBooking = async () => {
//     try {
//       // Validate payment method specific fields
//       if (bookingData.paymentMethod === 'credit_card') {
//         if (!bookingData.cardNumber || !bookingData.cardExpiry || !bookingData.cardCvv) {
//           toast.error('Please fill in all card details');
//           return;
//         }
//       } else if (bookingData.paymentMethod === 'orange_money' || bookingData.paymentMethod === 'lonestar_money') {
//         if (!bookingData.mobileNumber) {
//           toast.error('Please enter your mobile number');
//           return;
//         }
//       }
      
//       if (!bookingData.pickupAddress) {
//         toast.error('Please enter a pickup address');
//         return;
//       }
      
//       setIsSubmitting(true);
      
//       // Create rental data object
//       const rentalData = {
//         carId: bookingData.carId,
//         userId: bookingData.userId,
//         startDate: bookingData.startDate,
//         endDate: bookingData.endDate,
//         pickupAddress: bookingData.pickupAddress,
//         paymentMethod: bookingData.paymentMethod,
//         totalDays: calculateTotalDays(),
//         totalPrice: calculateTotalPrice(),
//         status: 'confirmed',
//         paymentDetails: {}
//       };

//       // Add payment details if paying by card or mobile money
//       if (bookingData.paymentMethod === 'credit_card') {
//         rentalData.paymentDetails = {
//           cardNumber: bookingData.cardNumber,
//           cardExpiry: bookingData.cardExpiry,
//           cardCvv: bookingData.cardCvv
//         };
//       } else if (bookingData.paymentMethod === 'orange_money' || bookingData.paymentMethod === 'lonestar_money') {
//         rentalData.paymentDetails = {
//           mobileNumber: bookingData.mobileNumber
//         };
//       }

//       // Call the createRental mutation
//       const response = await createRental(rentalData).unwrap();
      
//       // Show success message
//       toast.success('Booking confirmed successfully!');
      
//       // Move to the confirmation step
//       setCurrentStep(3);
      
//       // Call the onComplete callback if provided
//       if (onComplete) {
//         onComplete(response);
//       }
      
//     } catch (error) {
//       console.error('Error creating booking:', error);
//       toast.error(error.data?.message || 'Failed to create booking. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleContinueToPayment = () => {
//     if (!validateDates()) {
//       return;
//     }
//     if (!bookingData.pickupAddress) {
//       toast.error('Please provide a pickup address');
//       return;
//     }
//     setCurrentStep(2);
//   };

//   const renderStepIndicator = () => {
//     return (
//       <div className="flex items-center justify-center mb-8">
//         <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${currentStep >= 1 ? 'bg-primary text-light' : 'bg-light-dark text-secondary'}`}>
//           {currentStep > 1 ? <FiCheck className="w-4 h-4" /> : '1'}
//         </div>
//         <div className={`h-1 w-16 transition-colors duration-200 ${currentStep > 1 ? 'bg-primary' : 'bg-light-dark'}`}></div>
//         <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${currentStep === 2 ? 'bg-primary text-light' : currentStep > 2 ? 'bg-primary text-light' : 'bg-light-dark text-secondary'}`}>
//           {currentStep > 2 ? <FiCheck className="w-4 h-4" /> : '2'}
//         </div>
//         <div className={`h-1 w-16 transition-colors duration-200 ${currentStep > 2 ? 'bg-primary' : 'bg-light-dark'}`}></div>
//         <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${currentStep === 3 ? 'bg-primary text-light' : 'bg-light-dark text-secondary'}`}>
//           3
//         </div>
//       </div>
//     );
//   };

//   const renderStepLabels = () => {
//     return (
//       <div className="flex items-center justify-center mb-8 text-sm">
//         <div className={`text-center w-24 transition-colors duration-200 ${currentStep === 1 ? 'text-primary font-medium' : 'text-secondary-light'}`}>
//           Select Dates
//         </div>
//         <div className="w-8"></div>
//         <div className={`text-center w-24 transition-colors duration-200 ${currentStep === 2 ? 'text-primary font-medium' : 'text-secondary-light'}`}>
//           Payment
//         </div>
//         <div className="w-8"></div>
//         <div className={`text-center w-24 transition-colors duration-200 ${currentStep === 3 ? 'text-primary font-medium' : 'text-secondary-light'}`}>
//           Confirmation
//         </div>
//       </div>
//     );
//   };

//   const renderDateSelection = () => {
//     return (
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-6">Select Rental Dates</h2>
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 name="startDate"
//                 value={bookingData.startDate}
//                 onChange={handleInputChange}
//                 min={new Date().toISOString().split('T')[0]}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <div className="relative">
//               <input
//                 type="date"
//                 name="endDate"
//                 value={bookingData.endDate}
//                 onChange={handleInputChange}
//                 min={bookingData.startDate || new Date().toISOString().split('T')[0]}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>
//           </div>
//         </div>
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
//           <input
//             type="text"
//             name="pickupAddress"
//             value={bookingData.pickupAddress}
//             onChange={handleInputChange}
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Enter pickup address"
//             required
//           />
//         </div>
//         <button
//           onClick={handleContinueToPayment}
//           className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
//         >
//           Continue to Payment
//         </button>
//       </div>
//     );
//   };


//   const handlePaymentSubmit = async (e) => {
//     e.preventDefault();
//     setShowPaymentModal(false);
//     await processPayment('card');
//   };

//   const renderPaymentModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h3 className="text-lg font-medium mb-4">Enter Card Details</h3>
//         <form onSubmit={handlePaymentSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
//               <input
//                 type="text"
//                 value={paymentDetails.cardNumber}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
//                 placeholder="1234 5678 9012 3456"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
//               <input
//                 type="text"
//                 value={paymentDetails.cardName}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
//                 placeholder="John Doe"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                 <input
//                   type="text"
//                   value={paymentDetails.expiryDate}
//                   onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
//                   placeholder="MM/YY"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//                 <input
//                   type="text"
//                   value={paymentDetails.cvv}
//                   onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
//                   placeholder="123"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="saveCard"
//                 checked={paymentDetails.saveCard}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, saveCard: e.target.checked})}
//                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//               />
//               <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
//                 Save card for future payments
//               </label>
//             </div>
//           </div>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => setShowPaymentModal(false)}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//             >
//               Confirm Payment
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (currentStep === 1) {
//     if (!validateDates() || !bookingData.pickupLocation) {
//       if (!bookingData.pickupLocation) {
//         toast.error('Please provide a pickup location');
//       }
//       return;
//     }

//     setBookingData(prev => ({
//       ...prev,
//       totalDays: calculateTotalDays(),
//       totalAmount: calculateTotalPrice(),
//       dropoffLocation: prev.dropoffLocation || prev.pickupLocation,
//       pickupTime: pickupTime
//     }));

//     setCurrentStep(2);
//     return;
//   }

//   if (currentStep === 2) {
//     if (!bookingData.paymentMethod) {
//       toast.error('Please select a payment method');
//       return;
//     }

//     if (bookingData.paymentMethod === 'card') {
//       setShowPaymentModal(true);
//     } else {
//       await processPayment(bookingData.paymentMethod);
//     }
//   }
// };

// const renderSteps = () => {
//   const steps = [
//     { number: 1, label: 'Booking Details' },
//     { number: 2, label: 'Payment Method' },
//     { number: 3, label: 'Complete Payment' }
//   ];

//   return (
//     <nav className="flex items-center justify-center mb-8" aria-label="Progress">
//       <ol className="flex items-center w-full">
//         {steps.map((step, index) => (
//           <li 
//             key={step.number} 
//             className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''} ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'}`}
//           >
//             <div className="flex flex-col items-center">
//               <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.number ? 'bg-primary-100' : 'bg-gray-100'} border-2 ${currentStep >= step.number ? 'border-primary-600' : 'border-gray-300'}`}>
//                 {currentStep > step.number ? (
//                   <FiCheck className="w-5 h-5 text-primary-600" />
//                 ) : (
//                   <span className="font-medium">{step.number}</span>
//                 )}
//               </div>
//               <span className="mt-2 text-xs font-medium">{step.label}</span>
//             </div>
//             {index < steps.length - 1 && (
//               <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
//             )}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// };

// const handlePaymentSubmit = async (e) => {
//   e.preventDefault();
//   setShowPaymentModal(false);
//   await processPayment('card');
// };

// const renderPaymentModal = () => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h3 className="text-lg font-medium mb-4">Enter Card Details</h3>
//         <form onSubmit={handlePaymentSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
//               <input
//                 type="text"
//                 value={paymentDetails.cardNumber}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
//                 placeholder="1234 5678 9012 3456"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
//               <input
//                 type="text"
//                 value={paymentDetails.cardName}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, cardName: e.target.value})}
//                 placeholder="John Doe"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 required
//               />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                 <input
//                   type="text"
//                   value={paymentDetails.expiryDate}
//                   onChange={(e) => setPaymentDetails({...paymentDetails, expiryDate: e.target.value})}
//                   placeholder="MM/YY"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
//                 <input
//                   type="text"
//                   value={paymentDetails.cvv}
//                   onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value})}
//                   placeholder="123"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//             </div>
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="saveCard"
//                 checked={paymentDetails.saveCard}
//                 onChange={(e) => setPaymentDetails({...paymentDetails, saveCard: e.target.checked})}
//                 className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
//               />
//               <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
//                 Save card for future payments
//               </label>
//             </div>
//           </div>
//           <div className="mt-6 flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={() => setShowPaymentModal(false)}
//               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//             >
//               Confirm Payment
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const renderBookingDetails = () => (
//   <div className="space-y-4">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
//             Start Date
//           </label>
//           <input
//             type="date"
//             id="startDate"
//             name="startDate"
//             value={bookingData.startDate}
//             onChange={handleInputChange}
//             min={new Date().toISOString().split('T')[0]}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-700">
//             Pickup Time
//           </label>
//           <select
//             id="pickupTime"
//             value={pickupTime}
//             onChange={(e) => setPickupTime(e.target.value)}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//             required
//           >
//             {Array.from({length: 24}, (_, i) => {
//               const hour = i % 12 || 12;
//               const ampm = i < 12 ? 'AM' : 'PM';
//               const time = `${hour}:00 ${ampm}`;
//               return <option key={i} value={time}>{time}</option>;
//             })}
//           </select>
//         </div>
//       </div>
//       <div>
//         <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
//           End Date
//         </label>
//         <input
//           type="date"
//           id="endDate"
//           name="endDate"
//           value={bookingData.endDate}
//           onChange={handleInputChange}
//           min={bookingData.startDate || new Date().toISOString().split('T')[0]}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//           required
//         />
//       </div>
//     </div>
    
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div>
//         <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">
//           Pickup Location
//         </label>
//         <input
//           type="text"
//           id="pickupLocation"
//           name="pickupLocation"
//           value={bookingData.pickupLocation}
//           onChange={handleInputChange}
//           placeholder="Enter pickup location"
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//           required
//         />
//       </div>
//       <div>
//         <label htmlFor="dropoffLocation" className="block text-sm font-medium text-gray-700">
//           Drop-off Location
//         </label>
//         <input
//           type="text"
//           id="dropoffLocation"
//           name="dropoffLocation"
//           value={bookingData.dropoffLocation}
//           onChange={handleInputChange}
//           placeholder="Enter drop-off location"
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//           required
//         />
//       </div>
//     </div>
    
//     <div>
//       <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
//         Special Requests (Optional)
//       </label>
//       <textarea
//         id="notes"
//         name="notes"
//         rows="3"
//         value={bookingData.notes || ''}
//         onChange={handleInputChange}
//         className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//         placeholder="Any special requests or notes..."
//       ></textarea>
//     </div>
    
//     <div className="bg-gray-50 p-4 rounded-md">
//       <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Summary</h3>
//       <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
//         <div>Daily Rate:</div>
//         <div className="text-right">${car.dailyRate?.toFixed(2) || '0.00'}</div>
        
//         <div>Total Days:</div>
//         <div className="text-right">{calculateTotalDays() || '0'}</div>
        
//         <div className="font-medium">Total Amount:</div>
//         <div className="text-right font-medium text-gray-900">${calculateTotalPrice().toFixed(2)}</div>
//       </div>
//     </div>
//   </div>
// );

// const renderPaymentMethod = () => (
//   <div className="space-y-4">
//     <h3 className="text-lg font-medium text-gray-900">Select Payment Method</h3>
    
//     <div className="space-y-4">
//       <div 
//         className={`border rounded-md p-4 cursor-pointer ${bookingData.paymentMethod === 'stripe' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300'}`}
//         onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'stripe' }))}
//       >
//         <div className="flex items-center">
//           <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${bookingData.paymentMethod === 'stripe' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
//             {bookingData.paymentMethod === 'stripe' && (
//               <div className="h-full w-full rounded-full bg-primary-500 flex items-center justify-center">
//                 <div className="h-2 w-2 rounded-full bg-white"></div>
//               </div>
//             )}
//           </div>
//           <div className="ml-3">
//             <div className="flex items-center">
//               <FaCreditCard className="h-5 w-5 text-gray-500 mr-2" />
//               <span className="text-sm font-medium text-gray-900">Credit/Debit Card</span>
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Pay with Visa, Mastercard, or other cards</p>
//           </div>
//         </div>
//       </div>
      
//       <div 
//         className={`border rounded-md p-4 cursor-pointer ${bookingData.paymentMethod === 'momo' ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-300'}`}
//         onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: 'momo' }))}
//       >
//         <div className="flex items-center">
//           <div className={`flex-shrink-0 h-5 w-5 rounded-full border ${bookingData.paymentMethod === 'momo' ? 'border-primary-500 bg-primary-500' : 'border-gray-300'}`}>
//             {bookingData.paymentMethod === 'momo' && (
//               <div className="h-full w-full rounded-full bg-primary-500 flex items-center justify-center">
//                 <div className="h-2 w-2 rounded-full bg-white"></div>
//               </div>
//             )}
//           </div>
//           <div className="ml-3">
//             <div className="flex items-center">
//               <FaMobile className="h-5 w-5 text-purple-600 mr-2" />
//               <span className="text-sm font-medium text-gray-900">Mobile Money (MOMO)</span>
//             </div>
//             <p className="text-xs text-gray-500 mt-1">Pay with your mobile money account</p>
//           </div>
//         </div>
//       </div>
//     </div>
    
//     <div className="mt-6 bg-gray-50 p-4 rounded-md">
//       <h4 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
//       <div className="space-y-2 text-sm text-gray-600">
//         <div className="flex justify-between">
//           <span>Subtotal:</span>
//           <span>${(car.dailyRate * calculateTotalDays()).toFixed(2)}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Service Fee:</span>
//           <span>$5.00</span>
//         </div>
//         <div className="border-t border-gray-200 my-2"></div>
//         <div className="flex justify-between font-medium text-gray-900">
//           <span>Total:</span>
//           <span>${calculateTotalPrice().toFixed(2)}</span>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const renderPaymentConfirmation = () => (
//   <div className="text-center py-8">
//     <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
//       <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//       </svg>
//     </div>
//     <h3 className="mt-4 text-xl font-medium text-gray-900">Payment Successful!</h3>
//     <p className="mt-2 text-gray-600">Your booking has been confirmed.</p>
    
//     <div className="mt-8 bg-gray-50 p-6 rounded-lg text-left">
//       <h4 className="font-medium text-gray-900">Booking Details</h4>
//       <dl className="mt-4 space-y-2 text-sm">
//         <div className="flex justify-between">
//           <dt className="text-gray-600">Booking ID:</dt>
//           <dd className="font-medium">#{rentalId?.substring(0, 8).toUpperCase()}</dd>
//         </div>
//         <div className="flex justify-between">
//           <dt className="text-gray-600">Car:</dt>
//           <dd className="font-medium">{car.make} {car.model}</dd>
//         </div>
//         <div className="flex justify-between">
//           <dt className="text-gray-600">Pickup:</dt>
//           <dd className="font-medium">{new Date(bookingData.startDate).toLocaleDateString()}</dd>
//         </div>
//         <div className="flex justify-between">
//           <dt className="text-gray-600">Dropoff:</dt>
//           <dd className="font-medium">{new Date(bookingData.endDate).toLocaleDateString()}</dd>
//         </div>
//         <div className="flex justify-between pt-2 border-t border-gray-200">
//           <dt className="font-medium">Total Paid:</dt>
//           <dd className="font-bold text-lg">${calculateTotalPrice().toFixed(2)}</dd>
//         </div>
//       </dl>
//     </div>
    
//     <div className="mt-8">
//       <button
//         onClick={() => navigate('/renter/bookings')}
//         className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//       >
//         View My Bookings
//       </button>
//     </div>
//   </div>
// );



// export default BookingFlow;
