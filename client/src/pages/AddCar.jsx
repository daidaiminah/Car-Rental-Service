import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiUpload, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAddCarMutation } from '../store/features/cars/carsApiSlice';
import { selectCurrentUser } from '../store/features/auth/authSlice';

const AddCar = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
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
    image: '',
    status: 'available'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log('File selected:', file); // Debug log
    
    if (!file) {
      console.log('No file selected');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      console.log('File too large:', file.size);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Store the file object for later upload
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('Selected file:', selectedFile);
    
    if (!selectedFile) {
      toast.error('Please select an image');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate required fields with better labels
    const requiredFields = [
      { field: 'make', label: 'Make' },
      { field: 'model', label: 'Model' },
      { field: 'year', label: 'Year' },
      { field: 'pricePerDay', label: 'Price per day' },
      { field: 'type', label: 'Type' },
      { field: 'transmission', label: 'Transmission' },
      { field: 'seats', label: 'Number of seats' },
      { field: 'fuelType', label: 'Fuel type' }
    ];
    
    const missingFields = requiredFields
      .filter(({ field }) => !carData[field])
      .map(({ label }) => label);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate year is a number and reasonable (1900-current year + 1)
    const currentYear = new Date().getFullYear();
    if (isNaN(carData.year) || carData.year < 1900 || carData.year > currentYear + 1) {
      toast.error(`Please enter a valid year between 1900 and ${currentYear + 1}`);
      return;
    }

    // Validate price is a positive number
    if (isNaN(carData.pricePerDay) || parseFloat(carData.pricePerDay) <= 0) {
      toast.error('Please enter a valid price per day (must be greater than 0)');
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append all car data fields
      Object.entries(carData).forEach(([key, value]) => {
        // Skip empty values to avoid sending undefined or null
        if (value !== undefined && value !== null && value !== '') {
          formData.append(key, value);
          console.log(`Added to formData: ${key} =`, value);
        }
      });
      
      // Append the file
      formData.append('image', selectedFile);
      console.log('Added image to formData:', selectedFile.name, '(', selectedFile.size, 'bytes )');
      
      // Add owner information
      if (user) {
        formData.append('ownerId', user.id);
        formData.append('owner', user.name || 'Car Owner');
        console.log('Added owner info - ID:', user.id, 'Name:', user.name);
      }
      
      // Add default values for required fields if not provided
      if (!formData.has('isAvailable')) {
        formData.append('isAvailable', 'true');
        console.log('Added default isAvailable: true');
      }
      
      // Convert pricePerDay to rentalPricePerDay for the server
      if (formData.has('pricePerDay') && !formData.has('rentalPricePerDay')) {
        const price = formData.get('pricePerDay');
        formData.append('rentalPricePerDay', price);
        console.log('Mapped pricePerDay to rentalPricePerDay:', price);
      }
      
      // Debug: Log form data before sending
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      // Create car using RTK Query mutation with FormData
      console.log('Sending request to server...');
      const result = await addCar(formData).unwrap();
      
      console.log('Server response:', result);
      toast.success('Car added successfully!');
      navigate('/owner');
    } catch (error) {
      console.error('Error adding car:', error);
      console.error('Error details:', {
        status: error.status,
        data: error.data,
        message: error.message,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to add car. Please try again.';
      
      if (error.status === 413) {
        errorMessage = 'The image file is too large. Please use an image smaller than 5MB.';
      } else if (error.data) {
        if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        } else if (error.data.error) {
          errorMessage = error.data.error;
        }
      } else if (error.error) {
        errorMessage = error.error;
      }
      
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
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Car</h1>
          
          <form onSubmit={handleSubmit}>
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="luxury">Luxury</option>
                  <option value="economy">Economy</option>
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              ></textarea>
            </div>
            
            {/* Car Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                {imagePreview ? (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Car preview"
                      className="mx-auto h-48 w-auto object-cover mb-4"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setCarData(prev => ({ ...prev, image: '' }));
                      }}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                          onClick={(e) => e.target.value = null} // Allow re-selecting the same file
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mr-4 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
