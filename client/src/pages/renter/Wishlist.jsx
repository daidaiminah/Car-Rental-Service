import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHeart,
  FiMapPin,
  FiStar,
  FiUsers,
  FiDroplet,
  FiNavigation,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from '../../store/features/wishlist/wishlistApiSlice';
import { useSocket } from '../../context/SocketContext.jsx';

const Wishlist = () => {
  const navigate = useNavigate();
  const socket = useSocket();

  const {
    data: wishlist = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetWishlistQuery();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  useEffect(() => {
    if (!socket) return undefined;

    const handleWishlistUpdate = () => {
      refetch();
    };

    socket.on('wishlist:updated', handleWishlistUpdate);
    return () => {
      socket.off('wishlist:updated', handleWishlistUpdate);
    };
  }, [socket, refetch]);

  const handleRemove = async (carId) => {   if (!carId) return;   try {
      await removeFromWishlist(carId).unwrap();
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleBookNow = (carId) => {   if (!carId) return;   navigate(`/cars/${carId}`);
  };

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Save your favorite cars to rent them later.
          </p>
          <Link
            to="/cars"
            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Browse Cars
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const car = item.car || {};
            const price = Number(car.rentalPricePerDay || 0).toFixed(2);
            const seats = car.seats || 'N/A';
            const fuel = car.fuelType || 'N/A';
            const transmission = car.transmission || 'N/A';
            const addedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : 'Unknown date';
            const rating = car.averageRating || 'N/A';
            const imageSource =
              car.imageUrl ||
              'https://via.placeholder.com/400x250?text=Car+Image';

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={imageSource}
                    alt={`${car.make || ''} ${car.model || ''}`}
                    className="w-full h-48 object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        'https://via.placeholder.com/400x250?text=Car+Image';
                    }}
                  />
                  <button
                    onClick={() => handleRemove(car.id)}
                    disabled={isRemoving || !car.id}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none disabled:opacity-60"
                    aria-label="Remove from wishlist"
                  >
                    <FiHeart className="text-red-500 fill-current" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    ${price}/day
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {car.year || ''} {car.make || ''} {car.model || ''}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FiMapPin className="mr-1" size={14} />
                        {car.location || 'Location not specified'}
                      </div>
                    </div>
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                      <FiStar className="text-yellow-400 mr-1" size={14} />
                      <span className="text-sm font-medium">
                        {rating || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <FiUsers className="mr-1" size={14} />
                      {seats} seats
                    </div>
                    <div className="flex items-center">
                      <FiDroplet className="mr-1" size={14} />
                      {fuel}
                    </div>
                    <div className="flex items-center">
                      <FiNavigation className="mr-1" size={14} />
                      {transmission}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Added on {addedDate}
                    </div>
                    <Link
                      to={`/cars/${car.id}`}
                      className="text-sm font-medium text-orange-500 hover:text-orange-600"
                    >
                      View Details
                    </Link>
                  </div>

                  <button
                    onClick={() => handleBookNow(car.id)}
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;



