import React from 'react';
import { FaShieldAlt, FaHeadset, FaCarCrash, FaTools, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const SafetySupport = () => {
  const safetyFeatures = [
    {
      icon: <FaShieldAlt className="w-8 h-8 text-primary" />,
      title: '24/7 Roadside Assistance',
      description: 'Our team is available around the clock to assist you with any roadside emergencies.'
    },
    {
      icon: <FaCarCrash className="w-8 h-8 text-primary" />,
      title: 'Accident Support',
      description: 'Immediate assistance and guidance in case of an accident or breakdown.'
    },
    {
      icon: <FaTools className="w-8 h-8 text-primary" />,
      title: 'Regular Maintenance',
      description: 'All our vehicles undergo rigorous maintenance checks to ensure your safety.'
    }
  ];

  const supportTeam = [
    {
      name: 'Emergency Hotline',
      contact: '+231 (881) 617-698',
      icon: <FaPhoneAlt className="w-5 h-5 mr-2" />,
      type: 'phone',
      available: '24/7',
      description: 'For immediate assistance with accidents or breakdowns.'
    },
    {
      name: 'Customer Support',
      contact: 'support@whipintown.com',
      icon: <FaEnvelope className="w-5 h-5 mr-2" />,
      type: 'email',
      available: 'Mon-Sun, 6am-10pm',
      description: 'For general inquiries and support.'
    },
    {
      name: 'Roadside Assistance',
      contact: '+231 (881) 617-699',
      icon: <FaCarCrash className="w-5 h-5 mr-2" />,
      type: 'phone',
      available: '24/7',
      description: 'For immediate vehicle assistance on the road.'
    }
  ];

  return (
    <div className="py-12 bg-light-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-secondary-dark mb-4">Safety & Support</h1>
          <p className="text-lg text-secondary-light max-w-3xl mx-auto">
            Your safety is our top priority. We're committed to providing reliable support whenever you need it.
          </p>
        </div>

        {/* Safety Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-8 text-center">
            Our Safety Commitment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg">
                <div className="text-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
                <p className="text-secondary-light text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-8 text-center">
            Contact Our Support Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportTeam.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="text-primary">
                    {member.icon}
                  </div>
                  <h3 className="text-lg font-semibold ml-2">{member.name}</h3>
                </div>
                <div className="mb-3">
                  <a 
                    href={`${member.type === 'email' ? 'mailto:' : 'tel:'}${member.contact}`}
                    className="text-primary hover:underline font-medium flex items-center"
                  >
                    {member.contact}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">Available: {member.available}</p>
                </div>
                <p className="text-sm text-secondary-light">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Procedures */}
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-6">
            In Case of Emergency
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h3 className="font-semibold text-lg">Accident or Collision</h3>
              <ol className="list-decimal list-inside text-secondary-light space-y-1 mt-2">
                <li>Ensure your safety and the safety of others</li>
                <li>Call emergency services if needed</li>
                <li>Contact our emergency hotline immediately</li>
                <li>Do not admit fault or liability</li>
                <li>Document the scene with photos if possible</li>
              </ol>
            </div>
            <div className="border-l-4 border-[#faeb1c] pl-4 py-2">
              <h3 className="font-semibold text-lg">Vehicle Breakdown</h3>
              <ol className="list-decimal list-inside text-secondary-light space-y-1 mt-2">
                <li>Move to a safe location if possible</li>
                <li>Turn on hazard lights</li>
                <li>Contact our roadside assistance</li>
                <li>Stay with the vehicle until help arrives</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetySupport;
