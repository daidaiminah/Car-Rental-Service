import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCredentials } from '../store/features/auth/authSlice';
import { getApiBaseUrl } from '../utils/socketEnv';

const AuthCallback = () => {
  const [message, setMessage] = useState('Completing sign-in, please wait...');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('status');
    const token = url.searchParams.get('token');

    if (status !== 'success' || !token) {
      toast.error('Unable to sign in with Google. Please try again.');
      setMessage('Authentication failed. Redirecting to login...');
      const timeout = setTimeout(() => navigate('/login', { replace: true }), 2500);
      return () => clearTimeout(timeout);
    }

    const finalizeAuth = async () => {
      try {
        localStorage.setItem('token', token);

        const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const user = await response.json();
        dispatch(setCredentials({ user, token }));
        toast.success('Signed in with Google');
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Social auth completion failed:', error);
        toast.error('Unable to complete Google sign-in. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    finalizeAuth();
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center space-y-4">
        <div className="animate-pulse text-primary text-2xl font-semibold">Whip In Time</div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default AuthCallback;
