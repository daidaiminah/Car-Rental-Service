import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiMapPin, FiFilter, FiX } from 'react-icons/fi';

const SearchAndFilter = ({ onSearch, onFilterChange, filters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="mb-8">
      {/* Main Search Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-1 flex items-center">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-4 py-3 border-0 focus:ring-0 text-gray-900 placeholder-gray-400 focus:outline-none"
            placeholder="Search for cars, makes, or models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
          />
        </div>
        
        <div className="hidden md:flex items-center space-x-2 px-4">
          <div className="h-6 w-px bg-gray-300"></div>
          <button 
            onClick={toggleFilters}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
        
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Search
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 bg-white rounded-2xl shadow-sm p-6 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button 
              onClick={toggleFilters}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range (per day)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filters.minPrice || ''}
                  onChange={(e) => onFilterChange('minPrice', e.target.value)}
                />
                <span className="flex items-center">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={filters.maxPrice || ''}
                  onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Car Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={filters.carType || ''}
                onChange={(e) => onFilterChange('carType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="convertible">Convertible</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transmission
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={filters.transmission || ''}
                onChange={(e) => onFilterChange('transmission', e.target.value)}
              >
                <option value="">Any</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            {/* Seats */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seats
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={filters.seats || ''}
                onChange={(e) => onFilterChange('seats', e.target.value)}
              >
                <option value="">Any</option>
                <option value="2">2 Seats</option>
                <option value="4">4 Seats</option>
                <option value="5">5 Seats</option>
                <option value="7">7 Seats</option>
                <option value="8">8+ Seats</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                // Reset all filters
                Object.keys(filters).forEach(key => onFilterChange(key, ''));
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={toggleFilters}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
