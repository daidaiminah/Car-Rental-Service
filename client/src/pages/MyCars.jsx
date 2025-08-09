import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaCar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useGetCarsByOwnerIdQuery, useDeleteCarMutation } from '../store/features/cars/carsApiSlice';
import { selectCurrentUser } from '../store/features/auth/authSlice';

const MyCars = () => {
  const user = useSelector(selectCurrentUser);
  
  // Use RTK Query hook to fetch cars by owner ID
  const { 
    data: cars = [], 
    isLoading, 
    isError, 
    error 
  } = useGetCarsByOwnerIdQuery(user?.id, {
    skip: !user?.id,
  });
  
  // Show error in console if API request fails
  if (isError) {
    console.error('Error fetching cars:', error);
    toast.error('Failed to load your cars. Please try again.');
  }

  // Use RTK Query mutation hook for deleting cars
  const [deleteCar, { isLoading: isDeleting }] = useDeleteCarMutation();
  
  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCar(carId).unwrap();
        toast.success('Car deleted successfully');
      } catch (error) {
        console.error('Error deleting car:', error);
        toast.error(error.data?.message || error.error || 'Failed to delete car. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-dark">My Cars</h1>
        <Link 
          to="/add-car" 
          className="btn-primary flex items-center gap-2"
        >
          <span>Add New Car</span>
          <FaCar />
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <FaCar className="mx-auto text-5xl text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-secondary-dark mb-2">No Cars Yet</h2>
          <p className="text-secondary mb-4">You haven't added any cars to your fleet yet.</p>
          <Link to="/add-car" className="btn-primary inline-block">
            Add Your First Car
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map(car => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={car.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 p-2 flex gap-2">
                  <Link 
                    to={`/edit-car/${car.id}`}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <FaEdit className="text-secondary" />
                  </Link>
                  <button 
                    onClick={() => handleDeleteCar(car.id)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                  >
                    <FaTrash className="text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                  <span className={`text-white text-sm font-medium px-2 py-1 rounded ${
                    car.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {car.status === 'available' ? 'Available' : 'Rented'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-secondary-dark">{car.make} {car.model}</h3>
                <p className="text-secondary text-sm">{car.year} • {car.transmission} • {car.fuelType}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-primary font-bold">${car.pricePerDay}/day</span>
                  <Link to={`/car-details/${car.id}`} className="text-primary hover:underline text-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCars;
