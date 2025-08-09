import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  useGetCarByIdQuery,
  useAddCarMutation,
  useUpdateCarMutation,
  useDeleteCarMutation 
} from '../store/features/cars/carsApiSlice';
import { useGetRentalsByCarIdQuery } from '../store/features/rentals/rentalsApiSlice';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use RTK Query hooks to fetch data
  const { 
    data: car,
    isLoading: isLoadingCar,
    isError: isCarError,
    error: carError
  } = useGetCarByIdQuery(id, { 
    // Skip query if we're on the 'new' page
    skip: id === 'new' 
  });
  
  // Fetch rentals for this car
  const {
    data: carRentals = [],
    isLoading: isLoadingRentals
  } = useGetRentalsByCarIdQuery(id, {
    // Skip query if we're on the 'new' page
    skip: id === 'new'
  });
  
  // RTK Query mutation hooks
  const [addCar] = useAddCarMutation();
  const [updateCar] = useUpdateCarMutation();
  const [deleteCar] = useDeleteCarMutation();
  
  // Show error toast if API request fails
  useEffect(() => {
    if (isCarError) {
      console.error('Error fetching car:', carError);
      setError(carError?.data?.message || 'Failed to load car data');
    }
  }, [isCarError, carError]);


  
  // Form state for new/edit car
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    rentalPricePerDay: '',
    isAvailable: true
  });
  
  // Update form data when car data is loaded
  useEffect(() => {
    if (car && id !== 'new') {
      setFormData({
        make: car.make || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        rentalPricePerDay: car.rentalPricePerDay || '',
        isAvailable: car.isAvailable !== undefined ? car.isAvailable : true,
        fuelType: car.fuelType || 'Gasoline',
        transmission: car.transmission || 'Automatic'
      });
    }
  }, [car, id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        rentalPricePerDay: parseFloat(formData.rentalPricePerDay)
      };
      
      if (id === 'new') {
        // Use RTK Query mutation to create car
        await addCar(carData).unwrap();
        toast.success('Car created successfully');
        navigate('/cars');
      } else {
        // Use RTK Query mutation to update car
        await updateCar({ id, ...carData }).unwrap();
        toast.success('Car updated successfully');
      }
    } catch (err) {
      console.error('Error saving car:', err);
      toast.error(err.data?.message || 'Failed to save car. Please try again.');
      setError('Failed to save car. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        // Use RTK Query mutation to delete car
        await deleteCar(id).unwrap();
        toast.success('Car deleted successfully');
        navigate('/cars');
      } catch (err) {
        console.error('Failed to delete car:', err);
        toast.error(err.data?.message || 'Failed to delete car. Please try again.');
        setError('Failed to delete car. Please try again.');
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <button 
          className="mt-2 text-primary hover:underline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  // Create a default car object for new car form
  const defaultCar = {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    vin: '',
    mileage: 0,
    dailyRate: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    status: 'Available',
    features: []
  };

  // Determine if we're loading
  const loading = id !== 'new' && (isLoadingCar || isLoadingRentals);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading car details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id === 'new' ? 'Add New Car' : `${car.year} ${car.make} ${car.model}`}
        </h1>
        {id !== 'new' && (
          <div className="flex space-x-2">
            <Link to={`/cars/${id}/edit`} className="btn-primary">
              Edit Car
            </Link>
            <button
              onClick={handleDelete}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              Delete Car
            </button>
          </div>
        )}
      </div>

      {id !== 'new' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Car Information Card */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Car Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-secondary-light text-sm">Make</p>
                    <p className="font-medium">{car.make}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Model</p>
                    <p className="font-medium">{car.model}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Year</p>
                    <p className="font-medium">{car.year}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Color</p>
                    <div className="flex items-center">
                      <span 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{ backgroundColor: car.color.toLowerCase() }}
                      ></span>
                      <p className="font-medium">{car.color}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">License Plate</p>
                    <p className="font-medium">{car.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">VIN</p>
                    <p className="font-medium">{car.vin}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Mileage</p>
                    <p className="font-medium">{car.mileage} miles</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Daily Rate</p>
                    <p className="font-medium">${car.dailyRate}/day</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Fuel Type</p>
                    <p className="font-medium">{car.fuelType}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Transmission</p>
                    <p className="font-medium">{car.transmission}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-secondary-light text-sm">Features</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {car.features && car.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-secondary-dark rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Car Status Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Car Status</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      car.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : car.status === 'Rented'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {car.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Total Rentals</span>
                    <span className="font-bold text-secondary-dark">{carRentals.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Revenue Generated</span>
                    <span className="font-bold text-secondary-dark">$650</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rental History */}
          <div className="card mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Rental History</h2>
              <Link to={`/rentals/new?carId=${car.id}`} className="btn-primary">
                New Rental
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Start Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">End Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carRentals.length > 0 ? (
                    carRentals.map(rental => (
                      <tr key={rental.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{rental.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{rental.customer}</td>
                        <td className="px-4 py-3 text-sm">{rental.startDate}</td>
                        <td className="px-4 py-3 text-sm">{rental.endDate}</td>
                        <td className="px-4 py-3 text-sm">{rental.amount}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            rental.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : rental.status === 'Upcoming'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rental.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link to={`/rentals/${rental.id}`} className="text-primary hover:underline">View</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-3 text-sm text-center">
                        No rental history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Make</label>
                <input 
                  type="text" 
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  className="input" 
                  placeholder="Enter make" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Model</label>
                <input 
                  type="text" 
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="input" 
                  placeholder="Enter model" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Year</label>
                <input 
                  type="number" 
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="input" 
                  placeholder="Enter year" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Rental Price Per Day ($)</label>
                <input 
                  type="number" 
                  name="rentalPricePerDay"
                  value={formData.rentalPricePerDay}
                  onChange={handleInputChange}
                  className="input" 
                  placeholder="Enter rental price per day" 
                  step="0.01"
                  required
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                  Available for rent
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Fuel Type</label>
                <select 
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="">Select fuel type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Transmission</label>
                <select 
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="">Select transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Rented">Rented</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Link to="/cars" className="btn bg-gray-300 text-secondary hover:bg-gray-400">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Car'
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default CarDetails;
