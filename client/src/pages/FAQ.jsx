import React, { useState } from 'react';
import { FaChevronDown, FaCar, FaCreditCard, FaUserShield, FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqCategories = [
    {
      id: 'rental-process',
      title: 'Rental Process',
      icon: <FaCar className="w-5 h-5 mr-2" />,
      questions: [
        {
          question: 'What do I need to rent a car?',
          answer: 'To rent a car, you need to be at least 21 years old (some vehicle categories may have higher age requirements), have a valid driver\'s license, and a major credit card in your name. International renters may need additional documentation such as a passport and international driver\'s permit.'
        },
        {
          question: 'Can I modify or cancel my reservation?',
          answer: 'Yes, you can modify or cancel your reservation through our website or by contacting our customer service. Please note that cancellation policies may vary depending on the rate and time of cancellation.'
        },
        {
          question: 'What is your fuel policy?',
          answer: 'Our standard fuel policy is "full-to-full." You will receive the car with a full tank and should return it with a full tank to avoid refueling charges. We also offer pre-purchase fuel options at competitive rates.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Pricing',
      icon: <FaCreditCard className="w-5 h-5 mr-2" />,
      questions: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit cards with a credit card logo. Cash payments may be accepted at certain locations with additional identification requirements.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'All applicable fees are disclosed during the reservation process. These may include taxes, surcharges, and optional protection products. We are committed to transparent pricing with no hidden fees.'
        },
        {
          question: 'Is a deposit required?',
          answer: 'Yes, a security deposit is required at the time of rental. The amount varies depending on the vehicle category and is held on your credit card for the duration of the rental.'
        }
      ]
    },
    {
      id: 'insurance',
      title: 'Insurance & Protection',
      icon: <FaUserShield className="w-5 h-5 mr-2" />,
      questions: [
        {
          question: 'What insurance coverage is included?',
          answer: 'All rentals include basic third-party liability coverage as required by law. Additional coverage options such as Collision Damage Waiver (CDW) and Theft Protection (TP) are available for purchase to reduce your financial responsibility in case of damage or theft.'
        },
        {
          question: 'Does my personal car insurance cover rental cars?',
          answer: 'Some personal auto insurance policies extend coverage to rental vehicles. We recommend checking with your insurance provider before your rental. Credit card companies may also offer rental car coverage when you use their card for payment.'
        },
        {
          question: 'What happens if I have an accident?',
          answer: 'In case of an accident, please ensure everyone is safe, call emergency services if needed, and contact our 24/7 emergency assistance line immediately. Follow the instructions provided and complete an accident report form before leaving the scene.'
        }
      ]
    },
    {
      id: 'general',
      title: 'General Questions',
      icon: <FaQuestionCircle className="w-5 h-5 mr-2" />,
      questions: [
        {
          question: 'Can I take the rental car to another country?',
          answer: 'Cross-border travel may be allowed to certain countries with prior authorization. Additional fees and documentation may apply. Please contact us before your rental to arrange cross-border travel and check any restrictions.'
        },
        {
          question: 'What is your cancellation policy?',
          answer: 'Cancellation policies vary by rate type. Most reservations can be cancelled free of charge up to 24 hours before the scheduled pick-up time. Some special or prepaid rates may have different cancellation terms.'
        },
        {
          question: 'Do you offer one-way rentals?',
          answer: 'Yes, we offer one-way rentals between select locations. Additional one-way fees may apply depending on the rental locations. Please check availability and pricing when making your reservation.'
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="py-12 bg-light-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-dark mb-4">Whip In Town - FAQ</h1>
          <p className="text-lg text-secondary-light">
            Find answers to common questions about our car rental services
          </p>
        </div>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.id} className="bg-white rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer bg-gray-50"
                onClick={() => toggleAccordion(categoryIndex)}
              >
                <div className="flex items-center">
                  <span className="text-primary">
                    {category.icon}
                  </span>
                  <h2 className="text-xl font-semibold text-secondary-dark ml-3">
                    {category.title}
                  </h2>
                </div>
                <FaChevronDown 
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${activeIndex === categoryIndex ? 'transform rotate-180' : ''}`}
                />
              </div>
              
              <div className={`${activeIndex === categoryIndex ? 'block' : 'hidden'} divide-y divide-gray-200`}>
                {category.questions.map((item, index) => (
                  <div key={index} className="p-6">
                    <h3 className="font-medium text-secondary-dark mb-2">{item.question}</h3>
                    <p className="text-secondary-light">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-secondary-dark mb-4">Still have questions?</h2>
          <p className="text-secondary-light mb-6">
            Our customer support team is available 24/7 to assist you with any additional questions.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-md transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
