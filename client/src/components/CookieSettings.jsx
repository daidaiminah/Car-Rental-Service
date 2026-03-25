// client/src/components/CookieSettings.jsx
import { useState, useEffect } from 'react';
import { hasCookieConsent, setCookieConsent } from '../utils/cookies';

const CookieSettings = () => {
  const [consent, setConsent] = useState(hasCookieConsent());

  useEffect(() => {
    setConsent(hasCookieConsent());
  }, []);

  const handleConsentChange = (value) => {
    setConsent(value);
    setCookieConsent(value);
    // Optionally refresh the page to apply changes
    // window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Cookie Settings</h2>
      
      <div className="mb-6">
        <p className="mb-4">We use cookies to enhance your experience. Choose which types of cookies you're happy for us to use:</p>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessary"
              checked={true}
              disabled
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="necessary" className="ml-2 block text-sm text-gray-700">
              <span className="font-medium">Necessary cookies</span>
              <p className="text-gray-500">Essential for the website to function properly.</p>
            </label>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="analytics"
                name="analytics"
                type="checkbox"
                checked={consent}
                onChange={(e) => handleConsentChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="analytics" className="font-medium text-gray-700">
                Analytics cookies
              </label>
              <p className="text-gray-500">
                Help us understand how visitors interact with our website.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CookieSettings;