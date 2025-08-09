import React from 'react';
import { FaShieldAlt, FaUserShield, FaInfoCircle, FaLock } from 'react-icons/fa';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: <FaShieldAlt className="w-6 h-6 text-primary" />,
      title: '1. Information We Collect',
      content: (
        <div className="space-y-4">
          <p>We collect various types of information to provide and improve our services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email, phone number, address, driver's license details</li>
            <li><strong>Payment Information:</strong> Credit card details, billing address</li>
            <li><strong>Rental Information:</strong> Vehicle preferences, rental history</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            <li><strong>Usage Data:</strong> How you interact with our website and services</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaUserShield className="w-6 h-6 text-primary" />,
      title: '2. How We Use Your Information',
      content: (
        <div className="space-y-4">
          <p>We use the collected data for various purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and manage your rental reservations</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Improve our services and website functionality</li>
            <li>Send important updates and promotional offers (with your consent)</li>
            <li>Prevent fraud and ensure the security of our services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaLock className="w-6 h-6 text-primary" />,
      title: '3. Data Security',
      content: (
        <div className="space-y-4">
          <p>We implement appropriate security measures to protect your personal information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of sensitive data during transmission (SSL/TLS)</li>
            <li>Secure storage of personal information</li>
            <li>Regular security assessments and updates</li>
            <li>Restricted access to personal information on a need-to-know basis</li>
          </ul>
          <p>While we strive to protect your data, no method of transmission over the internet is 100% secure.</p>
        </div>
      )
    },
    {
      icon: <FaInfoCircle className="w-6 h-6 text-primary" />,
      title: '4. Your Rights',
      content: (
        <div className="space-y-4">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict processing of your data</li>
            <li>Withdraw consent for marketing communications</li>
            <li>Lodge a complaint with a data protection authority</li>
          </ul>
          <p>To exercise these rights, please contact us using the information below.</p>
        </div>
      )
    }
  ];

  return (
    <div className="py-12 bg-light-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-dark mb-4">Whip In Town - Privacy Policy</h1>
          <p className="text-lg text-secondary-light">
            Effective Date: August 7, 2025
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="mb-6 text-secondary-light">
            At Whip In Town, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you use our car rental services.
          </p>
          
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-semibold text-secondary-dark">
                    {section.title}
                  </h2>
                </div>
                <div className="text-secondary-light pl-9">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-4">Contact Us</h2>
          <p className="text-secondary-light">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <a 
              href="mailto:privacy@intimewhip.com" 
              className="text-primary hover:underline"
            >
              privacy@whipintown.com
            </a>
          </p>
          <p className="mt-2">
            Whip In Town<br />
            123 Rental Street<br />
            Monrovia, Liberia
          </p>
          <p className="mt-4 text-sm text-gray-500">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
