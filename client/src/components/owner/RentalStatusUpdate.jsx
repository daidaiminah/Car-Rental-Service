import React, { useState } from 'react';
import { useUpdateRentalStatusMutation } from '../../store/features/rentals/rentalsApiSlice';
import { toast } from 'react-toastify';
import { FiCheck, FiX } from 'react-icons/fi';

const RentalStatusUpdate = ({ rental, onStatusUpdate }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [updateRentalStatus, { isLoading }] = useUpdateRentalStatusMutation();

  const handleStatusUpdate = async (status) => {
    try {
      const response = await updateRentalStatus({
        rentalId: rental.id,
        status,
        ...(status === 'rejected' && { rejectionReason })
      }).unwrap();

      toast.success(`Rental ${status} successfully`);
      onStatusUpdate && onStatusUpdate(response.data);
    } catch (error) {
      console.error('Error updating rental status:', error);
      toast.error(error.data?.message || 'Failed to update rental status');
    } finally {
      setShowRejectForm(false);
      setRejectionReason('');
    }
  };

  if (rental.status !== 'pending') {
    return (
      <div className="mt-2">
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          {rental.status}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <div className="flex space-x-2">
        <button
          onClick={() => handleStatusUpdate('confirmed')}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          <FiCheck className="mr-1" /> Confirm
        </button>
        
        {!showRejectForm ? (
          <button
            onClick={() => setShowRejectForm(true)}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            <FiX className="mr-1" /> Reject
          </button>
        ) : (
          <div className="flex-1">
            <div className="flex space-x-2">
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection"
                className="flex-1 min-w-0 block w-full px-3 py-1 text-sm text-gray-900 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={!rejectionReason.trim() || isLoading}
                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Submit
              </button>
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalStatusUpdate;
