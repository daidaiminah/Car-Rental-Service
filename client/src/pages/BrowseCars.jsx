import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import carService from '../services/carService';
import { FaSearch, FaCar, FaGasPump, FaCog, FaUsers } from 'react-icons/fa';
import CarDetailModal from '../components/CarDetailModal';

const BrowseCars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    make: '',
    type: '',
    transmission: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await carService.getCars({
          status: 'available',
          ...filters
        });
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      make: '',
      type: '',
      transmission: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const openCarDetails = (car) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-dark mb-6">Browse Available Cars</h1>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="make" className="block text-sm font-medium text-secondary-dark mb-1">Make</label>
              <select
                id="make"
                name="make"
                value={filters.make}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Ford">Ford</option>
                <option value="BMW">BMW</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Audi">Audi</option>
                <option value="Nissan">Nissan</option>
                <option value="Hyundai">Hyundai</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-secondary-dark mb-1">Type</label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Types</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="coupe">Coupe</option>
                <option value="hatchback">Hatchback</option>
                <option value="convertible">Convertible</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="transmission" className="block text-sm font-medium text-secondary-dark mb-1">Transmission</label>
              <select
                id="transmission"
                name="transmission"
                value={filters.transmission}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Transmissions</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-secondary-dark mb-1">Min Price</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min $"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-secondary-dark mb-1">Max Price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max $"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-secondary hover:text-secondary-dark mr-2"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {}}
              className="btn-primary flex items-center gap-2"
            >
              <FaSearch />
              <span>Search</span>
            </button>
          </div>
        </div>
        
        {/* Cars Grid */}
        {cars.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FaCar className="mx-auto text-5xl text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-secondary-dark mb-2">No Cars Available</h2>
            <p className="text-secondary mb-4">
              No cars match your current filters. Try adjusting your search criteria.
            </p>
            <button
              onClick={resetFilters}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={car.image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                    <span className="text-white text-sm font-medium px-2 py-1 rounded bg-green-500">
                      Available Now
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-secondary-dark">{car.make} {car.model}</h3>
                  <p className="text-secondary text-sm">{car.year} • {car.location}</p>
                  
                  <div className="flex justify-between items-center mt-2 text-secondary text-sm">
                    <div className="flex items-center">
                      <FaUsers className="mr-1" />
                      <span>{car.seats} seats</span>
                    </div>
                    <div className="flex items-center">
                      <FaCog className="mr-1" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center">
                      <FaGasPump className="mr-1" />
                      <span>{car.fuelType}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-primary font-bold">${car.pricePerDay}/day</span>
                    <button 
                      onClick={() => openCarDetails(car)}
                      className="btn-primary-outline text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Car Detail Modal */}
      {showModal && selectedCar && (
        <CarDetailModal 
          car={selectedCar} 
          isOpen={showModal} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default BrowseCars;
