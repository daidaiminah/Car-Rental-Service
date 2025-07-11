// Auth token management utilities

const TOKEN_KEY = 'car_rental_auth_token';

/**
 * Save the authentication token to localStorage
 * @param {string} token - The JWT token to save
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Retrieve the authentication token from localStorage
 * @returns {string|null} The JWT token if it exists, otherwise null
 */
export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if the user is authenticated
 * @returns {boolean} True if a valid token exists, false otherwise
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  // In a real app, you would also verify the token's expiration
  return !!token;
};

export default {
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
};
