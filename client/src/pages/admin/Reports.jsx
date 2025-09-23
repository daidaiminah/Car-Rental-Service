import React, { useState, useEffect } from 'react';
import { 
  FiBarChart2, 
  FiDollarSign, 
  FiUsers, 
  FiCalendar, 
  FiFilter, 
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart
} from 'react-icons/fi';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchReportData = async () => {
      // Simulate API call
      setTimeout(() => {
        setReportData({
          // Summary Cards
          summary: {
            totalRevenue: 48250.75,
            totalBookings: 342,
            activeUsers: 128,
            averageRating: 4.7,
            revenueChange: 12.5,
            bookingsChange: 8.2,
            usersChange: 5.7,
            ratingChange: 0.3
          },
          
          // Revenue by Vehicle Type
          revenueByType: [
            { type: 'Sedan', value: 18500, percentage: 38.3 },
            { type: 'SUV', value: 15450, percentage: 32.0 },
            { type: 'Truck', value: 6850, percentage: 14.2 },
            { type: 'Luxury', value: 5250, percentage: 10.9 },
            { type: 'Electric', value: 2200, percentage: 4.6 }
          ],
          
          // Monthly Revenue Data
          monthlyRevenue: [
            { month: 'Jan', revenue: 12500, bookings: 78 },
            { month: 'Feb', revenue: 18900, bookings: 112 },
            { month: 'Mar', revenue: 15600, bookings: 95 },
            { month: 'Apr', revenue: 17800, bookings: 108 },
            { month: 'May', revenue: 22400, bookings: 132 },
            { month: 'Jun', revenue: 24800, bookings: 147 }
          ],
          
          // Recent Transactions
          recentTransactions: [
            { id: 'TXN-1001', user: 'John D.', amount: 325.75, date: '2023-06-15', status: 'completed' },
            { id: 'TXN-1002', user: 'Sarah M.', amount: 189.50, date: '2023-06-14', status: 'completed' },
            { id: 'TXN-1003', user: 'Michael B.', amount: 420.25, date: '2023-06-14', status: 'completed' },
            { id: 'TXN-1004', user: 'Emily R.', amount: 275.00, date: '2023-06-13', status: 'refunded' },
            { id: 'TXN-1005', user: 'David K.', amount: 310.50, date: '2023-06-12', status: 'completed' }
          ],
          
          // User Activity
          userActivity: {
            newUsers: 42,
            activeUsers: 128,
            inactiveUsers: 64,
            topLocations: [
              { city: 'New York', users: 28 },
              { city: 'Los Angeles', users: 22 },
              { city: 'Chicago', users: 18 },
              { city: 'Houston', users: 15 },
              { city: 'Phoenix', users: 12 }
            ]
          }
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchReportData();
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading || !reportData) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-gray-500" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(reportData.summary.totalRevenue)}</p>
              <div className={`flex items-center mt-1 text-sm ${reportData.summary.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.summary.revenueChange >= 0 ? (
                  <FiTrendingUp className="mr-1" />
                ) : (
                  <FiTrendingDown className="mr-1" />
                )}
                <span>{Math.abs(reportData.summary.revenueChange)}% from last period</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FiDollarSign className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{reportData.summary.totalBookings}</p>
              <div className={`flex items-center mt-1 text-sm ${reportData.summary.bookingsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.summary.bookingsChange >= 0 ? (
                  <FiTrendingUp className="mr-1" />
                ) : (
                  <FiTrendingDown className="mr-1" />
                )}
                <span>{Math.abs(reportData.summary.bookingsChange)}% from last period</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiBarChart2 className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold">{reportData.summary.activeUsers}</p>
              <div className={`flex items-center mt-1 text-sm ${reportData.summary.usersChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.summary.usersChange >= 0 ? (
                  <FiTrendingUp className="mr-1" />
                ) : (
                  <FiTrendingDown className="mr-1" />
                )}
                <span>{Math.abs(reportData.summary.usersChange)}% from last period</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiUsers className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">{reportData.summary.averageRating}</p>
                <span className="ml-1 text-gray-500">/ 5.0</span>
              </div>
              <div className={`flex items-center mt-1 text-sm ${reportData.summary.ratingChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.summary.ratingChange >= 0 ? (
                  <FiTrendingUp className="mr-1" />
                ) : (
                  <FiTrendingDown className="mr-1" />
                )}
                <span>{Math.abs(reportData.summary.ratingChange)}% from last period</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiBarChart2 className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              <FiFilter className="inline mr-1" /> Filter
            </button>
          </div>
          <div className="h-64">
            <div className="flex items-end h-48 border-b border-l border-gray-200">
              {reportData.monthlyRevenue.map((item, index) => {
                const maxRevenue = Math.max(...reportData.monthlyRevenue.map(i => i.revenue));
                const height = (item.revenue / maxRevenue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="bg-orange-500 w-6 rounded-t hover:bg-orange-600 transition-colors relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {formatCurrency(item.revenue)}
                      </div>
                    </div>
                    <span className="text-xs mt-2 text-gray-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue by Vehicle Type */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Revenue by Vehicle Type</h2>
            <FiPieChart className="text-gray-500" />
          </div>
          <div className="space-y-4">
            {reportData.revenueByType.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.type}</span>
                  <span className="text-gray-500">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            View All Transactions
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tx.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.user}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">User Activity</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">New Users</p>
              <p className="text-2xl font-bold">{reportData.userActivity.newUsers}</p>
              <p className="text-xs text-blue-600 mt-1">This month</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">Active Users</p>
              <p className="text-2xl font-bold">{reportData.userActivity.activeUsers}</p>
              <p className="text-xs text-green-600 mt-1">Currently active</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-800">Inactive Users</p>
              <p className="text-2xl font-bold">{reportData.userActivity.inactiveUsers}</p>
              <p className="text-xs text-gray-600 mt-1">Not active this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">Top Locations</h2>
          <div className="space-y-4">
            {reportData.userActivity.topLocations.map((location, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{location.city}</span>
                  <span className="text-gray-500">{location.users} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ 
                      width: `${(location.users / Math.max(...reportData.userActivity.topLocations.map(l => l.users))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
