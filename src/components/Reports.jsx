import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Cookies from 'js-cookie';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, ResponsiveContainer, BarChart, Bar, PieChart, Pie, RadarChart, 
  Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
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
  CheckCircleIcon,
  DocumentArrowDownIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const { theme } = useTheme();
  const [loans, setLoans] = useState([]);
  const [loanAnalytics, setLoanAnalytics] = useState([]);
  const [selectedLoanForOptimization, setSelectedLoanForOptimization] = useState(null);
  const [activeChart, setActiveChart] = useState('line');
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [healthScore, setHealthScore] = useState(0);
  const monthlySalary = 21200;

  // Prepare chart data
  const chartData = loanAnalytics.map(loan => ({
    name: loan.name,
    amount: loan.totalAmount,
    monthlyPayment: loan.monthlyPayment,
    progress: loan.schedule[0]?.percentage || 0
  }));

  useEffect(() => {
    const storedLoans = Cookies.get('loans');
    if (storedLoans) {
      const parsedLoans = JSON.parse(storedLoans);
      setLoans(parsedLoans);
      generateLoanAnalytics(parsedLoans);
      setHealthScore(calculateHealthScore(parsedLoans));
    }
  }, []);

  // Calculate total statistics
  const totalAmount = loanAnalytics.reduce((sum, loan) => sum + loan.totalAmount, 0);
  const totalMonthlyPayments = loanAnalytics.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  const debtToIncomeRatio = ((totalMonthlyPayments / monthlySalary) * 100).toFixed(1);

  const SummaryCard = ({ title, value, icon: Icon, color = 'blue' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

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

  const calculateHealthScore = (loansData) => {
    if (!loansData.length) return 0;
    
    const totalDebt = loansData.reduce((acc, loan) => acc + parseFloat(loan.amount), 0);
    const totalMonthlyPayments = loansData.reduce((acc, loan) => acc + parseFloat(loan.minimumPayment), 0);
    const debtToIncomeRatio = (totalMonthlyPayments / monthlySalary) * 100;
    
    // Score based on debt-to-income ratio (lower is better)
    let score = 100;
    if (debtToIncomeRatio > 40) score -= 40;
    else if (debtToIncomeRatio > 30) score -= 25;
    else if (debtToIncomeRatio > 20) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateOptimizedSchedule = (targetLoan, extraPayment) => {
    const amount = parseFloat(targetLoan.amount);
    const currentMonthlyPayment = parseFloat(targetLoan.monthlyPayment);
    const increasedMonthlyPayment = currentMonthlyPayment + extraPayment;
    const startDate = new Date();
    
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

  const OptimizationCard = ({ loan, completedLoan }) => {
    const extraPayment = parseFloat(completedLoan.monthlyPayment);
    const currentPayment = parseFloat(loan.monthlyPayment);
    const optimizedSchedule = calculateOptimizedSchedule(loan, extraPayment);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border-l-4 border-green-500"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">Payment Optimization</h3>
            <p className="text-sm text-gray-600">
              Redirect ₹{extraPayment.toLocaleString()} from {completedLoan.name}
            </p>
          </div>
          <CheckCircleIcon className="w-6 h-6 text-green-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Current Payment</p>
            <p className="text-lg font-semibold">₹{currentPayment.toLocaleString()}/mo</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-green-600">New Payment</p>
            <p className="text-lg font-semibold text-green-600">
              ₹{(currentPayment + extraPayment).toLocaleString()}/mo
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Time Saved</span>
            <span className="text-sm font-medium text-green-600">
              {optimizedSchedule.monthsSaved} months earlier
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{
                width: `${(optimizedSchedule.monthsSaved / optimizedSchedule.originalMonths) * 100}%`
              }}
            />
          </div>
        </div>

        <div className="h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={optimizedSchedule.schedule}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
              <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
              <Line
                type="monotone"
                dataKey="remainingAmount"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <button
          onClick={() => setSelectedLoanForOptimization(loan.id)}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Apply Optimization</span>
        </button>
      </motion.div>
    );
  };

  // Find completed and active loans
  const completedLoans = loanAnalytics.filter(loan => 
    loan.schedule[loan.schedule.length - 1]?.remainingAmount === 0
  );

  const activeLoans = loanAnalytics.filter(loan =>
    loan.schedule[loan.schedule.length - 1]?.remainingAmount > 0
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTimeFrame('monthly')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors duration-200 ${
                  timeFrame === 'monthly' 
                    ? `bg-gradient-to-b ${theme.primary} text-white` 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeFrame('quarterly')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors duration-200 ${
                  timeFrame === 'quarterly'
                    ? `bg-gradient-to-b ${theme.primary} text-white`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Quarterly
              </button>
              <button
                onClick={() => setTimeFrame('yearly')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-colors duration-200 ${
                  timeFrame === 'yearly'
                    ? `bg-gradient-to-b ${theme.primary} text-white`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <SummaryCard
            title="Total Loan Amount"
            value={`₹${totalAmount.toLocaleString()}`}
            icon={CurrencyRupeeIcon}
            color="blue"
          />
          <SummaryCard
            title="Monthly Payments"
            value={`₹${totalMonthlyPayments.toLocaleString()}`}
            icon={ArrowTrendingDownIcon}
            color="green"
          />
          <SummaryCard
            title="Debt-to-Income Ratio"
            value={`${debtToIncomeRatio}%`}
            icon={ChartBarIcon}
            color={Number(debtToIncomeRatio) > 40 ? 'red' : 'green'}
          />
        </div>

        {/* Optimization Section */}
        {completedLoans.length < 0 && activeLoans.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Loan Optimization Opportunities</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {activeLoans.map(loan => (
                <OptimizationCard
                  key={loan.id}
                  loan={loan}
                  completedLoan={completedLoans[0]}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Loan Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {loans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              analytics={loanAnalytics.find((a) => a.id === loan.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {loans.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-xl shadow-sm"
          >
            <DocumentChartBarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Loans Found</h3>
            <p className="text-gray-600">Add loans to see detailed reports and analysis</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Reports;