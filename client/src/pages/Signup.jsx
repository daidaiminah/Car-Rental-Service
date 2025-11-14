import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaCar } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useSignupMutation } from '../store/features/auth/authApiSlice';
import { setCredentials } from '../store/features/auth/authSlice';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { getApiBaseUrl } from '../utils/socketEnv';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' // Added role field
  });
  
  const [userType, setUserType] = useState(''); // To track selected user type
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use RTK Query mutation hook for signup
  const [signup, { isLoading }] = useSignupMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      role: type === 'rent' ? 'customer' : 'owner'
    }));
  };

  const handleGoogleSignIn = () => {
    if (typeof window === 'undefined') return;
    const apiBase = getApiBaseUrl();
    const callbackUrl = `${window.location.origin}/auth/callback`;
    const authUrl = `${apiBase}/auth/google?redirect=${encodeURIComponent(callbackUrl)}`;
    window.location.href = authUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    // Show loading toast
    const toastId = toast.loading('Creating your account...');

    try {
      // Use RTK Query mutation to register the user
      const { name, email, password, role } = formData;
      const response = await signup({ name, email, password, role }).unwrap();
      
      // Dismiss loading toast
      toast.dismiss();
      
      // Show success message
      const successMessage = `Welcome to Whip In Town, ${name}! Your account has been created successfully.`;
      toast.success(successMessage);
      
      // The backend returns user data in response.data
      const { token, ...userData } = response;
      
      // Store user data in Redux state
      dispatch(setCredentials({
        user: userData,
        token: token,
        role: userData.role
      }));
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { 
          replace: true,
          state: { 
            from: '/',
            message: 'Please login with your new credentials.'
          }
        });
      }, 2000);
    } catch (err) {
      // console.error('Signup error:', err);
      // Dismiss loading toast if still showing
      toast.dismiss();
      
      // Handle specific error cases
      let errorMessage = 'Registration failed. Please try again.';
      
      // Check for the specific email exists error
      if (err?.data?.message?.includes('already exists') || 
          err?.data?.message?.includes('already registered') ||
          err?.data?.field === 'email') {
        errorMessage = err.data.message || 'This email is already registered. Please use a different email or try logging in.';
      } 
      // Handle other 400 errors
      else if (err.status === 400) {
        if (err.data?.errors) {
          // Handle validation errors
          errorMessage = 'Please correct the following errors:';
          Object.values(err.data.errors).forEach((error) => {
            errorMessage += `\n• ${error}`;
          });
        } else if (err.data?.message) {
          errorMessage = err.data.message;
        }
      } 
      // Handle network errors
      else if (err.status === 'FETCH_ERROR') {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      // Show error toast with the appropriate message
      toast.error(errorMessage, {
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Also set error for form display if needed
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
       <Title title="Signup" />
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-primary-100 p-3 rounded-full">
              <FiUser className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Whip In Time and start today!
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FcGoogle className="h-5 w-5" />
            Sign up with Google
          </button>
          <p className="text-xs text-center text-gray-500">
            Use your Google account to create a profile instantly.
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="text-center mb-4 font-medium">What are you Register For</p>
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
                <p className="text-sm text-gray-500">Make money from your car</p>
              </div>
            </div>
            {!userType && <p className="text-center text-red-500 text-sm mt-2">Please select what you want to do</p>}
          </div>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
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
                {/* Inside your form, after the email input field */}
                {error && error.toLowerCase().includes('email') && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
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
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pl-10 pr-10 block w-full border border-gray-300 rounded-md py-2 px-3 placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !userType}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${!userType ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FiArrowRight className="h-5 w-5 text-white" />
                )}
              </span>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
