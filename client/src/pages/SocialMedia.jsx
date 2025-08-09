import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowRight } from 'react-icons/fa';

const SocialMedia = () => {
  const socialMediaProfiles = [
    {
      name: 'Facebook',
      icon: <FaFacebook className="w-8 h-8 text-blue-600" />,
      url: 'https://facebook.com/whipintown',
      description: 'Follow us on Facebook for the latest updates, promotions, and community events.',
      handle: '@whipintown'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="w-8 h-8 text-blue-400" />,
      url: 'https://twitter.com/whipintown',
      description: 'Join the conversation on Twitter and stay updated with our latest news and offers.',
      handle: '@whipintown'
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-8 h-8 text-pink-600" />,
      url: 'https://instagram.com/whipintown',
      description: 'Check out our Instagram for stunning photos of our fleet and customer experiences.',
      handle: '@whipintown'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="w-8 h-8 text-blue-700" />,
      url: 'https://linkedin.com/company/whipintown',
      description: 'Connect with us on LinkedIn for business inquiries and career opportunities.',
      handle: 'company/whipintown'
    }
  ];

  return (
    <div className="py-12 bg-light-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-dark mb-4">Connect With Us</h1>
          <p className="text-lg text-secondary-light">
            Follow Whip In Town on social media to stay updated with our latest offers and news
          </p>
        </div>

        <div className="space-y-6">
          {socialMediaProfiles.map((social, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {social.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-secondary-dark">{social.name}</h3>
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                    >
                      Visit {social.name}
                      <FaArrowRight className="ml-2" />
                    </a>
                  </div>
                  <p className="mt-2 text-secondary-light">{social.description}</p>
                  <p className="mt-2 text-sm text-gray-500">{social.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-4">Need Help?</h2>
          <p className="text-secondary-light mb-6">
            Our customer support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="space-x-4">
            <a 
              href="/contact" 
              className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
            >
              Contact Support
            </a>
            <a 
              href="/faq" 
              className="inline-block bg-gray-100 hover:bg-gray-200 text-secondary-dark font-medium py-3 px-8 rounded-md transition-colors duration-300"
            >
              Visit FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
