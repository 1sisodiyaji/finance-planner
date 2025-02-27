import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Cookies from 'js-cookie';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  CalendarIcon,
  BanknotesIcon,
  ChartBarIcon,
  DocumentChartBarIcon,
  ArrowTrendingDownIcon,
  CurrencyRupeeIcon,
  WalletIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const { theme } = useTheme();
  const [loans, setLoans] = useState([]);
  const [loanAnalytics, setLoanAnalytics] = useState([]);
  const [optimizedAnalytics, setOptimizedAnalytics] = useState(null);
  const [selectedLoanForOptimization, setSelectedLoanForOptimization] = useState(null);
  const monthlySalary = 21200;

  useEffect(() => {
    const storedLoans = Cookies.get('loans');
    if (storedLoans) {
      const parsedLoans = JSON.parse(storedLoans);
      setLoans(parsedLoans);
      generateLoanAnalytics(parsedLoans);
    }
  }, []);

  const generateLoanAnalytics = (loansData) => {
    const analytics = loansData.map(loan => {
      const amount = parseFloat(loan.amount);
      const monthlyPayment = parseFloat(loan.minimumPayment);
      const startDate = new Date(loan.startDate);
      
      // Calculate months needed to repay
      const monthsToRepay = Math.ceil(amount / monthlyPayment);
      
      // Generate monthly payment schedule
      const schedule = [];
      let remainingAmount = amount;
      let currentDate = new Date(startDate);
      
      for (let i = 0; i < monthsToRepay; i++) {
        const payment = Math.min(monthlyPayment, remainingAmount);
        remainingAmount -= payment;
        
        schedule.push({
          month: new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          payment,
          remainingAmount: Math.max(0, remainingAmount),
          percentage: ((amount - remainingAmount) / amount) * 100
        });
        
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      return {
        id: loan.id,
        name: loan.name,
        totalAmount: amount,
        monthlyPayment,
        startDate,
        endDate: currentDate,
        monthsToRepay,
        schedule,
        totalInterest: 0, // You can add interest calculation if needed
      };
    });

    setLoanAnalytics(analytics);
  };

  const calculateOptimizedSchedule = (targetLoan, extraPayment) => {
    const amount = parseFloat(targetLoan.amount);
    const currentMonthlyPayment = parseFloat(targetLoan.monthlyPayment);
    const increasedMonthlyPayment = currentMonthlyPayment + extraPayment; // Full payment merge
    const startDate = new Date();  // Start from current date for the merge
    
    // Calculate new repayment timeline with merged payment
    const remainingAmount = targetLoan.schedule[0]?.remainingAmount || amount;
    const monthsToRepay = Math.ceil(remainingAmount / increasedMonthlyPayment);
    const schedule = [];
    let currentRemaining = remainingAmount;
    let currentDate = new Date(startDate);
    
    for (let i = 0; i < monthsToRepay; i++) {
      const payment = Math.min(increasedMonthlyPayment, currentRemaining);
      currentRemaining -= payment;
      
      schedule.push({
        month: new Date(currentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        payment,
        remainingAmount: Math.max(0, currentRemaining),
        percentage: ((amount - currentRemaining) / amount) * 100,
        monthlyPayment: increasedMonthlyPayment
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Calculate original timeline for comparison
    const originalMonthsRemaining = Math.ceil(remainingAmount / currentMonthlyPayment);

    return {
      id: targetLoan.id,
      name: targetLoan.name,
      totalAmount: amount,
      originalMonthlyPayment: currentMonthlyPayment,
      newMonthlyPayment: increasedMonthlyPayment,
      startDate,
      endDate: currentDate,
      monthsToRepay,
      schedule,
      originalMonths: originalMonthsRemaining,
      monthsSaved: originalMonthsRemaining - monthsToRepay,
      totalSaved: (originalMonthsRemaining - monthsToRepay) * currentMonthlyPayment
    };
  };

  const LoanCard = ({ loan, analytics }) => (
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
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Payment']}
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

  const OptimizationCard = ({ loan, completedLoan }) => {
    const extraPayment = parseFloat(completedLoan.monthlyPayment);
    const currentPayment = parseFloat(loan.monthlyPayment);
    const optimizedSchedule = calculateOptimizedSchedule(loan, extraPayment);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold">Payment Merge Opportunity</h3>
            <p className="text-gray-600">
              Add entire payment of ₹{extraPayment.toLocaleString()} from {completedLoan.name}
            </p>
          </div>
          <CheckCircleIcon className="w-8 h-8 text-green-500" />
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">Current Monthly Payment</p>
              <p className="text-lg font-bold">₹{currentPayment.toLocaleString()}</p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 ${theme.primary} rounded-full`}
                style={{ width: '40%' }}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-600">New Monthly Payment</p>
              <p className="text-lg font-bold text-green-600">
                ₹{(currentPayment + extraPayment).toLocaleString()}
              </p>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-green-800 mb-2">Impact Analysis</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-green-700">Original Timeline</p>
              <p className="text-xl font-bold text-green-800">{optimizedSchedule.originalMonths} months</p>
            </div>
            <div>
              <p className="text-sm text-green-700">New Timeline</p>
              <p className="text-xl font-bold text-green-800">{optimizedSchedule.monthsToRepay} months</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-green-700 mb-1">
              <span>Time Saved</span>
              <span>{optimizedSchedule.monthsSaved} months earlier</span>
            </div>
            <div className="h-2 bg-green-200 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(optimizedSchedule.monthsSaved / optimizedSchedule.originalMonths) * 100}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-4">Payment Schedule Comparison</h4>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
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
                <Legend />
                <Line
                  type="monotone"
                  data={loan.schedule}
                  dataKey="remainingAmount"
                  stroke={theme.highlight}
                  name="Current Schedule"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  data={optimizedSchedule.schedule}
                  dataKey="remainingAmount"
                  stroke="rgb(34, 197, 94)"
                  name="With Merged Payment"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <div>
            <p className="text-sm text-gray-600">Monthly Savings</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{optimizedSchedule.totalSaved.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount Saved</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{optimizedSchedule.totalSaved.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedLoanForOptimization(loan.id)}
          className={`w-full py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2`}
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Merge Payments (₹{(currentPayment + extraPayment).toLocaleString()}/month)</span>
        </button>
      </motion.div>
    );
  };

  const SummaryCard = ({ title, value, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
    >
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${theme.primary} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${theme.highlight}`} />
      </div>
    </motion.div>
  );

  const totalAmount = loanAnalytics.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const totalMonthlyPayments = loanAnalytics.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const averageMonths = loanAnalytics.length > 0
    ? Math.round(loanAnalytics.reduce((sum, loan) => sum + loan.monthsToRepay, 0) / loanAnalytics.length)
    : 0;

  // Find completed loans and potential optimizations
  const completedLoans = loanAnalytics.filter(loan => 
    loan.schedule[loan.schedule.length - 1]?.remainingAmount === 0
  );

  const activeLoans = loanAnalytics.filter(loan =>
    loan.schedule[loan.schedule.length - 1]?.remainingAmount > 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Reports</h1>
          <p className="text-gray-600">Detailed analysis of your loans and repayment schedules</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
          <WalletIcon className={`w-6 h-6 ${theme.highlight}`} />
          <div>
            <p className="text-sm text-gray-600">Monthly Income</p>
            <p className="text-xl font-bold">₹21,200</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Loan Amount"
          value={`₹${totalAmount.toLocaleString()}`}
          icon={CurrencyRupeeIcon}
        />
        <SummaryCard
          title="Monthly Payments"
          value={`₹${totalMonthlyPayments.toLocaleString()}`}
          icon={ArrowTrendingDownIcon}
        />
        <SummaryCard
          title="Debt-to-Income Ratio"
          value={`${((totalMonthlyPayments / monthlySalary) * 100).toFixed(1)}%`}
          icon={ChartBarIcon}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Overall Loan Progress</h2>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Total EMI:</span> ₹{totalMonthlyPayments.toLocaleString()} / month
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              {loanAnalytics.map((loan, index) => (
                <Line
                  key={loan.id}
                  type="monotone"
                  data={loan.schedule}
                  dataKey="remainingAmount"
                  name={`${loan.name} (₹${loan.monthlyPayment.toLocaleString()}/month)`}
                  stroke={`hsl(${(index * 360) / loanAnalytics.length}, 70%, 50%)`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loanAnalytics.map((loan, index) => (
            <div
              key={loan.id}
              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{loan.name}</p>
                <p className="text-sm text-gray-600">
                  {loan.monthsToRepay} months remaining
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">
                  ₹{loan.monthlyPayment.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {completedLoans.length > 0 && activeLoans.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Loan Optimization Opportunities</h2>
          <p className="text-gray-600 mb-6">
            Redirect payments from completed loans to accelerate your remaining loan repayments
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeLoans.map(loan => (
              <OptimizationCard
                key={loan.id}
                loan={loan}
                completedLoan={completedLoans[0]} // Using the first completed loan for optimization
              />
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loans.map((loan, index) => (
          <LoanCard
            key={loan.id}
            loan={loan}
            analytics={loanAnalytics[index]}
          />
        ))}
      </div>

      {loans.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <DocumentChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Loans Found</h3>
          <p className="text-gray-600">Add loans to see detailed reports and analysis</p>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;