import React from 'react';
import { useGetCarsByOwnerIdQuery } from '../store/features/cars/carsApiSlice';

const OwnerDashboard = ({ userId }) => {
  const { data: cars, isLoading, isError, error } = useGetCarsByOwnerIdQuery(userId, {
    skip: !userId,
  });

  if (isLoading) {
    return <div>Loading your cars...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error loading cars: {error.message}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-secondary-dark mb-4">My Cars</h3>
      {cars && cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="border rounded-lg overflow-hidden">
              <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="font-bold text-lg">{car.make} {car.model}</h4>
                <p className="text-sm text-gray-600">{car.year}</p>
                <p className="text-right font-semibold">${car.rentalPricePerDay}/day</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have not listed any cars yet.</p>
      )}
    </div>
  );
};

export default OwnerDashboard;
