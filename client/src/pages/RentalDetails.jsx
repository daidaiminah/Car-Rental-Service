import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  useGetRentalByIdQuery,
  useCreateRentalMutation,
  useUpdateRentalMutation,
  useDeleteRentalMutation
} from '../store/features/rentals/rentalsApiSlice';
import { 
  useGetCarsQuery,
  useGetCarByIdQuery 
} from '../store/features/cars/carsApiSlice';
import { 
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery 
} from '../store/features/customers/customersApiSlice';

const RentalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const carId = searchParams.get('carId');
  
  const [error, setError] = useState(null);
  const isNewRental = id === 'new';

  // RTK Query hooks
  const { 
    data: availableCarsData = [], 
    isLoading: availableCarsLoading 
  } = useGetCarsQuery({ status: 'available' });
  
  const { 
    data: customersData = [], 
    isLoading: customersLoading 
  } = useGetAllCustomersQuery();
  
  // Only fetch rental data if we're not creating a new rental
  const { 
    data: rentalData, 
    isLoading: rentalLoading,
    isError: isRentalError,
    error: rentalError
  } = useGetRentalByIdQuery(id, { 
    skip: isNewRental 
  });

  // Fetch car and customer details if we have a rental
  const { 
    data: carData,
    isLoading: carLoading
  } = useGetCarByIdQuery(rentalData?.carId, { 
    skip: isNewRental || !rentalData?.carId 
  });
  
  const { 
    data: customerData,
    isLoading: customerLoading
  } = useGetCustomerByIdQuery(rentalData?.customerId, { 
    skip: isNewRental || !rentalData?.customerId 
  });

  // Mutations for create, update, delete
  const [createRental, { isLoading: isCreating }] = useCreateRentalMutation();
  const [updateRental, { isLoading: isUpdating }] = useUpdateRentalMutation();
  const [deleteRental, { isLoading: isDeleting }] = useDeleteRentalMutation();

  // Format cars for display in select dropdown
  const availableCars = availableCarsData.map(car => ({
    id: car.id,
    name: `${car.make} ${car.model} (${car.year})`,
    dailyRate: car.dailyRate
  }));
  
  // Format customers for display in select dropdown
  const customers = customersData.map(customer => ({
    id: customer.id,
    name: customer.name
  }));

  // Determine if any data is still loading
  const loading = availableCarsLoading || 
                 customersLoading || 
                 (!isNewRental && (rentalLoading || carLoading || customerLoading));

  const isSubmitting = isCreating || isUpdating || isDeleting;

  // Combine rental, car and customer data
  const rental = isNewRental ? {
    customerId: customerId ? parseInt(customerId) : '',
    carId: carId ? parseInt(carId) : '',
    startDate: '',
    endDate: '',
    status: 'Upcoming',
    notes: ''
  } : rentalData && carData && customerData ? {
    ...rentalData,
    customerName: customerData.name,
    carName: `${carData.make} ${carData.model} (${carData.year})`,
    dailyRate: carData.dailyRate,
    // Calculate total amount based on days and rate
    totalAmount: calculateNumberOfDays(rentalData.startDate, rentalData.endDate) * carData.dailyRate
  } : null;

  // Handle errors
  useEffect(() => {
    if (isRentalError) {
      console.error('Error fetching rental data:', rentalError);
      setError('Failed to load rental data');
    }
  }, [isRentalError, rentalError]);

  // Form state for new/edit rental
  const [formData, setFormData] = useState({
    customerId: '',
    carId: '',
    startDate: '',
    endDate: ''
  });
  
  // State to track selected car's daily rate
  const [dailyRate, setDailyRate] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Update form data when rental data is loaded
  useEffect(() => {
    if (rental) {
      setFormData({
        customerId: rental.customerId || '',
        carId: rental.carId || '',
        startDate: rental.startDate || '',
        endDate: rental.endDate || ''
      });
      
      if (rental.dailyRate) {
        setDailyRate(rental.dailyRate);
      }
      
      if (rental.startDate && rental.endDate && rental.dailyRate) {
        const days = calculateNumberOfDays(rental.startDate, rental.endDate);
        setTotalCost(days * rental.dailyRate);
      }
    }
  }, [rental]);
  
  // Calculate total cost when dates or car changes
  useEffect(() => {
    if (formData.startDate && formData.endDate && dailyRate > 0) {
      const days = calculateNumberOfDays(formData.startDate, formData.endDate);
      setTotalCost(days * dailyRate);
    } else {
      setTotalCost(0);
    }
  }, [formData.startDate, formData.endDate, dailyRate]);
  
  // Update daily rate when car is selected
  const handleCarChange = (e) => {
    const selectedCarId = e.target.value;
    const selectedCar = availableCars.find(car => car.id === parseInt(selectedCarId));
    
    setFormData({
      ...formData,
      carId: selectedCarId
    });
    
    if (selectedCar) {
      setDailyRate(selectedCar.dailyRate);
    } else {
      setDailyRate(0);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare rental data
      const rentalData = {
        customerId: parseInt(formData.customerId),
        carId: parseInt(formData.carId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalCost: totalCost
      };
      
      if (id === 'new') {
        await createRental(rentalData).unwrap();
        toast.success('Rental created successfully');
        navigate('/rentals');
      } else {
        await updateRental({ id, ...rentalData }).unwrap();
        toast.success('Rental updated successfully');
      }
    } catch (err) {
      console.error('Error saving rental:', err);
      toast.error('Failed to save rental. Please try again.');
      setError('Failed to save rental. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this rental?')) {
      try {
        await deleteRental(id).unwrap();
        toast.success('Rental deleted successfully');
        navigate('/rentals');
      } catch (err) {
        console.error('Failed to delete rental:', err);
        toast.error('Failed to delete rental. Please try again.');
        setError('Failed to delete rental. Please try again.');
      }
    }
  };

  const calculateNumberOfDays = (start, end) => {
    if (!start || !end) return 0;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return daysDiff > 0 ? daysDiff : 0;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading rental details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id === 'new' ? 'Create New Rental' : `Rental #${rental.id}`}
        </h1>
        {id !== 'new' && (
          <div className="flex space-x-2">
            <Link to={`/rentals/${id}/edit`} className="btn-primary">
              Edit Rental
            </Link>
            <button
              onClick={handleDelete}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              Delete Rental
            </button>
          </div>
        )}
      </div>

      {id !== 'new' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rental Information Card */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Rental Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-secondary-light text-sm">Customer</p>
                    <Link to={`/customers/${rental.customerId}`} className="text-primary hover:underline">
                      {rental.customerName}
                    </Link>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Car</p>
                    <Link to={`/cars/${rental.carId}`} className="text-primary hover:underline">
                      {rental.carName}
                    </Link>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Start Date</p>
                    <p className="font-medium">{rental.startDate}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">End Date</p>
                    <p className="font-medium">{rental.endDate}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Daily Rate</p>
                    <p className="font-medium">${rental.dailyRate}/day</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Total Amount</p>
                    <p className="font-medium">${rental.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Status</p>
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
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Number of Days</p>
                    <p className="font-medium">{calculateNumberOfDays(rental.startDate, rental.endDate)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-secondary-light text-sm">Notes</p>
                    <p className="font-medium">{rental.notes || 'No notes'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Payment Status</span>
                    <span className="font-bold text-secondary-dark">{rental.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Payment Method</span>
                    <span className="font-bold text-secondary-dark">{rental.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Total Amount</span>
                    <span className="font-bold text-secondary-dark">${rental.totalAmount}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button className="btn-primary w-full">
                    {rental.paymentStatus === 'Paid' ? 'Print Receipt' : 'Process Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Customer</label>
                <select 
                  className="input"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(customer => (
                    <option 
                      key={customer.id} 
                      value={customer.id}
                    >
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Car</label>
                <select 
                  className="input"
                  name="carId"
                  value={formData.carId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Car</option>
                  {availableCars.map(car => (
                    <option 
                      key={car.id} 
                      value={car.id}
                    >
                      {car.name} - ${car.dailyRate}/day
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Start Date</label>
                <input 
                  type="date" 
                  className="input" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">End Date</label>
                <input 
                  type="date" 
                  className="input" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-secondary-light mb-1">Notes</label>
                <textarea 
                  className="input h-32" 
                  placeholder="Enter any additional notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Link to="/rentals" className="btn bg-gray-300 text-secondary hover:bg-gray-400">
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
                    {id === 'new' ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  id === 'new' ? 'Create Rental' : 'Save Rental'
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

export default RentalDetails;
