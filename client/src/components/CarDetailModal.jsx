import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiX, FiMapPin, FiUsers, FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { FaCar, FaGasPump, FaCogs } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BookingFlow from './BookingFlow';
import { selectCurrentUser } from "../store/features/auth/authSlice";
import ReviewList from './reviews/ReviewList';
import ReviewForm from './reviews/ReviewForm';
import useCarReviews from '../hooks/useCarReviews';
import { useGetRentalsByRenterIdQuery } from '../store/features/rentals/rentalsApiSlice';

const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(value));
};

const CarDetailModal = ({ car, onClose, onBook }) => {
  // Car images for the carousel
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
    refreshReviews
  } = useCarReviews(car?.id);
  
    // Host data from the car owner
  const displayAverageRating = Number.isFinite(averageRating) ? averageRating : 0;
  const user = useSelector(selectCurrentUser);
  const { data: renterRentalsResponse } = useGetRentalsByRenterIdQuery(user?.id, {
    skip: !user?.id,
  });
  const renterRentals = useMemo(() => {
    const raw = renterRentalsResponse?.data ?? renterRentalsResponse ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [renterRentalsResponse]);
  const hasUserReview = useMemo(() => {
    if (!user?.id) return false;
    return reviews.some((review) => review.user?.id === user.id);
  }, [user?.id, reviews]);
  const handleReviewSubmitted = () => {
    refreshReviews();
  };
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [completedRentalId, setCompletedRentalId] = useState(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? carImages.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (!user?.id || !car?.id) return;
    const completedRental = renterRentals.find(
      (rental) => rental.carId === car.id && rental.status === 'completed'
    );
    if (completedRental) {
      setCompletedRentalId(completedRental.id);
    }
  }, [user?.id, car?.id, renterRentals]);
  const handleBookNow = () => {
    setShowBookingFlow(true);
  };
  
  // Render functions for different sections of the car detail modal
  const renderCarousel = () => {
    return (
      <div className="relative w-full h-96 bg-light-gray overflow-hidden rounded-lg mb-6">
        <img 
          src={carImages[currentImageIndex]} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-light p-2 rounded-full shadow-md hover:bg-light-dark transition-colors duration-200"
          aria-label="Previous image"
        >
          <FiChevronLeft size={24} className="text-secondary" />
        </button>
        
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-light p-2 rounded-full shadow-md hover:bg-light-dark transition-colors duration-200"
          aria-label="Next image"
        >
          <FiChevronRight size={24} className="text-secondary" />
        </button>
        
        {/* Image indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {carImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${currentImageIndex === index ? 'bg-primary' : 'bg-light bg-opacity-70 hover:bg-light-dark'}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };
  
  const renderCarInfo = () => {
    const dailyRateDisplay = formatCurrency(car.rentalPricePerDay ?? car.pricePerDay);
    return (
      <div className="mb-8">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-dark">
              {car.year ? `${car.year} ` : ''}{car.make} {car.model}
            </h1>
            {car.location && (
              <p className="mt-1 flex items-center text-secondary-light">
                <FiMapPin className="mr-2" /> {car.location}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm uppercase text-secondary-light">Daily rate</p>
            <p className="text-3xl font-bold text-primary">{dailyRateDisplay}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center text-secondary">
            <FaCar className="mr-2 text-primary" /> {car.type || 'N/A'}
          </div>
          <div className="flex items-center text-secondary">
            <FaCogs className="mr-2 text-primary" /> {car.transmission || 'N/A'}
          </div>
          <div className="flex items-center text-secondary">
            <FaGasPump className="mr-2 text-primary" /> {car.fuelType || 'N/A'}
          </div>
          <div className="flex items-center text-secondary">
            <FiUsers className="mr-2 text-primary" /> {car.seats || 'N/A'} seats
          </div>
        </div>

        {car.description && (
          <div className="rounded-lg border-l-4 border-primary bg-light-gray p-4">
            <h3 className="mb-2 font-medium text-secondary-dark">About this car</h3>
            <p className="text-secondary">{car.description}</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderHostInfo = () => {
    if (!car.owner && !car.ownerId) {
      return null;
    }

    return (
      <div className="mb-8 rounded-lg bg-gray-50 p-4">
        <h3 className="text-xl font-bold mb-3">Listing owner</h3>
        <p className="text-gray-800">{car.owner || 'Vehicle owner'}</p>
        {car.ownerId && (
          <p className="mt-1 text-sm text-gray-500">Owner ID: {car.ownerId}</p>
        )}
        {totalReviews > 0 && (
          <p className="mt-3 text-sm text-gray-600">
            Rated {displayAverageRating.toFixed(1)} / 5 by renters ({totalReviews}{' '}
            review{totalReviews === 1 ? '' : 's'})
          </p>
        )}
        <p className="mt-4 text-sm text-gray-600">
          Contact support if you need to reach the owner directly or have questions about this listing.
        </p>
      </div>
    );
  };
  
  const renderReviews = () => {
    return (
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Reviews</h3>
          <div className="flex items-center text-sm text-gray-500">
            <FiStar className="mr-1 text-yellow-500" />
            <span>{displayAverageRating.toFixed(1)}</span>
            <span className="mx-2">|</span>
            <span>{totalReviews} review{totalReviews === 1 ? '' : 's'}</span>
          </div>
        </div>
        {isLoadingReviews ? (
          <p className="text-sm text-gray-500">Loading reviews...</p>
        ) : reviewsError ? (
          <p className="text-sm text-red-500">Failed to load reviews.</p>
        ) : (
          <ReviewList
            reviews={reviews}
            averageRating={displayAverageRating}
            totalReviews={totalReviews}
          />
        )}
        {user ? (
          hasUserReview ? (
            <p className="mt-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
              You have already submitted a review for this car. Thank you!
            </p>
          ) : completedRentalId ? (
            <ReviewForm
              carId={car.id}
              rentalId={completedRentalId}
              onReviewSubmitted={handleReviewSubmitted}
            />
          ) : (
            <p className="mt-4 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Complete a rental for this car to leave a review.
            </p>
          )
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            Sign in to share your experience with this car.
          </p>
        )}
      </div>
    );
  };
  
  const renderBookingSection = () => {
    const dailyRate = Number(car.rentalPricePerDay) || 0;
    const threeDayTotal = dailyRate * 3;
    const serviceFee = Math.round(dailyRate * 0.1 * 3);
    const estimatedTotal = Math.round(threeDayTotal + serviceFee);

    return (
      <div className="sticky top-4 bg-light p-6 rounded-lg shadow-lg border border-light-dark">
        <div className="mb-4">
          <p className="text-2xl font-bold mb-1 text-primary">            <span className="text-sm font-normal text-secondary-light">/day</span>
          </p>
          <div className="flex items-center">
            <FiStar className="text-primary mr-1" />
            <span className="text-secondary">{displayAverageRating.toFixed(1)}</span>
            <span className="mx-1 text-secondary-light">|</span>
            <span className="text-secondary-light">{totalReviews} reviews</span>
          </div>
        </div>
        
        <button
          onClick={handleBookNow}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-light font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-200"
        >
          Book This Car Now
        </button>
        
        <div className="mt-4 text-center text-sm text-secondary-light">
          <p>You won't be charged yet</p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-light-dark">
          <div className="flex justify-between mb-2 text-secondary">
            <span>${dailyRate.toFixed(2)} × 3 days</span>
            <span>${threeDayTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-secondary">
            <span>Service fee</span>
            <span>${serviceFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold pt-4 border-t border-light-dark mt-4 text-secondary-dark">
            <span>Total</span>
            <span>${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  const handleBookingComplete = async (bookingDetails) => {
    try {
      await onBook(bookingDetails);
      toast.success('Booking successful!');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to complete booking');
    }
  };



  return (
    <>
      {showBookingFlow ? (
        <BookingFlow 
          car={car} 
          onClose={onClose} 
          onComplete={handleBookingComplete} 
        />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-6xl mx-auto my-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column - Car details */}
                <div className="lg:col-span-2">
                  {renderCarousel()}
                  {renderCarInfo()}
                  {renderHostInfo()}
                  {renderReviews()}
                </div>
                
                {/* Right column - Booking section */}
                <div className="lg:col-span-1">
                  {renderBookingSection()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarDetailModal;

