import api from './api';

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Update user profile
export const updateProfile = async (userId, profileData) => {
  try {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Change user password
export const changePassword = async (userId, passwordData) => {
  try {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to change password' };
  }
};

// Upload profile image
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    
    const response = await api.post(`/users/${userId}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to upload profile image' };
  }
};

// Get user bookings/rentals
export const getUserBookings = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/bookings`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user bookings' };
  }
};

const userService = {
  getUserProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
  getUserBookings
};

export default userService;
