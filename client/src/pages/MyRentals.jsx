import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FaCalendarAlt, FaCar, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import { selectCurrentUser } from '../store/features/auth/authSlice';
import { useGetRentalsByOwnerIdQuery } from '../store/features/rentals/rentalsApiSlice';

const MyRentals = () => {
  const user = useSelector(selectCurrentUser);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Use RTK Query hook to fetch rentals by owner ID
  const { 
    data: rentals = [], 
    isLoading: loading,
    isError,
    error 
  } = useGetRentalsByOwnerIdQuery(user?.id, {
    skip: !user?.id
  });

  // Show error if there's an issue fetching rentals
  if (isError) {
    console.error('Error fetching rentals:', error);
  }

  const filteredRentals = rentals.filter(rental => {
    const now = new Date();
    const endDate = new Date(rental.endDate);
    
    if (filter === 'active') {
      return endDate >= now;
    } else if (filter === 'completed') {
      return endDate < now;
    }
    return true; // 'all' filter
  });

  const getStatusBadge = (rental) => {
    const now = new Date();
    const startDate = new Date(rental.startDate);
    const endDate = new Date(rental.endDate);
    
    if (now < startDate) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Upcoming</span>;
    } else if (now >= startDate && now <= endDate) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Completed</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-dark mb-4 md:mb-0">Rental History</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${filter === 'active' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md ${filter === 'completed' 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-secondary-dark mb-2">No Rentals Found</h2>
          <p className="text-secondary mb-4">
            {filter === 'all' 
              ? "You don't have any rental history yet." 
              : filter === 'active' 
                ? "You don't have any active rentals." 
                : "You don't have any completed rentals."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-dark uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRentals.map(rental => (
                  <tr key={rental.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={rental.car?.image || 'https://via.placeholder.com/40?text=Car'} 
                            alt={rental.car?.make} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-dark">
                            {rental.car?.make} {rental.car?.model}
                          </div>
                          <div className="text-sm text-secondary">{rental.car?.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-secondary mr-2" />
                        <span className="text-sm text-secondary-dark">{rental.customer?.name || 'Customer'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-dark">
                        {format(new Date(rental.startDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-secondary">
                        to {format(new Date(rental.endDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-green-500 mr-2" />
                        <span className="text-sm font-medium text-secondary-dark">
                          ${rental.totalAmount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(rental)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/rental-details/${rental.id}`} 
                        className="text-primary hover:text-primary-dark"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;
