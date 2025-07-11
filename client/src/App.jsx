import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import RenterDashboard from './pages/RenterDashboard';
import Customers from './pages/Customers';
import CustomerDetails from './pages/CustomerDetails';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import Rentals from './pages/Rentals';
import RentalDetails from './pages/RentalDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';

// Dashboard pages
import MyCars from './pages/MyCars';
import MyRentals from './pages/MyRentals';
import BrowseCars from './pages/BrowseCars';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AddCar from './pages/AddCar';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, loading, user } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user?.role === 'owner') {
    return <Navigate to="/owner-dashboard" replace />;
  } else {
    return <Navigate to="/renter-dashboard" replace />;
  }
};

function AppContent() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<div>About Us - Public View</div>} />
        <Route path="contact" element={<div>Contact Us - Public View</div>} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetails />} />
      </Route>
      
      {/* Admin routes - separate from public routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route 
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="customers" 
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="customers/:id" 
          element={
            <ProtectedRoute>
              <CustomerDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="cars" 
          element={
            <ProtectedRoute>
              <Navigate to="/admin" replace />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="cars/:id" 
          element={
            <ProtectedRoute>
              <CarDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="rentals" 
          element={
            <ProtectedRoute>
              <Rentals />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="rentals/:id" 
          element={
            <ProtectedRoute>
              <RentalDetails />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Role-specific dashboards */}
      {/* Owner Dashboard Routes */}
      <Route path="/owner-dashboard" element={
        <ProtectedRoute requiredRole="owner">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<OwnerDashboard />} />
        <Route path="my-cars" element={<MyCars />} />
        <Route path="my-rentals" element={<MyRentals />} />
      </Route>
      
      {/* Add Car Route */}
      <Route path="/add-car" element={
        <ProtectedRoute requiredRole="owner">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AddCar />} />
      </Route>
      
      {/* Renter Dashboard Routes */}
      <Route path="/renter-dashboard" element={
        <ProtectedRoute requiredRole="customer">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<RenterDashboard />} />
        <Route path="browse-cars" element={<BrowseCars />} />
        <Route path="my-bookings" element={<MyBookings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      
      {/* Standalone Dashboard Routes */}
      <Route path="/browse-cars" element={
        <ProtectedRoute requiredRole="customer">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<BrowseCars />} />
      </Route>
      
      <Route path="/my-bookings" element={
        <ProtectedRoute requiredRole="customer">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<MyBookings />} />
      </Route>
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Profile />} />
      </Route>
      
      <Route path="/my-cars" element={
        <ProtectedRoute requiredRole="owner">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<MyCars />} />
      </Route>
      
      <Route path="/my-rentals" element={
        <ProtectedRoute requiredRole="owner">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<MyRentals />} />
      </Route>
      
      {/* Dashboard redirect based on role */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RoleBasedRedirect />
        </ProtectedRoute>
      } />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* 404 - Keep at the end */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
