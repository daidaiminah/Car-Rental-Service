// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FiPlus, FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
// import CarCard from "../components/CarCard";
// import SearchAndFilter from "../components/SearchAndFilter";
// import HondaCivic from "../assets/images/2023hondacivic.jpg"

// // Mock data - replace with API call
// const mockCars = [
//   {
//     id: 1,
//     make: 'Toyota',
//     model: 'RAV4',
//     year: 2022,
//     pricePerDay: 85,
//     type: 'suv',
//     transmission: 'automatic',
//     seats: 5,
//     fuelType: 'hybrid',
//     images: ['https://images.unsplash.com/photo-1580273916551-e264ee7e7439?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'],
//     location: 'Nairobi, Kenya',
//     rating: 4.8,
//     reviews: 124,
//   },
//   {
//     id: 2,
//     make: 'Subaru',
//     model: 'Outback',
//     year: 2021,
//     pricePerDay: 75,
//     type: 'suv',
//     transmission: 'automatic',
//     seats: 5,
//     fuelType: 'petrol',
//     images: [HondaCivic],
//     location: 'Mombasa, Kenya',
//     rating: 4.7,
//     reviews: 98,
//   },
//   {
//     id: 3,
//     make: 'Honda',
//     model: 'Civic',
//     year: 2023,
//     pricePerDay: 65,
//     type: 'sedan',
//     transmission: 'automatic',
//     seats: 5,
//     fuelType: 'petrol',
//     images: [HondaCivic],
//     location: 'Nakuru, Kenya',
//     rating: 4.6,
//     reviews: 112,
//   },
//   {
//     id: 4,
//     make: 'Land Rover',
//     model: 'Defender',
//     year: 2022,
//     pricePerDay: 150,
//     type: 'suv',
//     transmission: 'automatic',
//     seats: 7,
//     fuelType: 'diesel',
//     images: ['https://images.unsplash.com/photo-1583121274602-3e2820c6988f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'],
//     location: 'Nairobi, Kenya',
//     rating: 4.9,
//     reviews: 87,
//   },
//   {
//     id: 5,
//     make: 'Toyota',
//     model: 'Hiace',
//     year: 2021,
//     pricePerDay: 90,
//     type: 'van',
//     transmission: 'manual',
//     seats: 14,
//     fuelType: 'diesel',
//     images: ['https://images.unsplash.com/photo-1605559421019-8decf322039d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'],
//     location: 'Kisumu, Kenya',
//     rating: 4.5,
//     reviews: 76,
//   },
//   {
//     id: 6,
//     make: 'Mazda',
//     model: 'CX-5',
//     year: 2023,
//     pricePerDay: 80,
//     type: 'suv',
//     transmission: 'automatic',
//     seats: 5,
//     fuelType: 'petrol',
//     images: ['https://images.unsplash.com/photo-1554744512-d6c603f4b46b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'],
//     location: 'Eldoret, Kenya',
//     rating: 4.7,
//     reviews: 92,
//   },
// ];

// const Dashboard = () => {
//   const [cars, setCars] = useState([]);
//   const [filteredCars, setFilteredCars] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     searchQuery: '',
//     minPrice: '',
//     maxPrice: '',
//     carType: '',
//     transmission: '',
//     seats: ''
//   });

//   // Simulate API call to fetch cars
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCars(mockCars);
//       setFilteredCars(mockCars);
//       setIsLoading(false);
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   // Handle search
//   const handleSearch = (query) => {
//     const newFilters = { ...filters, searchQuery: query };
//     setFilters(newFilters);
//     applyFilters(newFilters);
//   };

//   // Handle filter changes
//   const handleFilterChange = (filterName, value) => {
//     const newFilters = { ...filters, [filterName]: value };
//     setFilters(newFilters);
//     applyFilters(newFilters);
//   };

//   // Apply all filters
//   const applyFilters = (activeFilters) => {
//     let results = [...cars];

//     // Apply search query filter
//     if (activeFilters.searchQuery) {
//       const query = activeFilters.searchQuery.toLowerCase();
//       results = results.filter(
//         car =>
//           car.make.toLowerCase().includes(query) ||
//           car.model.toLowerCase().includes(query) ||
//           car.type.toLowerCase().includes(query)
//       );
//     }

//     // Apply price range filter
//     if (activeFilters.minPrice) {
//       results = results.filter(car => car.pricePerDay >= Number(activeFilters.minPrice));
//     }
//     if (activeFilters.maxPrice) {
//       results = results.filter(car => car.pricePerDay <= Number(activeFilters.maxPrice));
//     }

//     // Apply car type filter
//     if (activeFilters.carType) {
//       results = results.filter(car => car.type === activeFilters.carType);
//     }

//     // Apply transmission filter
//     if (activeFilters.transmission) {
//       results = results.filter(car => car.transmission === activeFilters.transmission);
//     }

//     // Apply seats filter
//     if (activeFilters.seats) {
//       results = results.filter(car => car.seats >= Number(activeFilters.seats));
//     }

//     setFilteredCars(results);
//   };

//   // Get unique car types for filter
//   const carTypes = [...new Set(mockCars.map(car => car.type))];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section with Search */}
//       <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">Find the perfect car for your next adventure</h1>
//             <p className="text-xl text-blue-100 max-w-3xl mx-auto">
//               Choose from a wide range of cars at competitive prices. Book online in just a few clicks!
//             </p>
//           </div>
          
//           {/* Search and Filter */}
//           <div className="mt-10 max-w-5xl mx-auto">
//             <SearchAndFilter 
//               onSearch={handleSearch} 
//               onFilterChange={handleFilterChange}
//               filters={filters}
//               carTypes={carTypes}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Stats Section */}
//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               { title: "Wide Selection", description: "100+ cars to choose from" },
//               { title: "Best Prices", description: "Competitive daily rates" },
//               { title: "24/7 Support", description: "We're always here to help" },
//               { title: "Easy Booking", description: "Simple and fast process" }
//             ].map((stat, index) => (
//               <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//                 <h3 className="text-lg font-semibold text-gray-900">{stat.title}</h3>
//                 <p className="mt-2 text-gray-600">{stat.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Car Listings */}
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">Available Cars</h2>
//             <div className="text-sm text-gray-500">
//               {filteredCars.length} {filteredCars.length === 1 ? 'car' : 'cars'} available
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[1, 2, 3].map((i) => (
//                 <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
//                   <div className="h-48 bg-gray-200 animate-pulse"></div>
//                   <div className="p-4">
//                     <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
//                     <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
//                     <div className="h-10 bg-blue-600 rounded-lg w-full animate-pulse"></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : filteredCars.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredCars.map((car) => (
//                 <CarCard key={car.id} car={car} />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-lg font-medium text-gray-900">No cars found</h3>
//               <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
//               <div className="mt-6">
//                 <button
//                   onClick={() => {
//                     setFilters({
//                       searchQuery: '',
//                       minPrice: '',
//                       maxPrice: '',
//                       carType: '',
//                       transmission: '',
//                       seats: ''
//                     });
//                     setFilteredCars(cars);
//                   }}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Clear all filters
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
