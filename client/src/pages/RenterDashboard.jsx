import React, { useState } from "react";
import { Link } from "react-router-dom";
import Title from '../components/Title';
import { useSelector } from "react-redux";
import { FiSearch, FiArrowUpRight, FiClock, FiCalendar, FiFilter } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import CarCard from "../components/CarCard";
import CarDetailModal from "../components/CarDetailModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { selectCurrentUser } from "../store/features/auth/authSlice";
import { 
  useGetCarsQuery
} from "../store/features/cars/carsApiSlice";
import { 
  useGetRentalsByRenterIdQuery,
  useCreateRentalMutation 
} from "../store/features/rentals/rentalsApiSlice";

// StatCard component for displaying statistics with icons and trends
const StatCard = ({ title, value, icon: Icon, color, loading = false }) => {
  const colorMap = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  };

  const colorClasses = colorMap[color] || colorMap.blue;

  return (
    <article 
      className="bg-white rounded-lg shadow p-6 flex items-center justify-between"
      aria-labelledby={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div>
        <h2 id={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`} className="sr-only">{title}</h2>
        <p className="text-gray-700 text-sm font-medium" aria-hidden="true">{title}</p>
        <div className="text-2xl font-bold mt-1" aria-live="polite">
          {loading ? (
            <span className="sr-only">Loading {title.toLowerCase()}</span>
          ) : (
            <span>{value}</span>
          )}
        </div>
      </div>
      <div className={`p-3 rounded-full ${colorClasses.bg}`} aria-hidden="true">
        <Icon className={`h-6 w-6 ${colorClasses.text}`} />
      </div>
    </article>
  );
};

const RenterDashboard = () => {
  const user = useSelector(selectCurrentUser);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    status: 'available'
  });
  const [activeFilters, setActiveFilters] = useState({
    status: 'available'
  });

  // RTK Query hooks
  const { 
    data: carsResponse = {},
    isLoading: carsLoading,
    isError: carsError,
    error: carsErrorData
  } = useGetCarsQuery(activeFilters);
  
  // Extract cars from the response, handling both direct array and nested data property
  const cars = Array.isArray(carsResponse) 
    ? carsResponse 
    : Array.isArray(carsResponse?.data) 
      ? carsResponse.data 
      : [];

  const { 
    data: rentalsResponse = {},
    isLoading: rentalsLoading,
    isError: rentalsError,
    error: rentalsErrorData
  } = useGetRentalsByRenterIdQuery(user?.id, {
    skip: !user?.id
  });
  
  // Extract rentals from the response, handling both direct array and nested data property
  const rentals = Array.isArray(rentalsResponse) 
    ? rentalsResponse 
    : Array.isArray(rentalsResponse?.data) 
      ? rentalsResponse.data 
      : [];

  const [createRental, { isLoading: isCreatingRental }] = useCreateRentalMutation();

  // Show errors in console
  if (carsError) {
    console.error('Error fetching cars:', carsErrorData);
    toast.error('Failed to load cars data');
  }
  
  if (rentalsError) {
    console.error('Error fetching rentals:', rentalsErrorData);
    toast.error('Failed to load rental history');
  }

  // Calculate stats
  const activeRentals = rentals.filter(rental => rental.status === 'active').length;
  const pastRentals = rentals.filter(rental => rental.status === 'completed').length;
  const savedCars = 0; // Placeholder for now

  // Determine if any data is still loading
  const loading = carsLoading || rentalsLoading;

  const handleBookCar = async (bookingData) => {
    try {
      // Add user ID to booking data
      const rentalData = {
        ...bookingData,
        userId: user.id,
        status: 'active',
        paymentDate: new Date().toISOString()
      };
      
      // Create rental using RTK Query mutation
      await createRental(rentalData).unwrap();
      
      return true;
    } catch (error) {
      console.error('Error booking car:', error);
      throw new Error('Failed to book car. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    // Update active filters to trigger RTK Query refetch
    setActiveFilters({
      ...filters,
      // Ensure we always include the status filter
      status: filters.status || 'available'
    });
  };

  const openCarDetails = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Title title="Customer Dashboard" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Renter Dashboard</h1>
          <p className="text-gray-700">Welcome back, {user?.name || 'Renter'}!</p>
        </header>
        <div className="w-full md:w-auto">
          <label htmlFor="search-cars" className="sr-only">Search cars</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              id="search-cars"
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by make, model, or type"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              aria-label="Search cars by make, model, or type"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Active Rentals"
          value={activeRentals}
          icon={FiCalendar}
          color="green"
          loading={loading}
        />
        <StatCard
          title="Past Rentals"
          value={pastRentals}
          icon={FiClock}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Saved Cars"
          value={savedCars}
          icon={FaCar}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <section aria-labelledby="filter-heading" className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center mb-4">
          <FiFilter className="h-5 w-5 text-gray-500 mr-2" aria-hidden="true" />
          <h2 id="filter-heading" className="text-lg font-medium text-gray-900">Filter Cars</h2>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="car-type" className="block text-sm font-medium text-gray-700 mb-1">
                Car Type
              </label>
              <select
                id="car-type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                aria-label="Select car type"
              >
                <option value="">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="luxury">Luxury</option>
                <option value="economy">Economy</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 mb-1">
                Min Price ($)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="minPrice"
                  id="min-price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="0"
                  min="0"
                  className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  aria-label="Minimum price in dollars"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price ($)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="maxPrice"
                  id="max-price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="1000"
                  min="0"
                  className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  aria-label="Maximum price in dollars"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                aria-label="Apply filters"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Available Cars */}
      <section aria-labelledby="available-cars-heading" className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 id="available-cars-heading" className="text-2xl font-bold text-gray-900">Available Cars</h2>
          <Link 
            to="/renter/browse" 
            className="inline-flex items-center text-primary hover:text-primary-dark hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
            aria-label="View all available cars"
          >
            View All <FiArrowUpRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-live="polite" aria-label="Loading cars">
            {[1, 2, 3].map((i) => (
              <article 
                key={i} 
                className="bg-white rounded-lg shadow-md p-4 h-80 animate-pulse"
                aria-hidden="true"
              >
                <div className="bg-gray-200 h-40 rounded-md mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              </article>
            ))}
            <span className="sr-only">Loading available cars...</span>
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="List of available cars">
            {cars.slice(0, 6).map((car) => (
              <article 
                key={car.id} 
                onClick={() => {
                  setSelectedCar(car);
                  setShowModal(true);
                }} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedCar(car);
                    setShowModal(true);
                  }
                }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                role="article"
                tabIndex={0}
                aria-label={`View details for ${car.make} ${car.model}`}
              >
                <CarCard car={car} />
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FaCar className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-medium text-gray-900">No cars available</h3>
            <p className="mt-1 text-gray-500">Check back later for new listings.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Recent Rentals */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Recent Rentals</h2>
        
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="bg-gray-200 h-16 rounded-md mb-4"></div>
            <div className="bg-gray-200 h-16 rounded-md"></div>
          </div>
        ) : rentals.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rentals.map((rental) => {
                  const carImage = rental.car?.image || 'https://via.placeholder.com/40x40';
                  const carInfo = rental.car 
                    ? `${rental.car.year || ''} ${rental.car.make || ''} ${rental.car.model || ''}`.trim() 
                    : 'Car information not available';
                  
                  return (
                  <tr key={rental.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full object-cover" src={carImage} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{carInfo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${rental.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {rental.status === 'active' ? 'Active' : 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${rental.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/rentals/${rental.id}`} className="text-primary hover:text-primary-dark">View Details</Link>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No rental history</h3>
            <p className="mt-1 text-sm text-gray-500">Book a car to see your rental history here.</p>
          </div>
        )}
      </div>

      {/* Car Detail Modal */}
      {showModal && selectedCar && (
        <CarDetailModal 
          car={selectedCar} 
          isOpen={showModal} 
          onClose={closeModal}
          onBook={handleBookCar}
        />
      )}
    </div>
  );
};

export default RenterDashboard;
