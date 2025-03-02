import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { ChartBarIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

const FlexiblePaymentSchedule = ({ loan }) => {
  const { theme } = useTheme();
  const [selectedMonth, setSelectedMonth] = useState(null);

  if (!loan || !loan.schedule) return null;

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-gray-50 rounded-lg md:p-4 ">
        <h3 className="text-lg font-semibold mb-2">Payment Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white w-full">
          <div className={`p-4 rounded-lg ${theme.secondary} bg-opacity-10`}>
            <p className="text-sm">Monthly Payment</p>
            <p className="md:text-xl font-bold">{formatCurrency(loan.monthlyPayment)}</p>
          </div>
          <div className={`p-4 rounded-lg bg-gradient-to-b ${theme.secondary} bg-opacity-10`}>
            <p className="text-sm">Total Amount</p>
            <p className="md:text-xl font-bold">{formatCurrency(loan.totalAmount)}</p>
          </div>
          <div className={`p-4 rounded-lg ${theme.secondary} bg-opacity-10`}>
            <p className="text-sm">Loan Term</p>
            <p className="md:text-xl font-bold">{loan.loanTerm} months</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
              <th className="md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loan.schedule.map((payment, index) => (
              <motion.tr
                key={payment.month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`${selectedMonth === index ? 'bg-blue-50' : ''} hover:bg-gray-50 cursor-pointer`}
                onClick={() => setSelectedMonth(index)}
              >
                <td className="md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900">{payment.month}</td>
                <td className="md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payment.payment)}</td>
                <td className="md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(payment.remainingAmount)}</td>
                <td className="md:px-6 md:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${theme.primary} rounded-full h-2`}
                        style={{ width: `${payment.percentage}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{payment.percentage.toFixed(1)}%</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMonth !== null && loan.schedule[selectedMonth] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4 mt-4"
        >
          <h4 className="text-lg font-semibold mb-2">Payment Details - {loan.schedule[selectedMonth].month}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-600">Monthly Payment</p>
              </div>
              <p className="text-lg font-semibold mt-1">{formatCurrency(loan.schedule[selectedMonth].payment)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <ArrowTrendingDownIcon className="w-5 h-5 text-green-500" />
                <p className="text-sm text-gray-600">Remaining Amount</p>
              </div>
              <p className="text-lg font-semibold mt-1">{formatCurrency(loan.schedule[selectedMonth].remainingAmount)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-gray-600">Progress</p>
              </div>
              <p className="text-lg font-semibold mt-1">{loan.schedule[selectedMonth].percentage.toFixed(1)}% Paid</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FlexiblePaymentSchedule;
