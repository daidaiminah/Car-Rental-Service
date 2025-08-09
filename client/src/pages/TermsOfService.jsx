import React from 'react';
import { FaFileContract, FaCar, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';

const TermsOfService = () => {
  const sections = [
    {
      icon: <FaFileContract className="w-6 h-6 text-primary" />,
      title: '1. Rental Agreement',
      content: (
        <div className="space-y-4">
          <p>
            By renting a vehicle from In Time Whip, you agree to the terms and conditions outlined in this agreement. 
            The rental period begins at the time of vehicle pickup and ends when the vehicle is returned to our location.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Minimum rental age is 21 years</li>
            <li>Valid driver's license required</li>
            <li>Major credit card in renter's name</li>
            <li>Proof of insurance may be required</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaCar className="w-6 h-6 text-primary" />,
      title: '2. Vehicle Use',
      content: (
        <div className="space-y-4">
          <p>The rented vehicle may only be driven by authorized drivers listed on the rental agreement.</p>
          <p>Prohibited uses include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Off-road driving</li>
            <li>Transporting hazardous materials</li>
            <li>Towing or pushing any trailer or vehicle</li>
            <li>Transporting passengers for hire</li>
            <li>Illegal activities</li>
          </ul>
        </div>
      )
    },
    {
      icon: <FaShieldAlt className="w-6 h-6 text-primary" />,
      title: '3. Insurance & Protection',
      content: (
        <div className="space-y-4">
          <p>
            Basic third-party liability insurance is included with all rentals. Additional coverage options are available:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Collision Damage Waiver (CDW)</li>
            <li>Theft Protection (TP)</li>
            <li>Personal Accident Insurance (PAI)</li>
            <li>Personal Effects Coverage (PEC)</li>
          </ul>
          <p>Please review all insurance options with our staff before your rental period begins.</p>
        </div>
      )
    },
    {
      icon: <FaInfoCircle className="w-6 h-6 text-primary" />,
      title: '4. General Terms',
      content: (
        <div className="space-y-4">
          <p><strong>Fuel Policy:</strong> Vehicle must be returned with the same amount of fuel as at the start of the rental.</p>
          <p><strong>Late Returns:</strong> Additional charges apply for late returns beyond the grace period.</p>
          <p><strong>Traffic Violations:</strong> Renters are responsible for all traffic violations during the rental period.</p>
          <p><strong>Smoking:</strong> Smoking is strictly prohibited in all rental vehicles.</p>
          <p><strong>Pets:</strong> Pets are allowed only in designated pet-friendly vehicles with prior arrangement.</p>
        </div>
      )
    }
  ];

  return (
    <div className="py-12 bg-light-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-dark mb-4">Whip In Town - Terms of Service</h1>
          <p className="text-lg text-secondary-light">
            Last updated: August 7, 2025
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="mb-6 text-secondary-light">
            Welcome to Whip In Town Car Rental. By using our services, you agree to these terms and conditions. 
            Please read them carefully before making a reservation.
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
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mt-2">
            <a 
              href="mailto:legal@intimewhip.com" 
              className="text-primary hover:underline"
            >
              legal@whipintown.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
