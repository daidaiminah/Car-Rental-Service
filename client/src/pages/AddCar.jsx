import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAddCarMutation } from '../store/features/cars/carsApiSlice';
import { selectCurrentUser } from '../store/features/auth/authSlice';
import ImageUploader from '../components/ImageUploader';

const AddCar = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [imageData, setImageData] = useState({ url: '', publicId: '' });
  
  // Use RTK Query mutation hook
  const [addCar, { isLoading }] = useAddCarMutation();
  
  const [carData, setCarData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'sedan',
    transmission: 'automatic',
    fuelType: 'gasoline',
    seats: 5,
    pricePerDay: '',
    location: '',
    description: '',
    status: 'available'
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageData.url) {
      toast.error('Please upload a car image');
      return;
    }
    // Validate required fields
    const requiredFields = [
      { field: 'make', label: 'Make' },
      { field: 'model', label: 'Model' },
      { field: 'year', label: 'Year' },
      { field: 'pricePerDay', label: 'Price per day' }
    ];
    
    const missingFields = requiredFields
      .filter(({ field }) => !carData[field])
      .map(({ label }) => label);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
    try {
      const formData = new FormData();
      
      // Append all car data
      Object.entries({
        ...carData,
        imageUrl: imageData.url,
        imagePublicId: imageData.publicId,
        ownerId: user?.id
      }).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
        }
      });
      
      const result = await addCar(formData).unwrap();
      toast.success('Car added successfully!');
      navigate('/owner');
    } catch (error) {
      console.error('Error adding car:', error);
      const errorMessage = error.data?.message || 'Failed to add car. Please try again.';
      toast.error(errorMessage);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Car</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Car Make */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  name="make"
                  value={carData.make}
                  onChange={handleInputChange}
                  placeholder="e.g. Toyota, Honda"
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              {/* Car Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={carData.model}
                  onChange={handleInputChange}
                  placeholder="e.g. Camry, Civic"
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              {/* Car Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={carData.year}
                  onChange={handleInputChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              {/* Car Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={carData.type}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="sports">Sports</option>
                  <option value="luxury">Luxury</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
              
              {/* Transmission */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={carData.transmission}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              
              {/* Fuel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={carData.fuelType}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              
              {/* Seats */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  value={carData.seats}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              {/* Price Per Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Day ($)
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={carData.pricePerDay}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  placeholder="e.g. 50.00"
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={carData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. Monrovia, Liberia"
                  className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={carData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Describe your car's features, condition, etc."
                className="block w-full rounded-md border-gray-300 focus:border-primary focus:ring-primary"
              ></textarea>
            </div>
            
            {/* Car Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Car Image
              </label>
              <ImageUploader
                onUpload={setImageData}
                existingImage={imageData.url}
                folder="car-rental"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isLoading ? 'Adding...' : 'Add Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddCar;