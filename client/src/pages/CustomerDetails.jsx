import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import customerService from '../services/customerService.js';
import rentalService from '../services/rentalService.js';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerRentals, setCustomerRentals] = useState([]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        
        if (id === 'new') {
          setCustomer({
            name: '',
            email: '',
            phone: '',
            address: '',
            driverLicense: ''
          });
        } else {
          // Fetch customer data
          const customerData = await customerService.getCustomerById(id);
          setCustomer(customerData);
          
          // Fetch customer rentals
          const rentalsData = await rentalService.getRentalsByCustomerId(id);
          setCustomerRentals(rentalsData || []);
        }
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomerData();
  }, [id]);

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for new/edit customer
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Update form data when customer data is loaded
  useEffect(() => {
    if (customer && id !== 'new') {
      setFormData({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || ''
      });
    }
  }, [customer]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (id === 'new') {
        await customerService.createCustomer(formData);
        navigate('/customers');
      } else {
        await customerService.updateCustomer(id, formData);
        // Refresh customer data
        const updatedCustomer = await customerService.getCustomerById(id);
        setCustomer(updatedCustomer);
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      setError('Failed to save customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        navigate('/customers');
      } catch (err) {
        console.error('Failed to delete customer:', err);
        setError('Failed to delete customer. Please try again.');
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
        <button 
          className="mt-2 text-primary hover:underline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading customer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {id === 'new' ? 'Add New Customer' : `Customer: ${customer.name}`}
        </h1>
        {id !== 'new' && (
          <div className="flex space-x-2">
            <Link to={`/customers/${id}/edit`} className="btn-primary">
              Edit Customer
            </Link>
            <button
              onClick={handleDelete}
              className="btn bg-red-600 text-white hover:bg-red-700"
            >
              Delete Customer
            </button>
          </div>
        )}
      </div>

      {id !== 'new' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Information Card */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-secondary-light text-sm">Full Name</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Email Address</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Phone Number</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Driver's License</p>
                    <p className="font-medium">{customer.driverLicense}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-secondary-light text-sm">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                  <div>
                    <p className="text-secondary-light text-sm">Registration Date</p>
                    <p className="font-medium">{customer.registrationDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Stats Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Customer Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Total Rentals</span>
                    <span className="font-bold text-secondary-dark">{customerRentals.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Active Rentals</span>
                    <span className="font-bold text-secondary-dark">
                      {customerRentals.filter(r => r.status === 'Active').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-secondary-light">Total Spent</span>
                    <span className="font-bold text-secondary-dark">$650</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rental History */}
          <div className="card mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Rental History</h2>
              <Link to={`/rentals/new?customerId=${customer.id}`} className="btn-primary">
                New Rental
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Car</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Start Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">End Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-secondary-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customerRentals.length > 0 ? (
                    customerRentals.map(rental => (
                      <tr key={rental.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{rental.id}</td>
                        <td className="px-4 py-3 text-sm font-medium">{rental.car}</td>
                        <td className="px-4 py-3 text-sm">{rental.startDate}</td>
                        <td className="px-4 py-3 text-sm">{rental.endDate}</td>
                        <td className="px-4 py-3 text-sm">{rental.amount}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            rental.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rental.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link to={`/rentals/${rental.id}`} className="text-primary hover:underline">View</Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-3 text-sm text-center">
                        No rental history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input" 
                  placeholder="Enter full name" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input" 
                  placeholder="Enter email address" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-light mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input" 
                  placeholder="Enter phone number" 
                  required
                />
              </div>

            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Link to="/customers" className="btn bg-gray-300 text-secondary hover:bg-gray-400">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Customer'
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
