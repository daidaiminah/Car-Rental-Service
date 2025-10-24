import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiLogIn, FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { useLoginMutation } from "../store/features/auth/authApiSlice";
import { setCredentials } from '../store/features/auth/authSlice';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  // Map userType to role for the backend
  const userTypeToRole = {
    'rent': 'customer',
    'owner': 'owner'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate role selection
    if (!userType) {
      toast.error('Please select what you want to do');
      return;
    }
    
    // Validate email and password
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return;
    }

    // Show loading toast
    const toastId = toast.loading('Signing in...');

    try {
      // Map user type to role
      const role = userTypeToRole[userType];
      
      // Call the login mutation with email, password, and role
      const response = await login({
        email: formData.email,
        password: formData.password,
        role
      }).unwrap();
      
      // The response should include both token and user data
      if (response && response.token) {
        // Dismiss loading toast
        toast.dismiss(toastId);
        
        // Show success message
        const welcomeMessage = response.name 
          ? `Welcome back, ${response.name}!`  
          : 'Successfully logged in!';
        toast.success(welcomeMessage);
        
        // Prepare user data for Redux store
        const userData = {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role || 'customer'
        };
        
        // Store the token in localStorage
        localStorage.setItem('token', response.token);
        
        // Dispatch the setCredentials action
        dispatch(setCredentials({
          user: userData,
          token: response.token
        }));
        
        // Determine redirect path based on role
        let redirectPath = '/';
        if (response.role === 'admin') {
          redirectPath = '/admin';
        } else if (response.role === 'owner') {
          redirectPath = '/owner';
        } else if (response.role === 'customer') {
          redirectPath = '/renter';
        }

        // Use the location state for redirect if available, otherwise use role-based path
        const from = location.state?.from?.pathname || redirectPath;
        
        // Add a small delay to allow the toast to be seen before navigation
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      }
    } catch (err) {
      toast.dismiss(toastId);
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Title title="Login" />
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <FiLogIn className="h-16 w-16 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
            <span className="mx-2 text-gray-400">|</span>
            <a href="/" className="font-medium text-primary hover:text-primary-dark">
              Return to home
            </a>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="text-center mb-4 font-medium">What are you login for?</p>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${userType === 'rent' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => handleUserTypeSelect('rent')}
              >
                <div className="p-3 rounded-full bg-gray-100 mb-3">
                  <FiUser className="h-6 w-6 text-gray-600" />
                </div>
                <p className="font-medium">To rent</p>
                <p className="text-sm text-gray-500">Find cars to rent</p>
              </div>
              
              <div 
                className={`border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${userType === 'owner' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={() => handleUserTypeSelect('owner')}
              >
                <div className="p-3 rounded-full bg-gray-100 mb-3">
                  <FaCar className="h-6 w-6 text-gray-600" />
                </div>
                <p className="font-medium">To list my car</p>
                <p className="text-sm text-center text-gray-500">Make money from your whip</p>
              </div>
            </div>
            {!userType && error && <p className="text-center text-red-500 text-sm mt-2">Please select what you want to do</p>}
          </div>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10 block w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

