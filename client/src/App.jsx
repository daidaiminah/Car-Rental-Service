import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/authContext.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/SocketContext.jsx';

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
import ScrollToTop from './components/ScrollToTop';

// Dashboard pages
import MyCars from './pages/MyCars';
import MyRentals from './pages/MyRentals';
import BrowseCars from './pages/BrowseCars';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import FAQ from './pages/FAQ';
import SocialMedia from './pages/SocialMedia';
import SafetySupport from './pages/SafetySupport';
import Settings from './pages/Settings';
import OwnerEarnings from './pages/owner/Earnings';
import RenterWishlist from './pages/renter/Wishlist';
import RenterPayments from './pages/renter/Payments';
import AdminReports from './pages/admin/Reports';
import PaymentPage from './pages/payment/PaymentPage';
import PaymentSuccess from './pages/payment/PaymentSuccess';
import ReviewsPage from './pages/reviews';
import BookingSuccess from './pages/BookingSuccess';
import BookingCancel from './pages/BookingCancel';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

/**
 * Role-based redirect component
 * Redirects users to their respective dashboards based on their role
 */
const RoleBasedRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user?.role === 'owner') {
    return <Navigate to="/owner" replace />;
  } else {
    // Default to renter dashboard for customers and any other roles
    return <Navigate to="/renter" replace />;
  }
};

// Component to handle scroll to top on route change
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function AppContent() {
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ScrollToTopOnRouteChange />
      <ScrollToTop />
      <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="services" element={<Services />} />
        <Route path="terms" element={<TermsOfService />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="social" element={<SocialMedia />} />
        <Route path="safety" element={<SafetySupport />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetails />} />
        <Route path="booking-success" element={<BookingSuccess />} />
        <Route path="booking-cancel" element={<BookingCancel />} />
      </Route>

      {/* ============================================
          1. ADMIN DASHBOARD ROUTES (/admin/...)
          ============================================ */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="cars" element={<Navigate to="/admin" replace />} />
        <Route path="cars/:id" element={<CarDetails />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="rentals/:id" element={<RentalDetails />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<SafetySupport />} />
      </Route>

      {/* ============================================
          2. OWNER DASHBOARD ROUTES (/owner/...)
          ============================================ */}
      <Route path="/owner" element={
        <ProtectedRoute requiredRole="owner">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<OwnerDashboard />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="cars" element={<MyCars />} />
        <Route path="add_cars" element={<AddCar />} />
        <Route path="cars/:id/edit" element={<EditCar />} />
        <Route path="cars/:id" element={<CarDetails />} />
        <Route path="rentals" element={<MyRentals />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<SafetySupport />} />
        <Route path="earnings" element={<OwnerEarnings />} />
      </Route>

      {/* ============================================
          3. RENTER DASHBOARD ROUTES (/renter/...)
          ============================================ */}
      <Route path="/renter" element={
        <ProtectedRoute requiredRole="customer">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<RenterDashboard />} />
        <Route path="browse" element={<BrowseCars />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<SafetySupport />} />
        <Route path="wishlist" element={<RenterWishlist />} />
        <Route path="payments" element={<RenterPayments />} />
        <Route path="reviews" element={ <ReviewsPage />} />
        <Route path="payments/rental/:rentalId" element={<PaymentPage />} />
        <Route path="payments/success/:rentalId" element={<PaymentSuccess />} />
      </Route>
      
      
      {/* Dashboard redirect based on role */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <RoleBasedRedirect />
        </ProtectedRoute>
      } />
      
      {/* Booking flow routes */}
      <Route path="/edit-car/:id" element={
        <ProtectedRoute requiredRole="owner">
          <EditCar />
        </ProtectedRoute>
      } />
      {/* Auth routes */}
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* 404 - Keep at the end */}
      <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
          <ScrollToTop />
        </SocketProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
 
