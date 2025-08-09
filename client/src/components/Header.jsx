import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';

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
  const searchInputRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
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

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile navigation links based on authentication and route
  const renderMobileNavLinks = () => {
    if (isAdminRoute) {
      return (
        <>
          <Link
            to="/admin/customers"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={onMenuClick}
          >
            Customers
          </Link>
          <Link
            to="/admin/rentals"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={onMenuClick}
          >
            Rentals
          </Link>
          <Link
            to="/"
            className="block px-4 py-2 text-base font-medium text-primary hover:bg-gray-100"
            onClick={onMenuClick}
          >
            View Public Site
          </Link>
        </>
      );
    } else {
      return (
        <>
          <Link
            to="/renter/browse"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={onMenuClick}
          >
            Browse Cars
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={onMenuClick}
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={onMenuClick}
          >
            Contact Us
          </Link>
          
        </>
      );
    }
  };


  return (
    <>
      <header 
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button and logo */}
            <div className="flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  if (isSearchOpen) setIsSearchOpen(false);
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <FiX className="block h-6 w-6" />
                ) : (
                  <FiMenu className="block h-6 w-6" />
                )}
              </button>
              
              {/* Logo */}
              <Link 
                to={isAuthenticated ? getDashboardUrl() : '/'} 
                className="ml-2 lg:ml-0"
              >
                <h1 className="text-xl font-bold text-primary whitespace-nowrap">
                  Whip In Time
                </h1>
              </Link>
            </div>

            {/* Search bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cars, models..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm"
                />
              </div>
            </div>


            {/* Right side - Navigation and user menu */}
            <div className="hidden md:flex items-center space-x-2">
            {isAdminRoute || isOwnerRoute || isRenterRoute ? (
              // Dashboard navigation
              <>
                {isAdminRoute && (
                  <>
                    <Link
                      to="/admin/customers"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Customers
                    </Link>
                    <Link
                      to="/admin/rentals"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Rentals
                    </Link>
                  </>
                )}
                {isOwnerRoute && (
                  <>
                    <Link
                      to="/owner/cars"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      My Cars
                    </Link>
                    <Link
                      to="/owner/rentals"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Rentals
                    </Link>
                  </>
                )}
                {isRenterRoute && (
                  <>
                    <Link
                      to="/renter/browse"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      Browse Cars
                    </Link>
                    <Link
                      to="/renter/bookings"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    >
                      My Bookings
                    </Link>
                  </>
                )}
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                >
                  View Public Site
                </Link>
              </>
            ) : (
              // Public navigation
              <>
                <Link
                  to="/cars"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Cars
                </Link>
                <Link
                  to="/about"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Contact
                </Link>
                
              </>
            )}
          </div>

          {/* Mobile menu button and user profile */}
          <div className="flex items-center space-x-2">
            {/* Mobile search button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Search"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* User profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
                aria-haspopup="true"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                {isAdminRoute && user ? (
                  <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                ) : null}
                <svg
                  className={`h-4 w-4 text-gray-500 transition-transform ${isProfileOpen ? 'transform rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile dropdown */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          state={{ from: location }}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Sign in
                        </Link>
                        <Link
                          to="/signup"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu content */}
        <div className={`lg:hidden ${isSearchOpen ? 'block' : 'hidden'} px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50`}>
          {isSearchOpen && (
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
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
          <nav className="mt-5 space-y-1">
            {renderMobileNavLinks()}
          </nav>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
