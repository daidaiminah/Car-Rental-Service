import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetCarsQuery } from '../store/features/cars/carsApiSlice';
import { setFilters, clearFilters, selectCarFilters } from '../store/features/cars/carsSlice';

/**
 * Example component demonstrating Redux usage
 * This shows how to:
 * 1. Use RTK Query hooks to fetch data
 * 2. Access and update Redux state
 * 3. Handle loading and error states
 */
const ReduxExample = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectCarFilters);
  
  // Use the RTK Query hook to fetch cars with current filters
  const { data: cars, isLoading, isError, error, refetch } = useGetCarsQuery(filters);
  
  // Example of updating filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };
  
  // Example of clearing filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
  };
  
  // Example of using useEffect with Redux
  useEffect(() => {
    // You could dispatch actions here when component mounts
    console.log('Component mounted with filters:', filters);
    
    // Cleanup function
    return () => {
      console.log('Component unmounted');
    };
  }, [filters]);
  
  // Handle loading state
  if (isLoading) {
    return <div className="p-4">Loading cars...</div>;
  }
  
  // Handle error state
  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Error loading cars: {error?.data?.message || error?.error || 'Unknown error'}
        <button 
          className="ml-2 px-3 py-1 bg-primary text-white rounded" 
          onClick={refetch}
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Redux Example - Car Listing</h2>
      
      {/* Filter controls */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
            >
              <option value="">All Types</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Truck">Truck</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Transmission</label>
            <select 
              name="transmission" 
              value={filters.transmission} 
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
            >
              <option value="">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <input 
              type="text" 
              name="searchTerm" 
              value={filters.searchTerm} 
              onChange={handleFilterChange}
              placeholder="Search cars..."
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleClearFilters}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Clear Filters
          </button>
        </div>
      </div>
      
      {/* Car listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars && cars.length > 0 ? (
          cars.map(car => (
            <div key={car.id} className="border rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={car.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={car.make + ' ' + car.model} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{car.make} {car.model}</h3>
                <p className="text-gray-600">{car.year} • {car.transmission} • {car.type}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-primary font-bold">${car.dailyRate}/day</span>
                  <button className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No cars found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default ReduxExample;
