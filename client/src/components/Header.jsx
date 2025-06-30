import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-label="Open sidebar"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link to="/" className="ml-2 lg:ml-0">
              <h1 className="text-xl md:text-2xl font-bold text-primary whitespace-nowrap">
                Car Rental System
              </h1>
            </Link>
          </div>

          {/* Center - Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
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

          {/* Right side - User profile and mobile search */}
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
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white">
                <span className="font-medium">A</span>
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
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
    </header>
  );
};

export default Header;
