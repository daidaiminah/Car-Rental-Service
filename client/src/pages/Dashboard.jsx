import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import CarCard from "../components/CarCard";
import SearchAndFilter from "../components/SearchAndFilter";
import HondaCivic from "../assets/images/2023hondacivic.jpg"

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
    images: ['data:image/jpeg;base64,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'],
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
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // Add activeTab state
  const [filters, setFilters] = useState({
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    carType: '',
    transmission: '',
    seats: ''
  });

  // Simulate API call to fetch cars
  useEffect(() => {
    const timer = setTimeout(() => {
      setCars(mockCars);
      setFilteredCars(mockCars);
      setIsLoading(false);
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

    // Apply search query filter
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      results = results.filter(
        car =>
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.type.toLowerCase().includes(query)
      );
    }

    // Apply price range filter
    if (activeFilters.minPrice) {
      results = results.filter(car => car.pricePerDay >= Number(activeFilters.minPrice));
    }
    if (activeFilters.maxPrice) {
      results = results.filter(car => car.pricePerDay <= Number(activeFilters.maxPrice));
    }

    // Apply car type filter
    if (activeFilters.carType) {
      results = results.filter(car => car.type === activeFilters.carType);
    }

    // Apply transmission filter
    if (activeFilters.transmission) {
      results = results.filter(car => car.transmission === activeFilters.transmission);
    }

    // Apply seats filter
    if (activeFilters.seats) {
      results = results.filter(car => car.seats >= Number(activeFilters.seats));
    }

    setFilteredCars(results);
  };

  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$24,780', 
      icon: () => (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      ), 
      color: '#10B981',
      trend: 'up',
      change: '12.5%'
    },
    { 
      title: 'Active Rentals', 
      value: '24', 
      icon: () => (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
        />
      ), 
      color: '#3B82F6',
      trend: 'up',
      change: '8.2%'
    },
    { 
      title: 'Available Cars', 
      value: '18', 
      icon: () => (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      ), 
      color: '#F59E0B',
      trend: 'down',
      change: '3.4%'
    },
    { 
      title: 'Total Customers', 
      value: '156', 
      icon: () => (
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
        />
      ), 
      color: '#8B5CF6',
      trend: 'up',
      change: '5.2%'
    }
  ];

  // Recent rentals data
  const recentRentals = [
    { 
      id: 1, 
      customer: 'John Doe', 
      car: 'Toyota Camry 2023', 
      startDate: '2025-06-20', 
      endDate: '2025-06-25', 
      status: 'Active',
      total: '$450.00',
      image: 'https://images.unsplash.com/photo-1494976351278-20cf4a6d4718?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    },
    { 
      id: 2, 
      customer: 'Jane Smith', 
      car: 'Honda Civic 2023', 
      startDate: '2025-06-18', 
      endDate: '2025-06-28', 
      status: 'Active',
      total: '$620.00',
      image: 'https://images.unsplash.com/photo-1549317661-82e3e7e6c0a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    },
    { 
      id: 3, 
      customer: 'Michael Brown', 
      car: 'Ford Mustang GT', 
      startDate: '2025-06-15', 
      endDate: '2025-06-22', 
      status: 'Active',
      total: '$980.00',
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    },
    { 
      id: 4, 
      customer: 'Sarah Wilson', 
      car: 'Chevrolet Malibu', 
      startDate: '2025-06-10', 
      endDate: '2025-06-20', 
      status: 'Completed',
      total: '$750.00',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
    }
  ];

  // Filter rentals based on active tab
  const filteredRentals = activeTab === 'all' 
    ? recentRentals 
    : recentRentals.filter(rental => 
        rental.status.toLowerCase() === activeTab.toLowerCase()
      );

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Calculate days remaining
  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Expired';
  };

  // Get unique car types for filter
  const carTypes = [...new Set(mockCars.map(car => car.type))];

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {/* Hero Section with Search */}
        <div className="relative bg-gradient-to-r from-red-200 to-red-500 text-white py-16 md:py-24">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the perfect car for your next adventure</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Choose from a wide range of cars at competitive prices. Book online in just a few clicks!
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="mt-10 max-w-5xl mx-auto">
              <SearchAndFilter 
                onSearch={handleSearch} 
                onFilterChange={handleFilterChange}
                filters={filters}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Wide Selection", description: "100+ cars to choose from" },
                { title: "Best Prices", description: "Competitive daily rates" },
                { title: "24/7 Support", description: "We're always here to help" },
                { title: "Easy Booking", description: "Simple and fast process" }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
                  <p className="mt-2 text-gray-600">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Car Listings */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Cars</h2>
              <div className="text-sm text-gray-500">
                {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                      <div className="h-10 bg-blue-600 rounded-lg w-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No cars found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setFilters({
                        searchQuery: '',
                        minPrice: '',
                        maxPrice: '',
                        carType: '',
                        transmission: '',
                        seats: ''
                      });
                      setFilteredCars(cars);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
