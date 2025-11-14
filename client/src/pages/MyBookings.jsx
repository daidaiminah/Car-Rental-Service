import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FaCalendarAlt, FaCar, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { selectCurrentUser } from '../store/features/auth/authSlice';
import { 
  useGetRentalsByRenterIdQuery,
  useUpdateRentalMutation 
} from '../store/features/rentals/rentalsApiSlice';

const MyBookings = () => {
  const user = useSelector(selectCurrentUser);
  const [filter, setFilter] = useState('all'); // all, upcoming, active, past

  // Use RTK Query hook to fetch bookings
  const { 
    data: response = { data: [] }, 
    isLoading: loading,
    isError,
    error,
    refetch: refetchBookings
  } = useGetRentalsByRenterIdQuery(user?.id, {
    skip: !user?.id
  });

  // Extract bookings from response (handle both direct array and nested data property)
  const bookings = Array.isArray(response) ? response : (response?.data || []);

  // Use RTK Query mutation to update rental status to cancelled
  const [updateRental, { isLoading: isCancelling }] = useUpdateRentalMutation();
  
  // Show error if there's an issue fetching bookings
  if (isError) {
    console.error('Error fetching bookings:', error);
    toast.error('Failed to load your bookings. Please try again.');
  }

  const filteredBookings = bookings.filter(booking => {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    
    if (filter === 'upcoming') {
      return startDate > now;
    } else if (filter === 'active') {
      return startDate <= now && endDate >= now;
    } else if (filter === 'past') {
      return endDate < now;
    }
    return true; // 'all' filter
  });

  const getStatusBadge = (booking) => {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);
    
    if (now < startDate) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Upcoming</span>;
    } else if (now >= startDate && now <= endDate) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Active</span>;
    } else {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Completed</span>;
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await updateRental({
          id: bookingId,
          status: 'cancelled'
        }).unwrap();
        toast.success('Booking cancelled successfully');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error('Failed to cancel booking. Please try again.');
      }
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
      <h1 className="text-2xl font-bold text-secondary-dark mb-6">My Bookings</h1>
      
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${filter === 'all' 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
        >
          All Bookings
        </button>
        <button 
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-md ${filter === 'upcoming' 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
        >
          Upcoming
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
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-md ${filter === 'past' 
            ? 'bg-primary text-white' 
            : 'bg-gray-100 text-secondary hover:bg-gray-200'}`}
        >
          Past
        </button>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center">
          <FaCalendarAlt className="mx-auto text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-secondary-dark mb-2">No Bookings Found</h2>
          <p className="text-secondary mb-4">
            {filter === 'all' 
              ? "You haven't made any bookings yet." 
              : filter === 'upcoming' 
                ? "You don't have any upcoming bookings." 
                : filter === 'active'
                  ? "You don't have any active bookings."
                  : "You don't have any past bookings."}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-primary hover:underline"
            >
              View all bookings
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex items-start mb-4 md:mb-0">
                    <div className="h-20 w-20 flex-shrink-0 mr-4">
                      <img 
                        className="h-20 w-20 rounded-md object-cover" 
                        src={booking.car?.imageUrl || 'https://via.placeholder.com/80?text=Car'} 
                        alt={booking.car?.make} 
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-secondary-dark">
                        {booking.car?.make} {booking.car?.model}
                      </h3>
                      <p className="text-secondary text-sm">{booking.car?.year} • {booking.car?.transmission}</p>
                      <div className="flex items-center mt-1 text-secondary text-sm">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{booking.pickupLocation || booking.car?.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {getStatusBadge(booking)}
                    <div className="mt-2 text-lg font-bold text-primary">
                      ${booking.totalCost}
                    </div>
                    <div className="text-secondary text-sm">
                      {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-secondary text-sm">Booking Date</div>
                      <div className="flex items-center text-secondary-dark">
                        <FaCalendarAlt className="mr-2 text-primary" />
                        {format(new Date(booking.createdAt || new Date()), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div>
                      <div className="text-secondary text-sm">Rental Period</div>
                      <div className="flex items-center text-secondary-dark">
                        <FaCalendarAlt className="mr-2 text-primary" />
                        {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div>
                      <div className="text-secondary text-sm">Payment Method</div>
                      <div className="flex items-center text-secondary-dark">
                        <FaMoneyBillWave className="mr-2 text-primary" />
                        {booking.paymentMethod || 'Credit Card'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <button 
                    onClick={() => window.location.href = `/booking-details/${booking.id}`}
                    className="btn-secondary-outline"
                  >
                    View Details
                  </button>
                  
                  {new Date(booking.startDate) > new Date() && booking.status !== 'cancelled' && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn-danger-outline"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
