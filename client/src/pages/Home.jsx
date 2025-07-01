import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiClock, FiSearch, FiStar, FiChevronRight } from 'react-icons/fi';
import CarCard from "../components/CarCard";
import HondaCar from '../assets/images/2023hondacivic.jpg'

const featuredCars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'RAV4',
    year: 2022,
    pricePerDay: 85,
    type: 'suv',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'hybrid',
    rating: 4.8,
    reviews: 124,
    location: 'Douala, Liberia',
    image: HondaCar,
  },
  {
    id: 2,
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    pricePerDay: 89,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.8,
    reviews: 215,
    location: 'New York, USA',
    image: HondaCar,
  },
  {
    id: 3,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    pricePerDay: 95,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.7,
    reviews: 198,
    location: 'Los Angeles, USA',
    image: HondaCar,
  },
  {
    id: 4,
    make: 'Audi',
    model: 'A4',
    year: 2023,
    pricePerDay: 92,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.6,
    reviews: 176,
    location: 'Chicago, USA',
    image: HondaCar,
  },
  {
    id: 5,
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    pricePerDay: 100,
    type: 'electric',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'electric',
    rating: 4.9,
    reviews: 423,
    location: 'San Francisco, USA',
    image: HondaCar,
  },
  {
    id: 6,
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    pricePerDay: 65,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.5,
    reviews: 287,
    location: 'Dallas, USA',
    image: HondaCar,
  },
  {
    id: 7,
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    pricePerDay: 63,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.4,
    reviews: 187,
    location: 'Los Angeles, USA',
    image: HondaCar,
  },
  {
    id: 8,
    make: 'Ford',
    model: 'Mustang',
    year: 2023,
    pricePerDay: 120,
    type: 'sports',
    transmission: 'manual',
    seats: 4,
    fuelType: 'gasoline',
    rating: 4.8,
    reviews: 312,
    location: 'Miami, USA',
    image: HondaCar,
  },
  {
    id: 9,
    make: 'Chevrolet',
    model: 'Camaro',
    year: 2023,
    pricePerDay: 115,
    type: 'sports',
    transmission: 'automatic',
    seats: 4,
    fuelType: 'gasoline',
    rating: 4.7,
    reviews: 234,
    location: 'Denver, USA',
    image: HondaCar,
  },
  {
    id: 10,
    make: 'Nissan',
    model: 'Altima',
    year: 2023,
    pricePerDay: 60,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.2,
    reviews: 156,
    location: 'Seattle, USA',
    image: HondaCar,
  },
  {
    id: 11,
    make: 'Hyundai',
    model: 'Sonata',
    year: 2023,
    pricePerDay: 58,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.3,
    reviews: 201,
    location: 'Boston, USA',
    image: HondaCar,
  },
  {
    id: 12,
    make: 'Kia',
    model: 'Stinger',
    year: 2023,
    pricePerDay: 85,
    type: 'sports',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.4,
    reviews: 189,
    location: 'Washington, USA',
    image: HondaCar,
  },
  {
    id: 13,
    make: 'Mazda',
    model: '6',
    year: 2023,
    pricePerDay: 59,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.3,
    reviews: 173,
    location: 'Phoenix, USA',
    image: HondaCar,
  },
  {
    id: 14,
    make: 'Volkswagen',
    model: 'Passat',
    year: 2023,
    pricePerDay: 62,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.2,
    reviews: 145,
    location: 'Minneapolis, USA',
    image: HondaCar,
  },
  {
    id: 15,
    make: 'Subaru',
    model: 'Legacy',
    year: 2023,
    pricePerDay: 61,
    type: 'sedan',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.3,
    reviews: 169,
    location: 'Portland, USA',
    image: HondaCar,
  },
  {
    id: 16,
    make: 'Lexus',
    model: 'IS',
    year: 2023,
    pricePerDay: 90,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.6,
    reviews: 219,
    location: 'San Diego, USA',
    image: HondaCar,
  },
  {
    id: 17,
    make: 'Infiniti',
    model: 'Q50',
    year: 2023,
    pricePerDay: 88,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.5,
    reviews: 206,
    location: 'Tampa, USA',
    image: HondaCar,
  },
  {
    id: 18,
    make: 'Genesis',
    model: 'G70',
    year: 2023,
    pricePerDay: 87,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.5,
    reviews: 194,
    location: 'Austin, USA',
    image: HondaCar,
  },
  {
    id: 19,
    make: 'Acura',
    model: 'TLX',
    year: 2023,
    pricePerDay: 86,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.4,
    reviews: 182,
    location: 'Nashville, USA',
    image: HondaCar,
  },
  {
    id: 20,
    make: 'Jaguar',
    model: 'XE',
    year: 2023,
    pricePerDay: 95,
    type: 'luxury',
    transmission: 'automatic',
    seats: 5,
    fuelType: 'gasoline',
    rating: 4.6,
    reviews: 228,
    location: 'Orlando, USA',
    image: HondaCar,
  },
];

export default function Home() {
  const [location, setLocation] = useState('New York, USA');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [selectedCar, setSelectedCar] = useState('');

  const [filteredCars, setFilteredCars] = useState(featuredCars);

  // Apply all filters
  const applyFilters = (activeFilters) => {
    let results = [...featuredCars];

    // Apply search query filter
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      results = results.filter(car => 
        (car.make && car.make.toLowerCase().includes(query)) ||
        (car.model && car.model.toLowerCase().includes(query)) ||
        (car.type && car.type.toLowerCase().includes(query))
      );
    }

    // Apply price range filter
    if (activeFilters.minPrice) {
      results = results.filter(car => car.pricePerDay >= Number(activeFilters.minPrice));
    }
    if (activeFilters.maxPrice) {
      results = results.filter(car => car.pricePerDay <= Number(activeFilters.maxPrice));
    }

    // Apply car type filter
    if (activeFilters.carType) {
      results = results.filter(car => car.type === activeFilters.carType);
    }

    // Apply transmission filter
    if (activeFilters.transmission) {
      results = results.filter(car => car.transmission === activeFilters.transmission);
    }

    // Apply seats filter
    if (activeFilters.seats) {
      results = results.filter(car => car.seats >= Number(activeFilters.seats));
    }

    // Apply rating filter
    if (activeFilters.rating) {
      results = results.filter(car => car.rating >= Number(activeFilters.rating));
    }

    setFilteredCars(results);
  };

  // Get unique car types for filter
  const carTypes = [...new Set(featuredCars.map(car => car.type))];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: `url(${HondaCar})`
            }}
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find the perfect car for your next adventure
              </h1>
              <p className="mt-6 text-xl text-gray-300">
                Choose from a wide selection of vehicles to suit your needs and budget.
              </p>
              
              {/* Search Form */}
              <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="button"
                      className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center justify-center"
                    >
                      <FiSearch className="mr-2" />
                      Search Cars
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Featured Cars Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Cars</h2>
            <Link to="/cars" className="text-primary hover:text-primary-dark flex items-center">
              View all <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
  
        {/* Call to Action */}
        <div className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold mb-4">Ready to hit the road?</h2>
            <p className="text-xl mb-8">Find the perfect car for your next adventure</p>
            <Link
              to="/cars"
              className="inline-block bg-white text-primary font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors"
            >
              Browse All Cars
            </Link>
          </div>
        </div>
    </div>
  );
}
