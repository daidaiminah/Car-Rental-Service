import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiPlus, FiArrowUpRight, FiUsers, FiCalendar, FiTruck } from "react-icons/fi";
import CarCard from "../components/CarCard";
import carService from "../services/carService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// StatCard component for displaying statistics with icons and trends
const StatCard = ({ title, value, icon: Icon, color, trend, change, loading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
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
  const [loading, setLoading] = useState(true);
  const [recentCars, setRecentCars] = useState([]);
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    activeRentals: 0,
    totalCustomers: 0,
  });
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch recent cars (limited to 6 for the dashboard)
        const cars = await carService.getAllCars({ limit: 6 });
        setRecentCars(cars);
        
        // Update stats based on the fetched data
        const availableCount = cars.filter(car => car.available).length;
        setStats({
          totalCars: cars.length,
          availableCars: availableCount,
          activeRentals: cars.length - availableCount, // Assuming non-available cars are rented
          totalCustomers: 0, // This would come from a users API in a real app
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
      <div className="container mx-auto px-4 py-8">
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
            value={stats.totalCars}
            icon={FiTruck}
            color="text-blue-500"
            trend="up"
            change="+5% from last month"
            loading={loading}
          />
          <StatCard
            title="Available Cars"
            value={stats.availableCars}
            icon={FiCalendar}
            color="text-green-500"
            trend="up"
            change="+12% from last week"
            loading={loading}
          />
          <StatCard
            title="Active Rentals"
            value={stats.activeRentals}
            icon={FiCalendar}
            color="text-yellow-500"
            trend="down"
            change="-2 from yesterday"
            loading={loading}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={FiUsers}
            color="text-purple-500"
            trend="up"
            change="+8% from last month"
            loading={loading}
          />
        </div>

        {/* Recent Cars */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                {recentCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
