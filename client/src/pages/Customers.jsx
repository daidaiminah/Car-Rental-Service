import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import customerService from '../services/customerService.js';

const Customers = () => {
  const [customers, setCustomers] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customers from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await customerService.getAllCustomers();
        
        // Ensure we have a valid array before setting state
        if (Array.isArray(response)) {
          setCustomers(response);
          setError(null);
        } else {
          console.error('Invalid response format:', response);
          setError('Received invalid data format from server');
          setCustomers([]);
        }
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError('Failed to fetch customers. Please try again.');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);



  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter customers based on search term
  const filteredCustomers = Array.isArray(customers) ? customers.filter(customer => 
    customer && 
    customer.name && 
    customer.email && 
    customer.phone &&
    (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.toString().includes(searchTerm))
    )
  ) : [];

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        // Update local state after successful API call
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (err) {
        console.error('Failed to delete customer:', err);
        alert('Failed to delete customer. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Link to="/customers/new" className="btn-primary">
          Add Customer
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="card mb-6">
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search customers..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading/Error State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary">Loading customers...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <button 
            className="mt-2 text-primary hover:underline"
            onClick={() => {
              setError(null);
              // Re-fetch customers
              const fetchCustomers = async () => {
                try {
                  setLoading(true);
                  const data = await customerService.getAllCustomers();
                  setCustomers(data);
                  setError(null);
                } catch (err) {
                  console.error('Failed to fetch customers:', err);
                  setError('Failed to fetch customers. Please try again.');
                } finally {
                  setLoading(false);
                }
              };
              fetchCustomers();
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Customers List */}
      {!loading && !error && (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Address</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{customer.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{customer.name}</td>
                      <td className="px-4 py-3 text-sm">{customer.email}</td>
                      <td className="px-4 py-3 text-sm">{customer.phone}</td>
                      <td className="px-4 py-3 text-sm">{customer.address}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <Link to={`/customers/${customer.id}`} className="text-primary hover:underline">View</Link>
                          <Link to={`/customers/${customer.id}/edit`} className="text-secondary hover:underline">Edit</Link>
                          <button 
                            onClick={() => handleDelete(customer.id)} 
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-sm text-center">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
