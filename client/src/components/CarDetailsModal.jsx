// import React, { useState } from 'react';
// import { FiX, FiCalendar, FiClock, FiMapPin, FiUsers, FiDroplet, FiInfo, FiCheckCircle } from 'react-icons/fi';
// import { useAuth } from '../store/authContext';
// import LoginRequiredModal from './LoginRequiredModal';

// const CarDetailsModal = ({ isOpen, onClose, car, onBookNow }) => {
//   const [selectedStartDate, setSelectedStartDate] = useState('');
//   const [selectedEndDate, setSelectedEndDate] = useState('');
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [bookingStep, setBookingStep] = useState(1); // 1: Select dates, 2: Confirm booking
//   const { isAuthenticated } = useAuth();

//   if (!isOpen || !car) return null;

//   const handleProceed = async () => {
//     if (!isAuthenticated()) {
//       setShowLoginModal(true);
//       return;
//     }

//     if (bookingStep === 1) {
//       if (!selectedStartDate || !selectedEndDate) {
//         alert('Please select both start and end dates');
//         return;
//       }
//       setBookingStep(2);
//     } else if (bookingStep === 2) {
//       try {
//         await onBookNow(car.id, selectedStartDate, selectedEndDate);
//         onClose();
//       } catch (error) {
//         console.error('Booking failed:', error);
//       }
//     }
//   };

//   const calculateTotalPrice = () => {
//     if (!selectedStartDate || !selectedEndDate) return 0;
//     const start = new Date(selectedStartDate);
//     const end = new Date(selectedEndDate);
//     const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
//     return days * (car.rentalPricePerDay || car.pricePerDay || 0);
//   };

//   const totalPrice = calculateTotalPrice();

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-start mb-4">
//             <h2 className="text-2xl font-bold">{car.year} {car.make} {car.model}</h2>
//             <button 
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <FiX className="w-6 h-6" />
//             </button>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Car Image */}
//             <div className="h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
//               <img 
//                 src={car.image || 'https://via.placeholder.com/600x400?text=Car+Image'} 
//                 alt={`${car.make} ${car.model}`}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = 'https://via.placeholder.com/600x400?text=Car+Image';
//                 }}
//               />
//             </div>
            
//             {/* Car Details and Booking Form */}
//             <div>
//               {/* Car Details */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold mb-3">Car Details</h3>
//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div className="flex items-center">
//                     <FiUsers className="w-4 h-4 mr-2 text-gray-500" />
//                     <span>{car.seats || 5} Seats</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FiDroplet className="w-4 h-4 mr-2 text-gray-500" />
//                     <span>{car.fuelType || 'Petrol'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FiInfo className="w-4 h-4 mr-2 text-gray-500" />
//                     <span>{car.transmission || 'Automatic'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <FiMapPin className="w-4 h-4 mr-2 text-gray-500" />
//                     <span>{car.location || 'Nairobi, Kenya'}</span>
//                   </div>
//                 </div>
                
//                 <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                   <h4 className="font-medium mb-2">Description</h4>
//                   <p className="text-sm text-gray-600">
//                     {car.description || 'No description available for this vehicle.'}
//                   </p>
//                 </div>
//               </div>
              
//               {/* Booking Steps */}
//               <div className="border-t pt-4">
//                 <div className="flex justify-between mb-6">
//                   <div className={`flex-1 text-center ${bookingStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
//                     <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${bookingStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
//                       1
//                     </div>
//                     <span className="text-xs">Select Dates</span>
//                   </div>
//                   <div className="flex-1 text-center ${bookingStep >= 2 ? 'text-primary' : 'text-gray-400'}">
//                     <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-1 ${bookingStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
//                       2
//                     </div>
//                     <span className="text-xs">Confirm</span>
//                   </div>
//                 </div>
                
//                 {bookingStep === 1 ? (
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//                         <input
//                           type="date"
//                           value={selectedStartDate}
//                           onChange={(e) => setSelectedStartDate(e.target.value)}
//                           min={new Date().toISOString().split('T')[0]}
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//                         <input
//                           type="date"
//                           value={selectedEndDate}
//                           onChange={(e) => setSelectedEndDate(e.target.value)}
//                           min={selectedStartDate || new Date().toISOString().split('T')[0]}
//                           disabled={!selectedStartDate}
//                           className="w-full p-2 border rounded-md"
//                         />
//                       </div>
//                     </div>
                    
//                     {totalPrice > 0 && (
//                       <div className="p-3 bg-blue-50 rounded-md">
//                         <p className="text-sm text-gray-700">
//                           Estimated Total: <span className="font-semibold">${totalPrice.toFixed(2)}</span>
//                           {selectedStartDate && selectedEndDate && (
//                             <span className="block text-xs text-gray-500">
//                               ({car.rentalPricePerDay || car.pricePerDay || 0} × {Math.ceil((new Date(selectedEndDate) - new Date(selectedStartDate)) / (1000 * 60 * 60 * 24) + 1)} days)
//                             </span>
//                           )}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="p-4 bg-green-50 rounded-lg border border-green-100">
//                       <div className="flex items-center">
//                         <FiCheckCircle className="w-5 h-5 text-green-500 mr-2" />
//                         <h4 className="font-medium text-green-800">Booking Summary</h4>
//                       </div>
//                       <div className="mt-3 text-sm space-y-2">
//                         <p><span className="font-medium">Dates:</span> {new Date(selectedStartDate).toLocaleDateString()} - {new Date(selectedEndDate).toLocaleDateString()}</p>
//                         <p><span className="font-medium">Total Price:</span> ${totalPrice.toFixed(2)}</p>
//                         <p className="text-xs text-gray-500">Payment will be processed after you confirm the booking.</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="mt-6 flex justify-end space-x-3">
//                   {bookingStep === 2 && (
//                     <button
//                       onClick={() => setBookingStep(1)}
//                       className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
//                     >
//                       Back
//                     </button>
//                   )}
//                   <button
//                     onClick={handleProceed}
//                     className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
//                   >
//                     {bookingStep === 1 ? 'Continue' : 'Confirm Booking'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <LoginRequiredModal 
//         isOpen={showLoginModal} 
//         onClose={() => setShowLoginModal(false)} 
//       />
//     </div>
//   );
// };

// export default CarDetailsModal;
