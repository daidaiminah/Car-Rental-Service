import React, { useEffect, useMemo, useState } from 'react';
import {
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiDownload,
} from 'react-icons/fi';
import { useGetPaymentSummaryQuery } from '../../store/features/payment/paymentApiSlice';
import { useSocket } from '../../context/SocketContext.jsx';

const statusFilters = ['all', 'completed', 'pending', 'refunded', 'failed'];

const statusMeta = {
  completed: {
    className: 'bg-green-100 text-green-800',
    icon: FiCheckCircle,
    label: 'Completed',
  },
  pending: {
    className: 'bg-yellow-100 text-yellow-800',
    icon: FiClock,
    label: 'Pending',
  },
  refunded: {
    className: 'bg-blue-100 text-blue-800',
    icon: FiDollarSign,
    label: 'Refunded',
  },
  failed: {
    className: 'bg-red-100 text-red-800',
    icon: FiAlertCircle,
    label: 'Failed',
  },
};

const cardIconMap = {
  card: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visa/visa-original.svg',
  mobile_money: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
  paypal: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/paypal/paypal-original.svg',
  bank_transfer: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
  cash: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cashapp/cashapp-original.svg',
};

const getStatusBadge = (status) => {
  const meta = statusMeta[status] || {
    className: 'bg-gray-100 text-gray-800',
    icon: FiClock,
    label: status,
  };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.className}`}>
      <Icon className="mr-1" size={14} />
      {meta.label}
    </span>
  );
};

const Payments = () => {
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState('all');

  const {
    data: summary,
    isLoading,
    isFetching,
    refetch,
  } = useGetPaymentSummaryQuery();

  const paymentMethods = summary?.paymentMethods ?? [];
  const transactions = summary?.transactions ?? [];

  useEffect(() => {
    if (!socket) return undefined;
    const handlePaymentUpdate = () => {
      refetch();
    };
    socket.on('payment:updated', handlePaymentUpdate);
    return () => {
      socket.off('payment:updated', handlePaymentUpdate);
    };
  }, [socket, refetch]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return transactions;
    return transactions.filter((tx) => tx.status === activeTab);
  }, [transactions, activeTab]);

  if (isLoading || isFetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                <p className="text-sm text-gray-500">
                  {paymentMethods.length > 0
                    ? 'Manage the payment options linked to your account.'
                    : 'Add a payment method during your next checkout.'}
                </p>
              </div>
            </div>
            {paymentMethods.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No payment methods recorded yet.
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-16 flex items-center justify-center bg-gray-50 rounded-md mr-4">
                        <img
                          src={cardIconMap[method.type] || cardIconMap.card}
                          alt={method.type}
                          className="h-8"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = cardIconMap.card;
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {method.type.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ending in {method.last4 || 'N/A'} · Used {method.usageCount || 0}{' '}
                          time{method.usageCount === 1 ? '' : 's'}
                        </div>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
                <p className="text-sm text-gray-500">
                  Track your rental payments and refunds.
                </p>
              </div>
              <div className="flex space-x-2">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      activeTab === status
                        ? 'bg-orange-100 text-orange-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'all'
                    ? "You don't have any transactions yet."
                    : `You don't have any ${activeTab} transactions.`}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Receipt</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.paymentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {tx.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.paymentDate ? new Date(tx.paymentDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          ${Number(tx.amount || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {tx.receiptUrl ? (
                            <a
                              href={tx.receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-orange-500 hover:text-orange-600"
                              title="Download receipt"
                            >
                              <FiDownload className="h-5 w-5" />
                            </a>
                          ) : (
                            <FiDownload className="h-5 w-5 text-gray-300" />
                          )}
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
                  Showing <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                  <span className="font-medium">{transactions.length}</span> result
                  {transactions.length === 1 ? '' : 's'}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <FiDollarSign className="text-orange-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <p className="text-xl font-semibold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <FiCheckCircle className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Payments</p>
                <p className="text-xl font-semibold text-gray-900">
                  {transactions.filter((tx) => tx.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Need help?</h3>
            <p className="text-sm text-gray-500">
              Reach out to our billing team at{' '}
              <a
                className="text-orange-500 hover:text-orange-600"
                href="mailto:billing@comfortcarrental.com"
              >
                billing@comfortcarrental.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;

