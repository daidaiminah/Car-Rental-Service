import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FaCalendarAlt, FaCar, FaUser, FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';
import { selectCurrentUser } from '../store/features/auth/authSlice';
import { useGetRentalsByOwnerIdQuery, useUpdateRentalStatusMutation } from '../store/features/rentals/rentalsApiSlice';
import { toast } from 'react-toastify';

const MyRentals = () => {
  const user = useSelector(selectCurrentUser);
  const [filter, setFilter] = useState('all'); // all, pending, active, completed
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRental, setSelectedRental] = useState(null);

  // Use RTK Query hooks
  const { 
    data: rentalsResponse = { data: [] }, 
    isLoading: loading,
    isError,
    error,
    refetch 
  } = useGetRentalsByOwnerIdQuery(user?.id, {
    skip: !user?.id
  });

  // Extract rentals from the response
  const rentals = Array.isArray(rentalsResponse) 
    ? rentalsResponse 
    : Array.isArray(rentalsResponse?.data) 
      ? rentalsResponse.data 
      : [];

  // Debug log
  console.log('Rentals data:', { rentals, response: rentalsResponse });

  const [updateRentalStatus] = useUpdateRentalStatusMutation();

  // Show error if there's an issue fetching rentals
  if (isError) {
    console.error('Error fetching rentals:', error);
  }

  // Filter rentals based on status
  const filteredRentals = rentals.filter(rental => {
    if (!rental) return false;
    
    const now = new Date();
    const startDate = rental.startDate ? new Date(rental.startDate) : null;
    const endDate = rental.endDate ? new Date(rental.endDate) : null;
    
    if (filter === 'pending') {
      return rental.status === 'pending';
    } else if (filter === 'active') {
      return rental.status === 'confirmed' && startDate && endDate && 
             now >= startDate && now <= endDate;
    } else if (filter === 'completed') {
      return rental.status === 'completed' || 
             (rental.status === 'confirmed' && endDate && now > endDate);
    }
    return true; // 'all' filter
  });

  const handleStatusUpdate = async (rentalId, status, reason = '') => {
    try {
      await updateRentalStatus({
        rentalId,
        status,
        ...(reason && { rejectionReason: reason })
      }).unwrap();
      
      toast.success(`Rental ${status} successfully`);
      refetch();
      setSelectedRental(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error updating rental status:', error);
      toast.error(error.data?.message || 'Failed to update rental status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Confirmed' },
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completed' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
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
        <h1 className="text-2xl font-bold text-secondary-dark mb-4 md:mb-0">Rental Management</h1>
        
        <div className="flex space-x-2 flex-wrap gap-2">
          {['all', 'pending', 'active', 'completed'].map((filterOption) => (
            <button 
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-md ${
                filter === filterOption 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-secondary hover:bg-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-secondary-dark mb-2">
            {filter === 'all' 
              ? "No rentals found" 
              : `No ${filter} rentals found`}
          </h2>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRentals.map(rental => {
                  const isActive = rental.status === 'confirmed' && 
                                 new Date() >= new Date(rental.startDate) && 
                                 new Date() <= new Date(rental.endDate);
                  const status = isActive ? 'active' : rental.status;

                  return (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={rental.car?.imageUrl || 'https://via.placeholder.com/40?text=Car'} 
                              alt={`${rental.car?.make} ${rental.car?.model}`} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/40?text=Car';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {rental.car?.make} {rental.car?.model}
                            </div>
                            <div className="text-sm text-gray-500">{rental.car?.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaUser className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {rental.user?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {rental.user?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(rental.startDate), 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          to {format(new Date(rental.endDate), 'MMM d, yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaMoneyBillWave className="text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            ${(() => {
                              const amount = rental.totalCost || rental.totalAmount || 0;
                              const numAmount = typeof amount === 'string' 
                                ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) 
                                : Number(amount);
                              return !isNaN(numAmount) 
                                ? numAmount.toFixed(2) 
                                : '0.00';
                            })()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {rental.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(rental.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                                title="Confirm"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => setSelectedRental(rental)}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          <Link
                            to={`/rentals/${rental.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {selectedRental && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Rental Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to reject this rental request? Please provide a reason:
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="3"
              placeholder="Enter reason for rejection..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedRental(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedRental.id, 'rejected', rejectionReason)}
                disabled={!rejectionReason.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  rejectionReason.trim()
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-300 cursor-not-allowed'
                }`}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRentals;
