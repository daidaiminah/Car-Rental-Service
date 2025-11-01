import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiChevronDown, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { getNavigationConfig } from '../config/navigation';
import Logo from '../assets/images/Comfort/comfort_logo.png'
//import { TbGridDots } from "react-icons/tb";

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth(); // isAuthenticated is a boolean
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOwnerRoute = location.pathname.startsWith('/owner');
  const isRenterRoute = location.pathname.startsWith('/renter');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    // Close mobile menu when route changes
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Get dashboard URL based on user role
  const getDashboardUrl = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'owner') return '/owner';
    return '/renter';
  };

  // Toggle search on mobile
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus search input when opening
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    if (isAdminRoute) {
      navigate('/');
    }
    setIsProfileOpen(false);
  };

  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get navigation links based on user role
  const getNavigationLinks = () => {
    if (user?.role === 'admin') {
      return getNavigationConfig('admin');
    } else if (user?.role === 'owner') {
      return getNavigationConfig('owner');
    } else if (user?.role === 'customer' || user?.role === 'renter') {
      return getNavigationConfig('renter');
    } else {
      return getNavigationConfig(); // Public links
    }
  };

  const navigationLinks = getNavigationLinks();

  // Mobile navigation links based on authentication and route
  const renderMobileNavLinks = () => {
    // Common links for all authenticated users
    const commonLinks = [
      { to: '/profile', text: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { to: '/settings', text: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
      { to: '/help', text: 'Help & Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zM12 13a1 1 0 100-2 1 1 0 000 2z' },
    ];

    // Get the appropriate links for the current section
    const currentSectionLinks = navigationLinks; // Already filtered by role in getNavigationLinks()

    // If no links are available, return null or a message
    if (!currentSectionLinks || currentSectionLinks.length === 0) {
      return (
        <div className="px-4 py-3 text-sm text-gray-500">
          No navigation items available
        </div>
      );
    }

    return (
      <div className="space-y-1 pb-3 pt-2 max-h-[calc(100vh-64)] overflow-y-auto px-2 md:w-64 xl:w-80">
        {/* Section Title */}
        <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {isAdminRoute ? 'Admin' : isOwnerRoute ? 'Owner' : isRenterRoute ? 'Renter' : 'Menu'}
        </div>

        {/* Current Section Links */}
        {currentSectionLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg 
              className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={link.icon} 
              />
            </svg>
            {link.label}
          </Link>
        ))}

        {isAuthenticated && (
          <>
            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* Common Links */}
            <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </div>
            {commonLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg 
                  className="flex-shrink-0 h-5 w-5 text-gray-500 mr-3" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={link.icon} 
                  />
                </svg>
                {link.text}
              </Link>
            ))}
          </>
        )}

        {/* Switch to Public Site / Auth Buttons */}
        <div className="border-t border-gray-200 mt-4 pt-4 px-6">
          {isAuthenticated ? (
            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              View Public Site
            </Link>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <p className="text-center text-sm text-gray-600">
                New user?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:text-primary-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create an account
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Mock search function - replace with actual API call
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      // Simulate API call with timeout
      setTimeout(() => {
        const mockResults = [
          { id: 1, name: 'Toyota Camry', type: 'Sedan', price: '$50/day' },
          { id: 2, name: 'Honda Accord', type: 'Sedan', price: '$55/day' },
          { id: 3, name: 'BMW X5', type: 'SUV', price: '$90/day' },
        ];
        setSearchResults(mockResults.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
        ));
        setShowSearchResults(true);
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top bar with contact info - Only visible on desktop */}
      <div className="hidden md:block bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex space-x-4">
              <div className="flex items-center">
                <FiMapPin className="mr-1 text-primary" />
                <span>123 Car Street, Auto City</span>
              </div>
              <div className="hidden md:flex items-center">
                <FiPhone className="mr-1 text-primary" />
                <span>+1 234 567 890</span>
              </div>
              <div className="hidden md:flex items-center">
                <FiMail className="mr-1 text-primary" />
                <span>info@comfortcarrental.com</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-white"><FaFacebook /></a>
              <a href="#" className="text-gray-300 hover:text-white"><FaTwitter /></a>
              <a href="#" className="text-gray-300 hover:text-white"><FaInstagram /></a>
              <a href="#" className="text-gray-300 hover:text-white"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img className="h-16 w-auto" src={Logo} alt="Comfort Car Rental" />
              </Link>
            </div>

            {/* Search bar - Initially hidden, shown when search icon is clicked */}
            <div 
              className={`absolute left-0 right-0 top-full bg-white py-2 px-4 z-50 transition-all duration-300 ${
                isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible h-0 overflow-hidden'
              }`}
              ref={searchRef}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for cars, models..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchQuery.length > 2 && setShowSearchResults(true)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Search
                </button>
              </form>
              
              {/* Search results dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/cars?search=${encodeURIComponent(item.name)}`}
                      className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowSearchResults(false)}
                    >
                      <span>{item.name} <span className="text-gray-500 text-xs">({item.type})</span></span>
                      <span className="font-medium text-primary">{item.price}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation and user menu */}
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation Links */}
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-700 hover:text-primary font-medium">Home</Link>
                <Link to="/cars" className="text-gray-700 hover:text-primary font-medium">Cars</Link>
                <Link to="/about" className="text-gray-700 hover:text-primary font-medium">About</Link>
                <Link to="/contact" className="text-gray-700 hover:text-primary font-medium">Contact</Link>
              </div>

              {/* Search button */}
              <button 
                type="button" 
                className="p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  if (!isSearchOpen) {
                    setShowSearchResults(false);
                    setSearchQuery('');
                  }
                }}
              >
                <FiSearch className="h-5 w-5" />
              </button>

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <FiUser className="h-4 w-4" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                      {user?.name || 'My Account'}
                    </span>
                    <FiChevronDown className="hidden md:inline h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1">
                        <Link
                          to={getDashboardUrl()}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                {isMobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile search - Only show on mobile when search icon is clicked */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 px-2 absolute left-0 right-0 bg-white z-50 shadow-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for cars, models..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              {showSearchResults && searchResults.length > 0 && (
                <div className="mt-1 bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/cars?search=${encodeURIComponent(item.name)}`}
                      className="flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setShowSearchResults(false);
                        setIsSearchOpen(false);
                      }}
                    >
                      <span>{item.name} <span className="text-gray-500 text-xs">({item.type})</span></span>
                      <span className="font-medium text-primary">{item.price}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu - Updated to be visible on larger screens */}
      <div
        className={`fixed inset-y-0 left-0 w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out xl:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="pt-5 pb-4 px-4">
          <div className="flex items-center justify-between px-2 mb-6">
            <h2 className="text-lg font-medium text-gray-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white`}>
            <div className="pt-2 pb-4 border-t border-gray-200">
              {renderMobileNavLinks()}
              
              {isAuthenticated && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center px-6">
                    <div className="flex-shrink-0">
                      <FiUser className="h-10 w-10 rounded-full text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {user?.name || 'User'}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email || ''}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-6 py-2 text-base font-medium text-red-600 hover:bg-gray-100 hover:text-red-800"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu - Updated to match new breakpoint */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 xl:hidden transition-opacity duration-300 ease-in-out"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
