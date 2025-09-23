import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiSearch, FiStar, FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCarsQuery, useDeleteCarMutation } from '../store/features/cars/carsApiSlice';
import { setFilters, selectCarFilters } from '../store/features/cars/carsSlice';

/**
 * Cars component with Redux integration
 * 
 * This component demonstrates:
 * 1. Using RTK Query hooks to fetch data (useGetCarsQuery)
 * 2. Using Redux state for filters and search (selectCarFilters)
 * 3. Dispatching actions to update Redux state (setFilters)
 * 4. Syncing local component state with Redux state
 */
const Cars = () => {
  const dispatch = useDispatch();
  const reduxFilters = useSelector(selectCarFilters);
  
  // Local state for form controls
  const [searchTerm, setSearchTerm] = useState(reduxFilters.searchTerm || '');
  const [statusFilter, setStatusFilter] = useState(reduxFilters.status || '');
  
  // Use RTK Query hook to fetch cars with current filters
  const { 
    data: cars = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetCarsQuery(reduxFilters);
  
  // Show error toast if API request fails
  if (isError) {
    console.error('Error fetching cars:', error);
    toast.error('Failed to load cars. Please try again later.');
  }
  
  // Handle search term changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Update local state for controlled input
    setSearchTerm(value);
    // Update Redux state for filtering and persistence
    dispatch(setFilters({ searchTerm: value }));
  };
  
  // Handle status filter changes
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    // Update local state for controlled input
    setStatusFilter(value);
    // Update Redux state for filtering and persistence
    dispatch(setFilters({ status: value }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    dispatch(setFilters({ searchTerm: '', status: '' }));
  };
  
  // Filter cars based on search term and status filter
  // Note: We could rely entirely on the backend filtering via the API,
  // but adding client-side filtering gives a more responsive UI
  const filteredCars = Array.isArray(cars) ? cars.filter(car => {
    if (!car) return false;
    
    const searchTermLower = searchTerm.toLowerCase();
    const make = car.make ? car.make.toLowerCase() : '';
    const model = car.model ? car.model.toLowerCase() : '';
    const year = car.year ? car.year.toString() : '';
    
    const matchesSearch = 
      make.includes(searchTermLower) || 
      model.includes(searchTermLower) || 
      year.includes(searchTermLower);
    
    const matchesStatus = !statusFilter || car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  // Use RTK Query mutation hook for deleting cars
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();
  
  // Handle car deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        // Use the RTK Query mutation to delete the car
        await deleteCar(id).unwrap();
        toast.success('Car deleted successfully');
      } catch (err) {
        console.error('Failed to delete car:', err);
        toast.error('Failed to delete car. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-primary/75 py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Ride</h1>
          <p className="text-xl text-white mb-8">Choose from our wide selection of clean, reliable vehicles across Liberia</p>
          
          <div className="flex justify-center items-center space-x-12 mb-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-white opacity-80">Cars Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">15+</div>
              <div className="text-sm text-white opacity-80">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.8</div>
              <div className="text-sm text-white opacity-80">Average Rating</div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search by make or model..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            <div className="md:w-1/4">
              <select
                className="w-full py-3 px-4 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
              </select>
            </div>
            <div className="md:w-auto">
              <button
                onClick={handleClearFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-md text-sm font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cars...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-100 border border-primary/50 text-primary px-4 py-3 rounded mb-4">
            <p>{error?.data?.message || 'Failed to load cars. Please try again.'}</p>
            <button 
              className="mt-2 text-primary hover:underline"
              onClick={() => {
                // Refetch data using RTK Query's built-in refetch functionality
                refetch();
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !isError && (
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Found {filteredCars.length} vehicles available</p>
              {(searchTerm || statusFilter) && (
                <button 
                  onClick={handleClearFilters}
                  className="text-primary hover:text-primary/70 text-sm font-medium flex items-center"
                >
                  <span className="mr-1">Clear filters</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Cars Grid */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="relative">
                    <img 
                      src={car.imageUrl || `https://via.placeholder.com/400x240?text=${car.make}+${car.model}`} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-md">Available</span>
                    </div>
                    <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100">
                      <FiHeart className="text-gray-500" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-bold">{car.make} {car.model}</h3>
                      <div className="flex items-center">
                        <FiStar className="text-yellow-500 mr-1" />
                        <span className="text-sm">{car.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <div className="text-gray-500 text-sm mb-4">{car.year} • {car.location || 'Monrovia'}</div>
                    
                    <div className="flex items-center mb-4">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                            <FiMapPin className="text-gray-500" />
                          </div>
                          <span className="text-xs text-gray-500">{car.location || 'Monrovia'}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                            <FiCalendar className="text-gray-500" />
                          </div>
                          <span className="text-xs text-gray-500">{car.seats || 5} seats</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl font-bold text-primary">${car.rentalPricePerDay || car.dailyRate}/</span>
                        <span className="text-gray-500">day</span>
                      </div>
                      <Link 
                        to={`/cars/${car.id}`}
                        className="bg-primary hover:bg-primary/50 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-gray-50 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-5xl mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No cars found</h3>
                <p className="text-gray-500">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cars;
