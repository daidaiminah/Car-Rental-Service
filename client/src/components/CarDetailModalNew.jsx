import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FiX, FiCalendar, FiMapPin, FiCreditCard, FiClock, 
  FiCheck, FiChevronLeft, FiChevronRight, FiStar, 
  FiMessageSquare, FiUser 
} from 'react-icons/fi';
import { FaCar, FaGasPump, FaCogs } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BookingFlow from './BookingFlow';
import { selectCurrentUser } from "../store/features/auth/authSlice";
import { ReviewList, ReviewForm } from './reviews';
import useCarReviews from '../hooks/useCarReviews';

const CarDetailModal = ({ car, onClose, onBook }) => {
  // Sample images for carousel
  const carImages = [
    car.imageUrl || 'https://via.placeholder.com/800x500?text=No+Image',
    'https://via.placeholder.com/800x500?text=Image+2',
    'https://via.placeholder.com/800x500?text=Image+3',
    'https://via.placeholder.com/800x500?text=Image+4'
  ];
  
  // Fetch reviews for this car
  const { 
    reviews, 
    averageRating, 
    totalReviews, 
    isLoading: isLoadingReviews, 
    error: reviewsError,
    addReview 
  } = useCarReviews(car?.id);
  
  // Host data from the car owner
  const host = car?.owner || {
    name: car?.ownerName || 'Car Owner',
    profileImage: car?.ownerImage,
    joinedYear: new Date(car?.ownerCreatedAt)?.getFullYear() || new Date().getFullYear(),
    responseTime: '2 hours',
    rating: averageRating,
    tripsCompleted: car?.tripsCompleted || 0,
    carsListed: car?.carsListed || 1
  };
  
  const user = useSelector(selectCurrentUser);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [completedRentalId, setCompletedRentalId] = useState(null);

  const handleBookNow = () => {
    setShowBookingFlow(true);
  };
  
  const handleBookingSuccess = (rental) => {
    toast.success('Booking confirmed! Check your email for details.');
    setShowBookingFlow(false);
    setCompletedRentalId(rental.id);
  };
  
  const handleReviewSubmitted = (newReview) => {
    addReview(newReview);
    setActiveTab('reviews');
  };
  
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % carImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + carImages.length) % carImages.length);
  };

  if (!car) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal Content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute right-0 top-0 pr-4 pt-4">
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`${
                    activeTab === 'details' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`${
                    activeTab === 'reviews' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Reviews {totalReviews > 0 && `(${totalReviews})`}
                </button>
                <button
                  onClick={() => setActiveTab('host')}
                  className={`${
                    activeTab === 'host' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Host
                </button>
              </nav>
            </div>

            <div className="mt-4">
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column - Car Images */}
                  <div>
                    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={carImages[currentImageIndex]} 
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {carImages.length > 1 && (
                        <>
                          <button 
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                          >
                            <FiChevronLeft size={24} />
                          </button>
                          <button 
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                          >
                            <FiChevronRight size={24} />
                          </button>
                          
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                            {carImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                                }`}
                                aria-label={`View image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Car Info */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {car.year} {car.make} {car.model}
                    </h2>
                    
                    <div className="flex items-center text-gray-600 mt-2">
                      <FiMapPin className="mr-1" />
                      <span>{car.location || 'Location not specified'}</span>
                      <span className="mx-2">•</span>
                      <div className="flex items-center">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span>
                          {averageRating > 0 
                            ? `${averageRating.toFixed(1)} (${totalReviews} ${totalReviews === 1 ? 'review' : 'reviews'})` 
                            : 'No reviews yet'}
                        </span>
                      </div>
                    </div>

                    {/* Car Features */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center">
                        <FaCar className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{car.type || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaGasPump className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{car.fuelType || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <FaCogs className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{car.transmission || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUser className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">{car.seats || 'N/A'} Seats</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-2">About this car</h3>
                      <p className="text-gray-600">
                        {car.description || 'No description provided for this vehicle.'}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium text-gray-900">
                          ${typeof car.rentalPricePerDay === 'number' ? car.rentalPricePerDay.toFixed(2) : '0.00'} <span className="text-sm font-normal text-gray-600">/ day</span>
                        </span>
                      </div>
                      
                      <button
                        onClick={handleBookNow}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="py-4">
                  {isLoadingReviews ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : reviewsError ? (
                    <div className="text-red-500 text-center py-4">
                      Error loading reviews: {reviewsError}
                    </div>
                  ) : (
                    <>
                      <ReviewList 
                        reviews={reviews} 
                        averageRating={averageRating} 
                        totalReviews={totalReviews} 
                      />
                      
                      {user && completedRentalId && !reviews.some(r => r.userId === user.id) && (
                        <div className="mt-8">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h3>
                          <ReviewForm 
                            carId={car.id} 
                            rentalId={completedRentalId} 
                            onReviewSubmitted={handleReviewSubmitted} 
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'host' && (
                <div className="py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {host.profileImage ? (
                        <img
                          className="h-16 w-16 rounded-full object-cover"
                          src={host.profileImage}
                          alt={host.name}
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-500">
                          {host.name ? host.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Hosted by {host.name}</h3>
                      <p className="text-sm text-gray-500">
                        Joined in {host.joinedYear}
                        <span className="mx-2">•</span>
                        {host.responseTime} average response time
                      </p>
                      
                      <div className="mt-2 flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className={`${
                                star <= Math.round(host.rating || 0) 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300'
                              } h-5 w-5`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {host.rating?.toFixed(1) || 'No'} rating
                          {host.tripsCompleted ? ` • ${host.tripsCompleted} trips` : ''}
                        </span>
                      </div>
                      
                      {host.carsListed > 0 && (
                        <p className="mt-2 text-sm text-gray-600">
                          {host.carsListed} {host.carsListed === 1 ? 'car' : 'cars'} listed
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-sm font-medium text-gray-900">About the host</h4>
                    <p className="mt-2 text-sm text-gray-600">
                      {host.bio || `${host.name} has been hosting on our platform since ${host.joinedYear} and is committed to providing great service to all guests.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {showBookingFlow && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Book {car.make} {car.model}</h3>
                  <button onClick={() => setShowBookingFlow(false)}>
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <BookingFlow car={car} onSuccess={handleBookingSuccess} onCancel={() => setShowBookingFlow(false)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailModal;
