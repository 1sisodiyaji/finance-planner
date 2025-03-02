import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from '../context/ThemeContext';
import { ArrowTrendingUpIcon, BanknotesIcon, CurrencyRupeeIcon, WalletIcon } from '@heroicons/react/24/outline';
import { StatCard, CategoryCard, RecentTransactionCard } from '../components/Dashboard';
import { ChartBarIcon } from 'lucide-react';

const Dashboard = () => {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [loans, setLoans] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const monthlySalary = 21200;

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    const storedLoans = localStorage.getItem('loans');

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

  return (
    <>
      <Helmet>
        <title>Dashboard | Finance Planner</title>
        <meta name="description" content="View your financial overview, track expenses, monitor loans, and analyze your spending patterns in one place." />
        <meta name="keywords" content="financial dashboard, expense tracking, loan monitoring, financial overview" />
         
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dashboard | Finance Planner" />
        <meta property="og:description" content="View your financial overview, track expenses, monitor loans, and analyze your spending patterns in one place." />
        <meta property="og:image" content="/android-chrome-512x512.png" />
         
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Dashboard | Finance Planner" />
        <meta property="twitter:description" content="View your financial overview, track expenses, monitor loans, and analyze your spending patterns in one place." />
        <meta property="twitter:image" content="/android-chrome-512x512.png" />
      </Helmet>
      <div className="max-w-7xl mx-auto md:px-4 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="md:text-3xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="md:text-lg text-gray-600">Overview of your finances</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center space-x-3">
            <WalletIcon className={`w-6 h-6 ${theme.highlight}`} />
            <div>
              <p className="md:text-sm text-gray-600">Monthly Salary</p>
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
              {[...expenses, ...loans]
                .sort((a, b) => new Date(b.date || b.startDate) - new Date(a.date || a.startDate))
                .slice(0, 5)
                .map((item) => (
                  <RecentTransactionCard
                    key={item.id}
                    item={item}
                    type={item.description ? 'expense' : 'loan'}
                  />
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
