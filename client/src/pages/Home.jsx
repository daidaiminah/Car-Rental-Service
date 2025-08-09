import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiDollarSign, FiSmartphone, FiCalendar, FiClock, FiSearch, FiStar, FiChevronRight, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

// Components
import Title from '../components/Title';
import CarCard from "../components/CarCard";

// Assets
import HondaCar from '../assets/images/2023hondacivic.jpg';
import MomoMoney from "../assets/images/momo-money.jpeg";
import OrangeMoney from "../assets/images/orange-money.jpeg";
import SslImg from "../assets/images/ssl-encryption.png";
import CreditCard from "../assets/images/credit-card.jpeg";
import HeadShot1 from "../assets/images/head-shot1.jpeg";
import HeadShot4 from "../assets/images/head-shot4.jpeg";
import HeadShot3 from "../assets/images/head-shot3.jpeg";

// Store
import { useGetFeaturedCarsQuery } from '../store/features/cars/carsApiSlice';

/**
 * Home Component
 * 
 * Displays the main landing page with featured cars, search functionality,
 * and information about the car rental service.
 */

const Home = () => {
  // Local state for form controls
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    transmission: ''
  });
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Fetch featured cars using the new car service
  const { 
    data: featuredCars = [], 
    isLoading, 
    isError, 
    error 
  } = useGetFeaturedCarsQuery();
  
  // Handle error state
  useEffect(() => {
    if (isError) {
      console.error('Error loading featured cars:', error);
      toast.error('Failed to load featured cars. Please try again later.');
    }
  }, [isError, error]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    // Here you would typically trigger a new search with the current filters
    // For now, we'll just show a toast notification
    toast.info('Search functionality will be implemented soon!');
  };

  // Filter cars based on local filters
  const filteredCars = featuredCars.filter(car => {
    const searchTermLower = (searchTerm || '').toLowerCase();
    const matchesSearch = 
      !searchTerm || 
      (car.make?.toLowerCase().includes(searchTermLower) ||
       car.model?.toLowerCase().includes(searchTermLower));
    
    const matchesFilters = 
      (!filters.type || car.type === filters.type) &&
      (!filters.transmission || car.transmission === filters.transmission) &&
      (!filters.minPrice || car.pricePerDay >= parseFloat(filters.minPrice)) &&
      (!filters.maxPrice || car.pricePerDay <= parseFloat(filters.maxPrice));
    
    return matchesSearch && matchesFilters;
  });

  // Handle filter input changes
  const handleInputFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    dispatch(setReduxFilters(newFilters));
  };

  // Handle search term changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    // Update local state for controlled input
    setSearchTerm(value);
    // Update Redux state for filtering and persistence
    dispatch(setReduxFilters({ searchTerm: value }));
  };

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };
  
  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Title title="Home" />
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gray-900"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url(${HondaCar})`
            }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.2 }}
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <motion.div 
              className="max-w-3xl"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
                variants={slideUp}
              >
                Premium Car Rentals in Liberia
              </motion.h1>
              <motion.p 
                className="mt-6 text-xl text-gray-300"
                variants={slideUp}
              >
                Explore Monrovia and beyond with our reliable fleet of vehicles. Perfect for business trips, family vacations, and everything in between.
              </motion.p>
              
              {/* Search Form */}
              <motion.div 
                className="mt-12 bg-white rounded-lg shadow-lg p-6"
                variants={scaleIn}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="">Select a city</option>
                        <option value="monrovia">Monrovia</option>
                        <option value="gbarnga">Gbarnga</option>
                        <option value="ganta">Ganta</option>
                        <option value="buchanan">Buchanan</option>
                        <option value="kakata">Kakata</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="w-full bg-primary hover:bg-orange-700 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                    >
                      <FiSearch className="mr-2" />
                      Find My Car
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={slideUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Whip In Time</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience the best car rental service with our premium vehicles and exceptional customer support</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Our vehicles are meticulously maintained and regularly serviced to ensure your safety and comfort.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Coverage</h3>
              <p className="text-gray-600">With multiple locations across the city, finding a car near you has never been easier.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is available round the clock to assist you with any queries or issues.</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            variants={slideUp}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you're a driver or a rider, getting started is quick and easy</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* For Riders */}
            <motion.div 
              className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="text-center mb-6">
                <motion.h3 
                  className="text-2xl font-bold text-gray-800 mb-2"
                  variants={slideUp}
                >For Riders</motion.h3>
                <motion.p 
                  className="text-gray-600"
                  variants={slideUp}
                >Rent a car in just a few simple steps</motion.p>
              </div>
              
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
              >
                <motion.div 
                  className="flex items-start"
                  variants={slideUp}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-orange-100 text-primary w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold mr-4 mt-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >1</motion.div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Find Your Perfect Ride</h4>
                    <p className="text-gray-600">Browse our fleet and choose the vehicle that matches your needs and budget.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={slideUp}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-orange-100 text-primary w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold mr-4 mt-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >2</motion.div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Book Instantly</h4>
                    <p className="text-gray-600">Select your dates, complete the booking, and get instant confirmation.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={slideUp}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-orange-100 text-primary w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold mr-4 mt-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >3</motion.div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Hit the Road</h4>
                    <p className="text-gray-600">Pick up your car and enjoy your journey with our 24/7 support.</p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mt-8 text-center"
                variants={slideUp}
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/cars" className="inline-block bg-primary hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  Start Your Ride
                </Link>
              </motion.div>
            </motion.div>
            
            {/* For Car Owners */}
            <motion.div 
              className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100"
              variants={scaleIn}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="text-center mb-6">
                <motion.h3 
                  className="text-2xl font-bold text-gray-800 mb-2"
                  variants={slideUp}
                >For Car Owners</motion.h3>
                <motion.p 
                  className="text-gray-600"
                  variants={slideUp}
                >Earn money by sharing your car when you're not using it</motion.p>
              </div>
              
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
              >
                <motion.div 
                  className="flex items-start"
                  variants={slideUp}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-orange-100 text-primary w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold mr-4 mt-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >1</motion.div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">List Your Car</h4>
                    <p className="text-gray-600">Create a profile for your car with photos and details in minutes.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={slideUp}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-orange-100 text-primary w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold mr-4 mt-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >2</motion.div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Set Your Schedule</h4>
                    <p className="text-gray-600">Choose when your car is available and set your own rates.</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={slideUp}
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="bg-orange-100 text-primary w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold mr-4 mt-1"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >3</motion.div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Start Earning</h4>
                    <p className="text-gray-600">Get paid when your car is rented. We handle the rest!</p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="mt-8 text-center"
                variants={slideUp}
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/signup" className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  List Your Car
                </Link>
              </motion.div>
            </motion.div>

          </motion.div>
          
        </div>
      </motion.div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-primary rounded-full mr-3 flex items-center justify-center">
              <FiSearch className="text-white" />
            </span>
            Find Your Perfect Ride
          </h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by make or model..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
              <div className="relative">
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleInputFilterChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 shadow-sm"
                >
                  <option value="">All Types</option>
                  <option value="suv">SUV</option>
                  <option value="sedan">Sedan</option>
                  <option value="luxury">Luxury</option>
                  <option value="electric">Electric</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Transmission</label>
              <div className="relative">
                <select
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleInputFilterChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 shadow-sm"
                >
                  <option value="">All Transmissions</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Price (USD)</label>
              <div className="relative">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleInputFilterChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Price (USD)</label>
              <div className="relative">
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleInputFilterChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  // Clear both search term and filters
                  setSearchTerm('');
                  const emptyFilters = {
                    type: '',
                    minPrice: '',
                    maxPrice: '',
                    transmission: '',
                    searchTerm: ''
                  };
                  setFilters(emptyFilters);
                  dispatch(setReduxFilters(emptyFilters));
                }}
                className="w-full bg-primary hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Cars</h2>
            <div className="text-gray-600">
              {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
            </div>
          </div>

          {filteredCars.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No cars found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Easy Payment Options Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Easy Payment Options</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Multiple payment methods for your convenience</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                {/* <FiCreditCard className="text-white text-2xl" /> */}
                <img src={CreditCard} className='rounded-full w-16 h-16'/>
              </div>
              <h3 className="font-semibold text-gray-800">Credit Card</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">Visa, Mastercard accepted</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                {/* <FiSmartphone className="text-primary text-2xl" /> */}
                <img src={MomoMoney} className='rounded-full w-16 h-16'/>
              </div>
              <h3 className="font-semibold text-gray-800">Mobile Money</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">Momo Money, MTN Lonestar</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
               {/* <FiSmartphone className="text-primary text-2xl" /> */}
               <img src={OrangeMoney} className='rounded-full w-16 h-16'/>
              </div>
              <h3 className="font-semibold text-gray-800">Mobile Money</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">Orange Money, Orange Liberia</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                {/* <FiShield className="text-primary text-2xl" /> */}
                <img src={SslImg} className='rounded-full w-16 h-16'/>
              </div>
              <h3 className="font-semibold text-gray-800">Secure</h3>
              <p className="text-sm text-gray-500 mt-1 text-center">SSL Encryption</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Testimonials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from people who've experienced our service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">"Renting a car has never been easier. The team was professional and the car was in excellent condition. Will definitely use again!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/60 flex items-center justify-center font-bold mr-3">
                  <img src={HeadShot1} className="w-11 h-11 rounded-full"/>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-gray-500">Business Traveler</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">"Perfect service for my business trips. The cars are always well-maintained and the rates are competitive."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/60 flex items-center justify-center font-bold mr-3">
                  <img src={HeadShot4} className="w-11 h-11 rounded-full"/>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-sm text-gray-500">Regular Customer</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[1, 2, 3, 4, 4].map((star, index) => (
                    <FiStar key={index} className={`w-5 h-5 ${star <= 4 ? 'fill-current' : ''}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4">"The mobile money payment option is a game changer! So convenient for those of us who prefer cashless transactions in Liberia."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary/60 flex items-center justify-center font-bold mr-3">
                  <img src={HeadShot3} className="w-11 h-11 rounded-full"/>
                </div>
                <div>
                  <h4 className="font-semibold">Mariama Kanneh</h4>
                  <p className="text-sm text-gray-500">Kakata</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Start Section */}
      <div className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Liberia?</h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">Discover Liberia's beauty with our reliable car rental service. Perfect for business trips, family vacations, and exploring Monrovia's vibrant streets.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/signup" 
              className="bg-white text-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Book Your Car Now
            </Link>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Contact Our Team
            </Link>
          </div>
          <p className="mt-6 text-sm text-orange-100">
            Need help? Call us at <a href="tel:+881617698" className="font-semibold underline">+231 881617698</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
