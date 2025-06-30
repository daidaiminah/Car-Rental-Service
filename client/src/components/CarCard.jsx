import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiUsers, FiDroplet } from 'react-icons/fi';


const CarCard = ({ car }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img 
          src={car.images?.[0] || 'https://via.placeholder.com/300x200?text=Car+Image'} 
          alt={car.make + ' ' + car.model}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5">
          <button className="text-gray-500 hover:text-yellow-500">
            <FiStar className="w-5 h-5" />
          </button>
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
          </div>
          <div className="text-right">
            <span className="font-bold text-lg">${car.pricePerDay || '--'}</span>
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

        <Link 
          to={`/cars/${car.id}`}
          className="mt-4 block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
