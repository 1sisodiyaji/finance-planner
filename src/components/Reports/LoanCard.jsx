import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

const LoanCard = ({ loan, analytics }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${theme.secondary}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold">{loan.name}</h3>
          <p className="text-gray-600">Started on {new Date(loan.startDate).toLocaleDateString()}</p>
        </div>
        <div className={`p-3 rounded-full ${theme.primary} bg-opacity-10`}>
          <BanknotesIcon className={`w-6 h-6 ${theme.highlight}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-xl font-bold">₹{analytics.totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Monthly Payment</p>
          <p className="text-xl font-bold">₹{analytics.monthlyPayment.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-2">Repayment Timeline</h4>
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className={`${theme.primary} h-full rounded-full transition-all duration-500`}
            style={{ 
              width: `${(analytics.schedule[0]?.percentage || 0)}%`
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>Start: {analytics.startDate.toLocaleDateString()}</span>
          <span>End: {analytics.endDate.toLocaleDateString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Payment Schedule</h4>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {analytics.schedule.map((month, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{month.month}</p>
                <p className="text-sm text-gray-600">
                  Remaining: ₹{month.remainingAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">
                  ₹{month.payment.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  {month.percentage.toFixed(1)}% paid
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <h4 className="font-medium mb-4">Payment Progress</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics.schedule}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={1}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Area
                  type="monotone"
                  dataKey="remainingAmount"
                  stroke={theme.highlight}
                  fill={theme.primary}
                  fillOpacity={0.1}
                  name="Remaining Amount"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Monthly Payments</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analytics.schedule}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={1}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tickFormatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
                <Bar
                  dataKey="payment"
                  fill={theme.highlight}
                  name="Monthly Payment"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoanCard;
