import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Rentals from './pages/Rentals';
import RentalDetails from './pages/RentalDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetails />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="rentals/:id" element={<RentalDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
