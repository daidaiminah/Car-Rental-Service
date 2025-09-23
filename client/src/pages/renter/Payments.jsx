import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiCreditCard, FiClock, FiCheckCircle, FiAlertCircle, FiDownload } from 'react-icons/fi';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API calls
      setTimeout(() => {
        setPaymentMethods([
          {
            id: 1,
            type: 'visa',
            last4: '4242',
            expiry: '12/25',
            isDefault: true
          },
          {
            id: 2,
            type: 'mastercard',
            last4: '5555',
            expiry: '06/24',
            isDefault: false
          }
        ]);

        setTransactions([
          {
            id: 'TXN-1001',
            date: '2023-06-15',
            amount: 225.75,
            status: 'completed',
            type: 'rental',
            description: 'Toyota Camry 2022 - 3 days',
            receiptUrl: '#'
          },
          {
            id: 'TXN-1002',
            date: '2023-05-28',
            amount: 189.50,
            status: 'refunded',
            type: 'rental',
            description: 'Honda CR-V 2021 - 2 days',
            receiptUrl: '#'
          },
          {
            id: 'TXN-1003',
            date: '2023-05-10',
            amount: 45.00,
            status: 'completed',
            type: 'deposit',
            description: 'Security deposit refund',
            receiptUrl: '#'
          },
          {
            id: 'TXN-1004',
            date: '2023-04-22',
            amount: 320.25,
            status: 'completed',
            type: 'rental',
            description: 'Tesla Model 3 - 2 days',
            receiptUrl: '#'
          },
          {
            id: 'TXN-1005',
            date: '2023-04-15',
            amount: 150.00,
            status: 'failed',
            type: 'rental',
            description: 'BMW 3 Series - 1 day',
            receiptUrl: '#'
          }
        ]);
        
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.status === activeTab);

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };

    const statusLabels = {
      completed: 'Completed',
      pending: 'Pending',
      refunded: 'Refunded',
      failed: 'Failed'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status === 'completed' && <FiCheckCircle className="mr-1" size={14} />}
        {status === 'pending' && <FiClock className="mr-1" size={14} />}
        {status === 'failed' && <FiAlertCircle className="mr-1" size={14} />}
        {statusLabels[status] || status}
      </span>
    );
  };

  const getCardIcon = (type) => {
    const cardIcons = {
      visa: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg',
      mastercard: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mastercard/mastercard-original.svg',
      amex: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      discover: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg'
    };

    return cardIcons[type] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/creditcard/creditcard-original.svg';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Payments</h1>
      
      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Payment Methods</h2>
          <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            + Add Payment Method
          </button>
        </div>
        
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <img 
                  src={getCardIcon(method.type)} 
                  alt={method.type} 
                  className="h-8 w-12 object-contain mr-4"
                />
                <div>
                  <p className="font-medium">
                    {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                </div>
              </div>
              <div>
                {method.isDefault ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                ) : (
                  <button className="text-sm text-orange-500 hover:text-orange-600">
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'all' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'completed' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'pending' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('refunded')}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                activeTab === 'refunded' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Refunded
            </button>
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'all' 
                ? 'You don\'t have any transactions yet.'
                : `You don't have any ${activeTab} transactions.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-orange-500 hover:text-orange-600">
                        <FiDownload className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {filteredTransactions.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
              <span className="font-medium">{filteredTransactions.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button 
                disabled
                className="px-3 py-1 border rounded-md text-sm font-medium text-gray-500 bg-gray-100 cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                className="px-3 py-1 border rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payments;
