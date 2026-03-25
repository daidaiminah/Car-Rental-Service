// client/src/components/CookieConsent.jsx
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'accepted') {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
    toast.success('Cookie preferences saved');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-4 md:mb-0 md:mr-4">
        <p className="text-sm">
          We use cookies to enhance your experience. By continuing to visit this site, you agree to our{' '}
          <Link to="/cookie-settings" className="underline hover:text-blue-300">
          use of cookies
          </Link>.
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={acceptCookies}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
        >
          Accept All
        </button>
        <button
          onClick={() => setVisible(false)}
          className="p-2 text-gray-300 hover:text-white"
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;