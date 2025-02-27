import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import Cookies from 'js-cookie';
import {
  ChartBarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  TagIcon,
  WalletIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [loans, setLoans] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const monthlySalary = 21200; // Fixed monthly salary

  useEffect(() => {
    // Load data from cookies
    const storedExpenses = Cookies.get('expenses');
    const storedLoans = Cookies.get('loans');

    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses);
      setExpenses(parsedExpenses);
      calculateExpenseStats(parsedExpenses);
    }

    if (storedLoans) {
      const parsedLoans = JSON.parse(storedLoans);
      setLoans(parsedLoans);
      calculateLoanStats(parsedLoans);
    }
  }, []);

  const calculateExpenseStats = (expenseData) => {
    const total = expenseData.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
    setTotalExpenses(total);

    // Calculate expenses by category
    const categoryTotals = expenseData.reduce((acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + parseFloat(expense.amount || 0);
      return acc;
    }, {});
    setExpensesByCategory(categoryTotals);
  };

  const calculateLoanStats = (loanData) => {
    const total = loanData.reduce((sum, loan) => sum + parseFloat(loan.amount || 0), 0);
    setTotalLoans(total);
  };

  const StatCard = ({ title, amount, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-2xl shadow-md border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">₹{amount.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full ${theme.primary} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${theme.highlight}`} />
        </div>
      </div>
    </motion.div>
  );

  const CategoryCard = ({ category, amount, total }) => {
    const percentage = total > 0 ? (amount / total) * 100 : 0;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-4 rounded-xl shadow-sm"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">{category}</span>
          <span className="text-gray-600">₹{amount.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${theme.primary} rounded-full h-2`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</p>
      </motion.div>
    );
  };

  const RecentTransactionCard = ({ item, type }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${theme.primary} bg-opacity-10`}>
          {type === 'expense' ? (
            <CurrencyRupeeIcon className={`w-5 h-5 ${theme.highlight}`} />
          ) : (
            <BanknotesIcon className={`w-5 h-5 ${theme.highlight}`} />
          )}
        </div>
        <div>
          <p className="font-medium">{type === 'expense' ? item.description : item.name}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(item.date || item.startDate).toLocaleDateString()}</span>
            <TagIcon className="w-4 h-4 ml-2" />
            <span>{item.category}</span>
          </div>
        </div>
      </div>
      <p className={`font-semibold ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
        ₹{parseFloat(item.amount).toLocaleString()}
      </p>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-gray-600">Overview of your finances</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
          <WalletIcon className={`w-6 h-6 ${theme.highlight}`} />
          <div>
            <p className="text-sm text-gray-600">Monthly Salary</p>
            <p className="text-xl font-bold">₹21,200</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Expenses"
          amount={totalExpenses}
          icon={ChartBarIcon}
          color={theme.secondary}
        />
        <StatCard
          title="Total Loans"
          amount={totalLoans}
          icon={BanknotesIcon}
          color={theme.secondary}
        />
        <StatCard
          title="Net Balance"
          amount={monthlySalary - totalExpenses}
          icon={ArrowTrendingUpIcon}
          color={theme.secondary}
        />
        <StatCard
          title="Savings Potential"
          amount={Math.max(0, monthlySalary - totalExpenses - totalLoans)}
          icon={CurrencyRupeeIcon}
          color={theme.secondary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold">Expense Categories</h2>
          <div className="grid gap-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <CategoryCard
                key={category}
                category={category}
                amount={amount}
                total={totalExpenses}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <div className="space-y-4">
            {[
              ...expenses.map(expense => ({ ...expense, type: 'expense' })),
              ...loans.map(loan => ({ ...loan, type: 'loan' }))
            ]
              .sort((a, b) => new Date(b.date || b.startDate) - new Date(a.date || a.startDate))
              .slice(0, 5)
              .map(item => (
                <RecentTransactionCard
                  key={item.id}
                  item={item}
                  type={item.type}
                />
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
