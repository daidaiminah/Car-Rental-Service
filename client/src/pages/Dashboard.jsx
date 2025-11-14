import React, { useState } from "react";
import Title from '../components/Title';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiPlus, FiArrowUpRight, FiUsers, FiCalendar, FiTruck } from "react-icons/fi";
import CarCard from "../components/CarCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetCarsQuery } from "../store/features/cars/carsApiSlice";
import { useGetAllRentalsQuery } from "../store/features/rentals/rentalsApiSlice";
import { selectCurrentUser, logOut } from "../store/features/auth/authSlice";

// StatCard component for displaying statistics with icons and trends
const StatCard = ({ title, value, icon: Icon, color, trend, change, loading = false }) => {
  return (
    <div className="bg-white rounded-lg p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{loading ? '...' : value}</h3>
        {change && (
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <FiArrowUpRight className="text-green-500 mr-1" />
            ) : (
              <FiArrowUpRight className="text-red-500 mr-1 transform rotate-180" />
            )}
            <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`text-xl ${color}`} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use RTK Query hooks to fetch data
  const { 
    data: cars = [], 
    isLoading: carsLoading,
    isError: carsError,
    error: carsErrorData
  } = useGetCarsQuery({ limit: 6 });
  
  const { 
    data: rentals = [],
    isLoading: rentalsLoading,
    isError: rentalsError,
    error: rentalsErrorData
  } = useGetAllRentalsQuery();
  
  // Calculate stats based on fetched data
  const availableCars = cars.filter(car => car.status === 'available').length;
  const activeRentals = rentals.filter(rental => rental.status === 'active').length;
  
  // Determine if any data is still loading
  const loading = carsLoading || rentalsLoading;
  
  // Show errors in console
  if (carsError) {
    console.error('Error fetching cars:', carsErrorData);
    toast.error('Failed to load cars data');
  }
  
  if (rentalsError) {
    console.error('Error fetching rentals:', rentalsErrorData);
    toast.error('Failed to load rentals data');
  }



  const handleLogout = async () => {
    try {
      dispatch(logOut());
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <Title title="Admin Dashboard" />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentUser?.email || 'Admin'}!</p>
          </div>
          <Link
            to="/admin/cars/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiPlus className="mr-2" /> Add New Car
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Cars"
              value={cars.length}
              icon={FiTruck}
              color="text-blue-500"
              trend="up"
              change="+5% from last month"
              loading={loading}
            />
            <StatCard
              title="Available Cars"
              value={availableCars}
              icon={FiCalendar}
              color="text-green-500"
              trend="up"
              change="+12% from last week"
              loading={loading}
            />
            <StatCard
              title="Active Rentals"
              value={activeRentals}
              icon={FiCalendar}
              color="text-yellow-500"
              trend="down"
              change="-2 from yesterday"
              loading={loading}
            />
            <StatCard
              title="Total Customers"
              value={rentals.length > 0 ? new Set(rentals.map(rental => rental.renterId)).size : 0}
              icon={FiUsers}
              color="text-purple-500"
              trend="up"
              change="+8% from last month"
              loading={loading}
            />
        </div>

        {/* Recent Cars */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recent Cars</h2>
              <Link to="/admin/cars" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <div key={car.id} className="bg-white rounded-lg overflow-hidden">
                    <CarCard car={car} />
                    <div className="p-4 border-t border-gray-100">
                      <Link 
                        to={`/admin/cars/${car.id}`}
                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
  