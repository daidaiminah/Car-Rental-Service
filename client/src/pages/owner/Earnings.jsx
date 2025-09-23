import React, { useState, useEffect } from 'react';
import { useAuth } from '../../store/authContext';
import { FiDollarSign, FiTrendingUp, FiCalendar, FiFilter } from 'react-icons/fi';

const Earnings = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [earnings, setEarnings] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    chartData: []
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const fetchEarnings = async () => {
      // This would be an actual API call in production
      setTimeout(() => {
        setEarnings({
          total: 5240.75,
          completed: 4890.25,
          pending: 350.50,
          cancelled: 0,
          chartData: [
            { month: 'Jan', amount: 1200 },
            { month: 'Feb', amount: 1900 },
            { month: 'Mar', amount: 1500 },
            { month: 'Apr', amount: 1800 },
            { month: 'May', amount: 2100 },
            { month: 'Jun', amount: 2400 },
          ]
        });
      }, 500);
    };

    fetchEarnings();
  }, [timeRange]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Earnings Overview</h1>
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-500" />
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold">${earnings.total.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiDollarSign className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold">${earnings.completed.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiTrendingUp className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold">${earnings.pending.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiTrendingUp className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-2xl font-bold">${earnings.cancelled.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiTrendingUp className="text-red-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Earnings Overview</h2>
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
            <FiFilter className="mr-1" /> Filter
          </button>
        </div>
        <div className="h-64">
          {/* Chart would be implemented with a charting library like Chart.js or Recharts */}
          <div className="flex items-end h-48 border-b border-l border-gray-200">
            {earnings.chartData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-orange-500 w-8 rounded-t hover:bg-orange-600 transition-colors"
                  style={{ height: `${(item.amount / 3000) * 100}%` }}
                  title={`$${item.amount}`}
                ></div>
                <span className="text-xs mt-2 text-gray-500">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#BK-{1000 + item}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Toyota Camry 2022</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-06-{10 + item}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    ${(Math.random() * 500 + 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button className="text-sm text-gray-600 hover:text-gray-800">
            View All Transactions
          </button>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm">Previous</button>
            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border rounded text-sm">2</button>
            <button className="px-3 py-1 border rounded text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
