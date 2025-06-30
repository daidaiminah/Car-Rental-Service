import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rentalService from '../services/rentalService.js';

const Rentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rentals from the API
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const data = await rentalService.getAllRentals();
        
        // Ensure we have a valid array before setting state
        if (Array.isArray(data)) {
          setRentals(data);
          setError(null);
        } else {
          console.error('Invalid rentals data format:', data);
          setError('Received invalid data format from server');
          setRentals([]);
        }
      } catch (err) {
        console.error('Failed to fetch rentals:', err);
        setError('Failed to fetch rentals. Please try again.');
        setRentals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);



  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filter rentals based on search term and status filter
  const filteredRentals = Array.isArray(rentals) ? rentals.filter(rental => {
    if (!rental) return false;
    
    const searchTermLower = searchTerm.toLowerCase();
    const customer = rental.customer ? rental.customer.toLowerCase() : '';
    const car = rental.car ? rental.car.toLowerCase() : '';
    const startDate = rental.startDate || '';
    const endDate = rental.endDate || '';
    
    const matchesSearch = 
      customer.includes(searchTermLower) || 
      car.includes(searchTermLower) ||
      startDate.includes(searchTerm) ||
      endDate.includes(searchTerm);
      
    const matchesStatus = statusFilter === '' || rental.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rental?')) {
      try {
        await rentalService.deleteRental(id);
        // Update local state after successful API call
        setRentals(rentals.filter(rental => rental.id !== id));
      } catch (err) {
        console.error('Failed to delete rental:', err);
        alert('Failed to delete rental. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rentals</h1>
        <Link to="/rentals/new" className="btn-primary">
          New Rental
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search rentals..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="w-full md:w-48">
            <select 
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading/Error State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading rentals...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            className="mt-2 text-primary hover:underline"
            onClick={() => {
              setError(null);
              // Re-fetch rentals
              const fetchRentals = async () => {
                try {
                  setLoading(true);
                  const data = await rentalService.getAllRentals();
                  setRentals(data);
                  setError(null);
                } catch (err) {
                  console.error('Failed to fetch rentals:', err);
                  setError('Failed to fetch rentals. Please try again.');
                } finally {
                  setLoading(false);
                }
              };
              fetchRentals();
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Rentals List */}
      {!loading && !error && <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Car</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Start Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">End Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.length > 0 ? (
                filteredRentals.map((rental) => (
                  <tr key={rental.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{rental.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{rental.customer}</td>
                    <td className="px-4 py-3 text-sm">{rental.car}</td>
                    <td className="px-4 py-3 text-sm">{rental.startDate}</td>
                    <td className="px-4 py-3 text-sm">{rental.endDate}</td>
                    <td className="px-4 py-3 text-sm">${rental.totalAmount}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        rental.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : rental.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : rental.status === 'Completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Link to={`/rentals/${rental.id}`} className="text-primary hover:underline">View</Link>
                        <Link to={`/rentals/${rental.id}/edit`} className="text-secondary hover:underline">Edit</Link>
                        <button 
                          onClick={() => handleDelete(rental.id)} 
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-sm text-center">
                    No rentals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
};

export default Rentals;
