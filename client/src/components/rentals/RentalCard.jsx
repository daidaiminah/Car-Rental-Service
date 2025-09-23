// client/src/components/rentals/RentalCard.jsx
import React, { useState } from 'react';
import { FaCar, FaCheck, FaTimes, FaCalendarAlt, FaUser, FaEllipsisV, FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import { useUpdateRentalStatusMutation } from '../../store/features/rentals/rentalsApiSlice';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

const RentalCard = ({ rental, isOwner = false, refetch }) => {
  const [showActions, setShowActions] = useState(false);
  const status = rental.status.toLowerCase();
  const [updateStatus, { isLoading }] = useUpdateRentalStatusMutation();

  const handleStatusUpdate = async (newStatus) => {
    let rejectionReason = '';
    
    if (newStatus === 'rejected') {
      rejectionReason = prompt('Please enter the reason for rejection:');
      if (!rejectionReason) return;
    }

    try {
      await updateStatus({ 
        rentalId: rental.id, 
        status: newStatus, 
        rejectionReason 
      }).unwrap();
      
      // Refetch the rentals list to update the UI
      if (refetch) {
        await refetch();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(`Failed to update status: ${error.data?.message || 'Please try again'}`);
    } finally {
      setShowActions(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <FaCar className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {rental.car?.make} {rental.car?.model}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaUser className="mr-1" />
                <span>{rental.user?.name}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="text-gray-500 animate-spin" />
              ) : (
                <FaEllipsisV className="text-gray-500" />
              )}
            </button>
            
            {showActions && isOwner && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate('confirmed')}
                      className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaCheck className="inline mr-2" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin mr-2" />
                      ) : (
                        <FaTimes className="inline mr-2" />
                      )}
                      Reject
                    </button>
                  </>
                )}
                {status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate('completed')}
                    className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaCheck className="inline mr-2" />
                    )}
                    Mark as Completed
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Dates</div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 text-gray-400" />
              {rental.startDate && rental.endDate ? (
                `${format(new Date(rental.startDate), 'MMM d')} - ${format(new Date(rental.endDate), 'MMM d, yyyy')}`
              ) : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Total</div>
            <div className="font-semibold">
              ${rental.totalAmount ? Number(rental.totalAmount).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <button 
            className="text-blue-600 text-sm font-medium hover:underline"
            onClick={() => {
              // Implement view details functionality
              console.log('View details for rental:', rental.id);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;