import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiMapPin, FiStar, FiCalendar, FiUsers, FiDroplet, FiNavigation } from 'react-icons/fi';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchWishlist = async () => {
      // Simulate API call
      setTimeout(() => {
        setWishlist([
          {
            id: 1,
            car: {
              id: 101,
              make: 'Toyota',
              model: 'Camry',
              year: 2022,
              price: 75,
              rating: 4.8,
              trips: 24,
              image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              location: 'Downtown',
              transmission: 'Automatic',
              seats: 5,
              type: 'Sedan',
              fuel: 'Gasoline'
            },
            addedDate: '2023-05-15'
          },
          {
            id: 2,
            car: {
              id: 102,
              make: 'Honda',
              model: 'CR-V',
              year: 2021,
              price: 85,
              rating: 4.9,
              trips: 18,
              image: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              location: 'Uptown',
              transmission: 'Automatic',
              seats: 5,
              type: 'SUV',
              fuel: 'Hybrid'
            },
            addedDate: '2023-06-02'
          },
          {
            id: 3,
            car: {
              id: 103,
              make: 'Tesla',
              model: 'Model 3',
              year: 2023,
              price: 120,
              rating: 4.95,
              trips: 32,
              image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              location: 'Tech District',
              transmission: 'Automatic',
              seats: 5,
              type: 'Electric',
              fuel: 'Electric'
            },
            addedDate: '2023-06-10'
          }
        ]);
        setIsLoading(false);
      }, 800);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
    // In a real app, you would call an API to update the wishlist
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Your Wishlist</h1>
        <div className="text-sm text-gray-500">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiHeart className="text-gray-400 text-2xl" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favorite cars to rent them later</p>
          <Link 
            to="/cars" 
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={item.car.image} 
                  alt={`${item.car.make} ${item.car.model}`}
                  className="w-full h-48 object-cover"
                />
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                  aria-label="Remove from wishlist"
                >
                  <FiHeart className="text-red-500 fill-current" />
                </button>
                <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  ${item.car.price}/day
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.car.year} {item.car.make} {item.car.model}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <FiMapPin className="mr-1" size={14} />
                      {item.car.location}
                    </div>
                  </div>
                  <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                    <FiStar className="text-yellow-400 mr-1" size={14} />
                    <span className="text-sm font-medium">{item.car.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <FiUsers className="mr-1" size={14} />
                    {item.car.seats} seats
                  </div>
                  <div className="flex items-center">
                    <FiDroplet className="mr-1" size={14} />
                    {item.car.fuel}
                  </div>
                  <div className="flex items-center">
                    <FiNavigation className="mr-1" size={14} />
                    {item.car.transmission}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Added on {new Date(item.addedDate).toLocaleDateString()}
                  </div>
                  <Link 
                    to={`/cars/${item.car.id}`}
                    className="text-sm font-medium text-orange-500 hover:text-orange-600"
                  >
                    View Details
                  </Link>
                </div>

                <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {wishlist.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
