// client/src/pages/CookiePolicy.jsx
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="prose max-w-none">
        <p className="mb-4">
          This website uses cookies to enhance your experience. By using our website, you agree to our use of cookies.
        </p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">What are cookies?</h2>
        <p className="mb-4">
          Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site owners.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">How we use cookies</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>To remember your preferences</li>
          <li>To analyze site traffic and usage</li>
          <li>To improve our services</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Managing cookies</h2>
        <p className="mb-4">
          You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
        </p>

        <div className="mt-8">
          <Link to="/" className="text-primary hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;