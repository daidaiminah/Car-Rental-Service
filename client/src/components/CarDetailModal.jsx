import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiMapPin, FiCreditCard, FiClock, FiCheck, FiChevronLeft, FiChevronRight, FiStar, FiMessageSquare } from 'react-icons/fi';
import { FaCar, FaGasPump, FaCogs } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BookingFlow from './BookingFlow';

const CarDetailModal = ({ car, onClose, onBook }) => {
  // Sample images for carousel (in a real app, these would come from the car object)
  const carImages = [
    car.imageUrl || 'https://via.placeholder.com/800x500?text=No+Image',
    'https://via.placeholder.com/800x500?text=Image+2',
    'https://via.placeholder.com/800x500?text=Image+3',
    'https://via.placeholder.com/800x500?text=Image+4'
  ];
  
  // Sample reviews (in a real app, these would come from an API)
  const reviews = [
    {
      id: 1,
      user: 'Mary Johnson',
      date: '2024-01-10',
      rating: 5,
      comment: 'Excellent car! James was very professional and the car was exactly as described. Clean, comfortable, and perfect for my trip to Gbarnga.'
    },
    {
      id: 2,
      user: 'David Wilson',
      date: '2024-01-05',
      rating: 5,
      comment: 'Great experience! The car was in perfect condition and James was very responsive. Highly recommend for anyone needing a reliable ride in Monrovia.'
    }
  ];
  
  // Sample host data (in a real app, this would come from the car owner's profile)
  const host = {
    name: 'James Kollie',
    joinedYear: 2023,
    responseTime: '2 hours',
    rating: 4.8,
    tripsCompleted: 156,
    carsListed: 3
  };
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingFlow, setShowBookingFlow] = useState(false);

  const handleBookNow = () => {
    setShowBookingFlow(true);
  };
  
  const handleBookingComplete = (bookingData) => {
    setShowBookingFlow(false);
    if (onBook) {
      onBook(bookingData);
    }
    toast.success('Booking completed successfully!');
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carImages.length - 1 : prevIndex - 1
    );
  };
  
  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Render functions for different sections of the car detail modal
  const renderCarousel = () => {
    return (
      <div className="relative w-full h-96 bg-light-gray overflow-hidden rounded-lg mb-6">
        <img 
          src={car.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} 
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
    return (
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-dark">{car.year} {car.make} {car.model}</h1>
            <p className="text-secondary-light">{car.location}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">${car.rentalPricePerDay}<span className="text-sm font-normal text-secondary-light">/day</span></p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center">
            <FaCar className="text-primary mr-2" />
            <span className="text-secondary">{car.type || 'Sedan'}</span>
          </div>
          <div className="flex items-center">
            <FaCogs className="text-primary mr-2" />
            <span className="text-secondary">{car.transmission || 'Automatic'}</span>
          </div>
          <div className="flex items-center">
            <FaGasPump className="text-primary mr-2" />
            <span className="text-secondary">{car.fuelType || 'Gasoline'}</span>
          </div>
        </div>
        
        <div className="bg-light-gray p-4 rounded-lg mb-6 border-l-4 border-primary">
          <h3 className="font-medium mb-2 text-secondary-dark">About this car</h3>
          <p className="text-secondary">{car.description || 'This car is in excellent condition, well-maintained and perfect for your next trip around Monrovia or anywhere in Liberia.'}</p>
        </div>
      </div>
    );
  };
  
  const renderFeatures = () => {
    const features = [
      'Air Conditioning',
      'Bluetooth',
      'Backup Camera',
      'USB Charger',
      'GPS Navigation',
      'Child Seat Compatible'
    ];
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-secondary-dark">Features & Amenities</h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center p-2 rounded-md hover:bg-light-gray transition-colors duration-200">
              <div className="w-6 h-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                <FiCheck className="text-primary" />
              </div>
              <span className="text-secondary">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderHostInfo = () => {
    return (
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Meet Your Host</h3>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 mr-4"></div>
          <div>
            <h4 className="font-medium">{host.name}</h4>
            <p className="text-gray-600">Joined {host.joinedYear}</p>
            <div className="flex items-center">
              <FiStar className="text-yellow-500 mr-1" />
              <span>{host.rating} · {host.tripsCompleted} trips</span>
            </div>
          </div>
        </div>
        <p className="text-gray-700">Response time: {host.responseTime}</p>
      </div>
    );
  };
  
  const renderReviews = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Reviews</h3>
          <div className="flex items-center">
            <FiStar className="text-yellow-500 mr-1" />
            <span className="font-medium">{host.rating}</span>
            <span className="mx-1">·</span>
            <span>{reviews.length} reviews</span>
          </div>
        </div>
        
        {reviews.map((review) => (
          <div key={review.id} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
              <div>
                <h4 className="font-medium">{review.user}</h4>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            <div className="flex mb-2">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={i < review.rating ? "text-yellow-500" : "text-gray-300"} 
                />
              ))}
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
    );
  };
  
  const renderBookingSection = () => {
    return (
      <div className="sticky top-4 bg-light p-6 rounded-lg shadow-lg border border-light-dark">
        <div className="mb-4">
          <p className="text-2xl font-bold mb-1 text-primary">${car.rentalPricePerDay}<span className="text-sm font-normal text-secondary-light">/day</span></p>
          <div className="flex items-center">
            <FiStar className="text-primary mr-1" />
            <span className="text-secondary">{host.rating}</span>
            <span className="mx-1 text-secondary-light">·</span>
            <span className="text-secondary-light">{reviews.length} reviews</span>
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
            <span>${car.rentalPricePerDay} x 3 days</span>
            <span>${car.rentalPricePerDay * 3}</span>
          </div>
          <div className="flex justify-between mb-2 text-secondary">
            <span>Service fee</span>
            <span>${Math.round(car.rentalPricePerDay * 0.1 * 3)}</span>
          </div>
          <div className="flex justify-between font-bold pt-4 border-t border-light-dark mt-4 text-secondary-dark">
            <span>Total</span>
            <span>${Math.round(car.rentalPricePerDay * 3 + car.rentalPricePerDay * 0.1 * 3)}</span>
          </div>
        </div>
      </div>
    );
  };

  const validateForm = () => {
    if (!bookingData.pickupAddress) {
      toast.error('Please enter a pickup address');
      return false;
    }
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
    
    if (start >= end) {
      toast.error('End date must be after start date');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Add total days and price to booking data
      const bookingDetails = {
        ...bookingData,
        carId: car.id,
        totalDays: calculateTotalDays(),
        totalAmount: calculateTotalPrice()
      };
      
      await onBook(bookingDetails);
      toast.success('Booking successful!');
      onClose();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to complete booking');
    } finally {
      setIsSubmitting(false);
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
                  {renderFeatures()}
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
