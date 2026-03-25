// client/src/utils/cookies.js
export const hasCookieConsent = () => {
  if (typeof window === 'undefined') return true; // For server-side rendering
  return localStorage.getItem('cookieConsent') === 'accepted';
};

export const setCookieConsent = (value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cookieConsent', value ? 'accepted' : 'declined');
  }
};