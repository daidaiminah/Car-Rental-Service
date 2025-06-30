import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carService from '../services/carService.js';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cars from the API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await carService.getAllCars();
        
        // Ensure we have a valid array before setting state
        if (Array.isArray(data)) {
          setCars(data);
          setError(null);
        } else {
          console.error('Invalid cars data format:', data);
          setError('Received invalid data format from server');
          setCars([]);
        }
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setError('Failed to fetch cars. Please try again.');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);



  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Filter cars based on search term and status filter
  const filteredCars = Array.isArray(cars) ? cars.filter(car => {
    if (!car) return false;
    
    const searchTermLower = searchTerm.toLowerCase();
    const make = car.make ? car.make.toLowerCase() : '';
    const model = car.model ? car.model.toLowerCase() : '';
    const year = car.year ? car.year.toString() : '';
    
    const matchesSearch = 
      make.includes(searchTermLower) || 
      model.includes(searchTermLower) ||
      year.includes(searchTerm);
      
    const matchesStatus = statusFilter === '' || car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await carService.deleteCar(id);
        // Update local state after successful API call
        setCars(cars.filter(car => car.id !== id));
      } catch (err) {
        console.error('Failed to delete car:', err);
        alert('Failed to delete car. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Cars</h1>
        <Link to="/cars/new" className="btn-primary">
          Add Car
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search cars..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="w-full md:w-48">
            <select 
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading/Error State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading cars...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            className="mt-2 text-primary hover:underline"
            onClick={() => {
              setError(null);
              // Re-fetch cars
              const fetchCars = async () => {
                try {
                  setLoading(true);
                  const data = await carService.getAllCars();
                  setCars(data);
                  setError(null);
                } catch (err) {
                  console.error('Failed to fetch cars:', err);
                  setError('Failed to fetch cars. Please try again.');
                } finally {
                  setLoading(false);
                }
              };
              fetchCars();
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Cars List */}
      {!loading && !error && <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Make</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Model</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Year</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Color</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Daily Rate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <tr key={car.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{car.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{car.make}</td>
                    <td className="px-4 py-3 text-sm">{car.model}</td>
                    <td className="px-4 py-3 text-sm">{car.year}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <span 
                          className="w-4 h-4 rounded-full mr-2" 
                          style={{ backgroundColor: car.color.toLowerCase() }}
                        ></span>
                        {car.color}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">${car.dailyRate}/day</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        car.status === 'Available' 
                          ? 'bg-green-100 text-green-800' 
                          : car.status === 'Rented'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <Link to={`/cars/${car.id}`} className="text-primary hover:underline">View</Link>
                        <Link to={`/cars/${car.id}/edit`} className="text-secondary hover:underline">Edit</Link>
                        <button 
                          onClick={() => handleDelete(car.id)} 
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-sm text-center">
                    No cars found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>}
    </div>
  );
};

export default Cars;
