import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiPlus, FiArrowUpRight, FiDollarSign, FiCalendar, FiUser } from "react-icons/fi";
import { FaCar } from "react-icons/fa";
import carService from "../services/carService";
import rentalService from "../services/rentalService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";

// StatCard component for displaying statistics with icons and trends
const StatCard = ({ title, value, icon: Icon, color, trend, change, loading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{loading ? '...' : value}</h3>
        {change && (
          <p className={`text-sm mt-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? '+' : '-'}{change}% {trend === 'up' ? 'increase' : 'decrease'}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
    </div>
  );
};

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    activeRentals: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        console.error("No user ID available");
        return;
      }
      
      try {
        setLoading(true);
        // Fetch owner's cars
        const carsResponse = await carService.getCars({ ownerId: user.id });
        const ownerCars = Array.isArray(carsResponse.data) ? carsResponse.data : [];
        setCars(ownerCars);
        
        // Fetch rentals for owner's cars
        setLoadingRentals(true);
        const rentalsResponse = await rentalService.getRentalsByOwnerId();
        const ownerRentals = Array.isArray(rentalsResponse) ? rentalsResponse : [];
        setRentals(ownerRentals);
        
        // Calculate stats
        const totalCars = ownerCars.length;
        const activeRentals = ownerRentals.filter(rental => 
          rental.status === 'active' || rental.status === 'pending'
        ).length;
        
        // Calculate total earnings from completed rentals
        const totalEarnings = ownerRentals
          .filter(rental => rental.status === 'completed')
          .reduce((sum, rental) => sum + (rental.totalAmount || 0), 0);
        
        setStats({
          totalCars,
          activeRentals,
          totalEarnings,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
        setLoadingRentals(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Owner Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Owner'}!</p>
        </div>
        <Link
          to="/add-car"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <FiPlus className="-ml-1 mr-2 h-5 w-5" />
          Add New Car
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Cars"
          value={stats.totalCars}
          icon={FaCar}
          color="blue"
          loading={loading}
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeRentals}
          icon={FiCalendar}
          color="green"
          trend="up"
          change="12"
          loading={loading}
        />
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings}`}
          icon={FiDollarSign}
          color="orange"
          trend="up"
          change="8"
          loading={loading}
        />
      </div>

      {/* My Cars Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">My Cars</h2>
          <Link
            to="/my-cars"
            className="text-sm font-medium text-orange-600 hover:text-orange-500 flex items-center"
          >
            View All
            <FiArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading cars...</div>
        ) : cars.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't listed any cars yet</p>
            <Link
              to="/add-car"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              Add Your First Car
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.slice(0, 3).map((car) => (
              <div key={car.id} className="border rounded-lg overflow-hidden">
                <img
                  src={car.image || 'https://via.placeholder.com/300x200?text=Car+Image'}
                  alt={car.make + ' ' + car.model}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{car.make} {car.model}</h3>
                  <p className="text-gray-500 text-sm">{car.year} • {car.transmission}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-bold text-orange-600">${car.dailyRate}/day</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      car.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {car.status === 'available' ? 'Available' : 'Rented'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
          <Link
            to="/bookings"
            className="text-sm font-medium text-orange-600 hover:text-orange-500 flex items-center"
          >
            View All
            <FiArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {loadingRentals ? (
          <div className="text-center py-4">Loading bookings...</div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center">
              <FiCalendar className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-gray-500">Your booking history will appear here once customers start renting your cars.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rentals.slice(0, 5).map((rental) => {
                  // Find the car associated with this rental
                  const rentalCar = cars.find(car => car.id === rental.carId) || {};
                  
                  // Format dates
                  const startDate = rental.startDate ? new Date(rental.startDate) : null;
                  const endDate = rental.endDate ? new Date(rental.endDate) : null;
                  
                  const formattedStartDate = startDate ? format(startDate, 'MMM d, yyyy') : 'N/A';
                  const formattedEndDate = endDate ? format(endDate, 'MMM d, yyyy') : 'N/A';
                  
                  // Calculate status class
                  const statusClass = 
                    rental.status === 'completed' ? 'bg-green-100 text-green-800' :
                    rental.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    rental.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800';
                    
                  return (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
                            {rentalCar.image ? (
                              <img 
                                className="h-10 w-10 object-cover" 
                                src={rentalCar.image} 
                                alt={`${rentalCar.make} ${rentalCar.model}`} 
                              />
                            ) : (
                              <div className="h-10 w-10 flex items-center justify-center">
                                <FaCar className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {rentalCar.make} {rentalCar.model}
                            </div>
                            <div className="text-sm text-gray-500">{rentalCar.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                            <FiUser className="text-gray-500" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-900">{rental.customerName || 'Customer'}</div>
                            <div className="text-sm text-gray-500">{rental.customerEmail || 'No email provided'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formattedStartDate} - {formattedEndDate}</div>
                        <div className="text-sm text-gray-500">{rental.totalDays || 'N/A'} days</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${rental.totalAmount?.toFixed(2) || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                          {rental.status ? rental.status.charAt(0).toUpperCase() + rental.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {rentals.length > 5 && (
              <div className="mt-4 text-center">
                <Link 
                  to="/bookings" 
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  View all {rentals.length} bookings
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
