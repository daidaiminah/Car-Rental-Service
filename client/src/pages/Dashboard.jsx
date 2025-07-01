import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiPlus, FiArrowUpRight, FiArrowDownRight, FiUsers, FiCalendar, FiTruck } from "react-icons/fi";
import CarCard from "../components/CarCard";
import SearchAndFilter from "../components/SearchAndFilter";
import AdminLayout from "../components/AdminLayout";
import HondaCivic from "../assets/images/2023hondacivic.jpg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock data - replace with API call
const mockCars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'RAV4',
    year: 2022,
    pricePerDay: 85,
    type: 'suv',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'hybrid',
    images: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'],
    location: 'Douola, Liberia',
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 2,
    make: 'Subaru',
    model: 'Outback',
    year: 2021,
    pricePerDay: 75,
    type: 'suv',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'petrol',
    images: ['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'],
    location: 'RedLight, Liberia',
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 3,
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    pricePerDay: 65,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'petrol',
    images: [HondaCivic],
    location: 'Nakuru, Kenya',
    rating: 4.6,
    reviews: 112,
  },
  {
    id: 4,
    make: 'Land Rover',
    model: 'Defender',
    year: 2022,
    pricePerDay: 150,
    type: 'suv',
    transmission: 'automatic',
    seats: 7,
    fuelType: 'diesel',
    images: ['data:image/jpeg;base64,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'],
    location: 'Monrovia, Liberia',
    rating: 4.9,
    reviews: 87,
  },
  {
    id: 5,
    make: 'Toyota',
    model: 'Hiace',
    year: 2021,
    pricePerDay: 90,
    type: 'van',
    transmission: 'manual',
    seats: 14,
    fuelType: 'diesel',
    images: [HondaCivic],
    location: 'Monrovia, Liberia',
    rating: 4.5,
    reviews: 76,
  },
  {
    id: 6,
    make: 'Mazda',
    model: 'CX-5',
    year: 2023,
    pricePerDay: 80,
    type: 'suv',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'petrol',
    images: ['data:image'],
    location: 'Monrovia, Liberia',
    rating: 4.7,
    reviews: 92,
  },
];

// StatCard component for displaying statistics with icons and trends
const StatCard = ({ title, value, icon: Icon, color, trend, change, loading = false }) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-400'
  };

  const TrendIcon = trend === 'up' ? FiArrowUpRight : FiArrowDownRight;
  const trendColor = trendColors[trend] || trendColors.neutral;

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-md flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
              <Icon className={`h-6 w-6`} style={{ color }} />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColor}`}>
                    <TrendIcon className="self-center flex-shrink-0 h-4 w-4" />
                    <span className="sr-only">
                      {trend === 'up' ? 'Increased' : 'Decreased'} by
                    </span>
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    activeRentals: 0,
    totalCustomers: 0,
  });
  
  const [recentCars, setRecentCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [cars, setCars] = useState(mockCars);
  
  const [filters, setFilters] = useState({
    type: "all",
    transmission: "all",
    fuelType: "all",
    minPrice: 0,
    maxPrice: 500,
  });

  // Simulate API call to fetch cars
  useEffect(() => {
    const timer = setTimeout(() => {
      setCars(mockCars);
      setFilteredCars(mockCars);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle search
  const handleSearch = (query) => {
    const newFilters = { ...filters, searchQuery: query };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Apply all filters
  const applyFilters = (activeFilters) => {
    let results = [...cars];

    // Apply search term filter
    if (activeFilters.searchQuery) {
      const term = activeFilters.searchQuery.toLowerCase();
      results = results.filter(
        car =>
          car.make.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term) ||
          car.location.toLowerCase().includes(term)
      );
    }

    // Apply other filters
    if (activeFilters.type !== "all") {
      results = results.filter(car => car.type === activeFilters.type);
    }
    if (activeFilters.transmission !== "all") {
      results = results.filter(car => car.transmission === activeFilters.transmission);
    }
    if (activeFilters.fuelType !== "all") {
      results = results.filter(car => car.fuelType === activeFilters.fuelType);
    }
    results = results.filter(
      car =>
        car.pricePerDay >= activeFilters.minPrice && car.pricePerDay <= activeFilters.maxPrice
    );

    setFilteredCars(results);
  };

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: '/admin' } });
      return;
    }
    
    // In a real app, fetch dashboard data here
    const fetchDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API calls
        setStats({
          totalCars: 24,
          availableCars: 18,
          activeRentals: 6,
          totalCustomers: 42,
        });
        
        setRecentCars(mockCars.slice(0, 3));
        setFilteredCars(mockCars);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/admin/cars/new"
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiPlus className="mr-2" />
            Add New Car
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Cars"
            value={stats.totalCars}
            icon={FiTruck}
            color="#4F46E5"
            trend="up"
            change="12%"
            loading={loading}
          />
          <StatCard
            title="Available Cars"
            value={stats.availableCars}
            icon={FiTruck}
            color="10B981"
            trend="up"
            change="5%"
            loading={loading}
          />
          <StatCard
            title="Active Rentals"
            value={stats.activeRentals}
            icon={FiCalendar}
            color="F59E0B"
            trend="down"
            change="3%"
            loading={loading}
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={FiUsers}
            color="EC4899"
            trend="up"
            change="8%"
            loading={loading}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Cars</h2>
            <Link
              to="/admin/cars"
              className="text-primary hover:text-primary-dark font-medium"
            >
              View all
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
