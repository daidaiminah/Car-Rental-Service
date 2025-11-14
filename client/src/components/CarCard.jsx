import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiUsers, FiDroplet } from 'react-icons/fi';

const normalizeFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.map((feature) => String(feature).trim()).filter(Boolean);
  }
  if (typeof features === 'string') {
    return features
      .split(',')
      .map((feature) => feature.trim())
      .filter(Boolean);
  }
  return [];
};

const CarCard = ({ car }) => {
  const isAvailable = car.isAvailable !== false;
  const featureBadges = normalizeFeatures(car.features).slice(0, 3);

  return (
    <div className="bg-white rounded-xl overflow-hidden duration-300">
      <div className="relative">
        <img 
          src={car.imageUrl || car.image || 'https://via.placeholder.com/300x200?text=Car+Image'} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Car+Image';
          }}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          <div className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${isAvailable ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
            {isAvailable ? 'Available' : 'Unavailable'}
          </div>
          <div className="bg-white/90 rounded-full p-1.5">
            <button className="text-gray-500 hover:text-yellow-500" type="button">
              <FiStar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{car.year} {car.make} {car.model}</h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <FiMapPin className="w-4 h-4 mr-1" />
              <span>{car.location || 'Nairobi, Kenya'}</span>
            </div>
            
            {/* Rating and Review Count */}
            {(car.averageRating || car.reviewCount) && (
              <div className="flex items-center mt-1">
                <div className="flex items-center text-yellow-400">
                  <FiStar className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-700">
                    {car.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                {car.reviewCount > 0 && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({car.reviewCount} {car.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="text-right">
            <span className="font-bold text-lg">${car.rentalPricePerDay ? `${car.rentalPricePerDay}` : '--'}</span>
            <span className="text-gray-500 text-sm block">per day</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-1 text-gray-400" />
            <span>{car.seats || 5} seats</span>
          </div>
          <div className="flex items-center">
            <FiDroplet className="w-4 h-4 mr-1 text-gray-400" />
            <span>{car.transmission || 'Automatic'}</span>
          </div>
          <div className="flex items-center">
            <FiDroplet className="w-4 h-4 mr-1 text-gray-400" />
            <span>{car.fuelType || 'Petrol'}</span>
          </div>
        </div>

        {featureBadges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {featureBadges.map((feature) => (
              <span
                key={feature}
                className="text-xs rounded-full bg-gray-100 px-3 py-1 text-gray-600"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <Link
          to={`/cars/${car.id}`}
          className={`mt-4 block w-full text-center py-2 px-4 rounded-lg font-medium transition-colors ${isAvailable ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          aria-disabled={!isAvailable}
        >
          {isAvailable ? 'Book Now' : 'Not Available'}
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
