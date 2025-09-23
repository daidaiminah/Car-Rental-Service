import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaKey } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { selectCurrentUser } from '../store/features/auth/authSlice';
import { 
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation 
} from '../store/features/users/usersApiSlice';
import OwnerDashboard from '../components/OwnerDashboard';
import RenterDashboard from '../components/RenterDashboard';

const Profile = () => {
  const user = useSelector(selectCurrentUser);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  // Debug: Log authentication status and user data
  console.log('Current user from Redux:', user);
  //console.log('Auth token:', localStorage.getItem('token'));
  
  // Get user profile data using RTK Query
  const { 
    data: userData, 
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchUserProfile
  } = useGetUserProfileQuery(user?.id, {
    skip: !user?.id
  });
  
  // Log profile data and errors
  useEffect(() => {
    console.log('Profile data:', userData);
    if (profileError) {
      console.error('Error fetching profile:', profileError);
    }
  }, [userData, profileError]);
  
  // Update profile mutation
  const [updateProfile, { isLoading: updateLoading }] = useUpdateUserProfileMutation();
  
  // Change password mutation
  const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profileImage: ''
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update local state when user data is fetched
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        country: userData.country || '',
        profileImage: userData.profileImage || ''
      });
    }
  }, [userData]);

  // Handle loading and error states
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load profile. Please try again later.</span>
        </div>
      </div>
    );
  }
  
  // Loading state derived from RTK Query loading states
  const loading = profileLoading || updateLoading || passwordLoading;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImageFile(file);

    // Create a preview for the UI
    const reader = new FileReader();
    reader.onload = () => {
      setProfileData(prev => ({
        ...prev,
        profileImage: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      // Append all profile data fields
      Object.keys(profileData).forEach(key => {
        if (key !== 'profileImage') { // Don't append the preview URL
          formData.append(key, profileData[key]);
        }
      });

      // If a new image was selected, append the file
      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      }

      // Call RTK Query mutation to update profile
      await updateProfile(formData).unwrap();
      
      // Refetch user profile to update the UI
      refetchUserProfile();
      
      toast.success('Profile updated successfully');
      setEditMode(false);
      setProfileImageFile(null); // Reset the image file state
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error?.data?.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      // Call RTK Query mutation to change password
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }).unwrap();
      
      toast.success('Password changed successfully');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error?.data?.message || 'Failed to change password. Please check your current password and try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary-dark mb-6">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-secondary-dark p-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4 md:mb-0 md:mr-6">
              <img 
                src={profileData.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
              <p className="text-gray-300">{userData?.role === 'customer' ? 'Renter' : userData?.role}</p>
              <p className="text-gray-300">Member since {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setEditMode(!editMode)}
              className="btn-primary flex items-center gap-2"
              disabled={loading}
            >
              <FaEdit />
              <span>{editMode ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="p-6">
          {/* Role-specific dashboard sections */}
          {userData?.role === 'owner' && <OwnerDashboard userId={user.id} />}
          {userData?.role === 'customer' && <RenterDashboard userId={user.id} />}

          {editMode ? (
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary-dark mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-dark mb-1">Email Address</label>
                  <div className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-gray-700">
                    {profileData.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary-dark mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-secondary-dark mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-secondary-dark mb-1">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-secondary-dark mb-1">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={profileData.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="profileImage" className="block text-sm font-medium text-secondary-dark mb-1">Profile Image</label>
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="btn-secondary-outline mr-2"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-dark mb-4">Personal Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaUser className="text-primary mr-3" />
                      <div>
                        <p className="text-sm text-secondary">Full Name</p>
                        <p className="text-secondary-dark">{profileData.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaEnvelope className="text-primary mr-3" />
                      <div>
                        <p className="text-sm text-secondary">Email Address</p>
                        <p className="text-secondary-dark">{profileData.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaPhone className="text-primary mr-3" />
                      <div>
                        <p className="text-sm text-secondary">Phone Number</p>
                        <p className="text-secondary-dark">{profileData.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-secondary-dark mb-4">Address Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-primary mr-3" />
                      <div>
                        <p className="text-sm text-secondary">Address</p>
                        <p className="text-secondary-dark">{profileData.address || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-primary mr-3" />
                      <div>
                        <p className="text-sm text-secondary">City</p>
                        <p className="text-secondary-dark">{profileData.city || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-primary mr-3" />
                      <div>
                        <p className="text-sm text-secondary">Country</p>
                        <p className="text-secondary-dark">{profileData.country || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-secondary-dark mb-4">Security</h3>
                
                {showPasswordForm ? (
                  <form onSubmit={handlePasswordSubmit} className="max-w-md">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-dark mb-1">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-dark mb-1">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-dark mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex">
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="btn-secondary-outline mr-2"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Changing...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="btn-secondary-outline flex items-center gap-2"
                  >
                    <FaKey />
                    <span>Change Password</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
