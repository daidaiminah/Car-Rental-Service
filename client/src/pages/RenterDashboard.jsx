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
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{loading ? '...' : value}</h3>
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
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
    data: cars = [], 
    isLoading: carsLoading,
    isError: carsError,
    error: carsErrorData
  } = useGetCarsQuery(activeFilters);

  const { 
    data: rentals = [],
    isLoading: rentalsLoading,
    isError: rentalsError,
    error: rentalsErrorData
  } = useGetRentalsByRenterIdQuery(user?.id, {
    skip: !user?.id
  });

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Title title="Customer Dashboard" />
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Renter Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Renter'}!</p>
        </div>
        <div className="relative">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search cars..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
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
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center mb-2">
          <FiFilter className="mr-2 text-gray-500" />
          <h3 className="font-medium">Filter Cars</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="$"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="$"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Available Cars */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Available Cars</h2>
          <Link to="/renter/browse" className="text-primary flex items-center hover:underline">
            View All <FiArrowUpRight className="ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 h-64 animate-pulse">
                <div className="bg-gray-200 h-32 rounded-md mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cars.slice(0, 6).map((car) => (
              <div key={car.id} onClick={() => {
                setSelectedCar(car);
                setShowModal(true);
              }} className="cursor-pointer">
                <CarCard car={car} />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <FaCar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cars available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new listings.</p>
          </div>
        )}
      </div>

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
                {rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full object-cover" src={rental.car?.image || 'https://via.placeholder.com/40x40'} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{rental.car?.year} {rental.car?.make} {rental.car?.model}</div>
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
                ))}
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
          onClose={() => setShowModal(false)} 
          onBook={handleBookCar}
        />
      )}
    </div>
  );
};

export default RenterDashboard;
