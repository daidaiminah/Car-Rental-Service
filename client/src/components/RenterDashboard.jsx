import React from 'react';
import { useGetRentalsByRenterIdQuery } from '../store/features/rentals/rentalsApiSlice';

const RenterDashboard = ({ userId }) => {
  const { data: rentals, isLoading, isError, error } = useGetRentalsByRenterIdQuery(userId, {
    skip: !userId,
  });

  if (isLoading) {
    return <div>Loading your rentals...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error loading rentals: {error.message}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-secondary-dark mb-4">My Rentals</h3>
      {rentals && rentals.length > 0 ? (
        <div className="space-y-4">
          {rentals.map(rental => (
            <div key={rental.id} className="border rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold">{rental.Car.make} {rental.Car.model}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={`font-semibold px-2 py-1 rounded-full text-white ${rental.status === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  {rental.status}
                </p>
                <p className="font-bold text-lg">${rental.totalCost}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no rental history.</p>
      )}
    </div>
  );
};

export default RenterDashboard;
