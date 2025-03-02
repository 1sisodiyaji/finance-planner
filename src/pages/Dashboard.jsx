import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from '../context/ThemeContext';
import { ArrowTrendingUpIcon, BanknotesIcon, CurrencyRupeeIcon, WalletIcon, PencilIcon } from '@heroicons/react/24/outline';
import { StatCard, CategoryCard, RecentTransactionCard, SideIncomeCard } from '../components/Dashboard';
import { LayoutDashboardIcon } from 'lucide-react';

const Dashboard = () => {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [loans, setLoans] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalLoans, setTotalLoans] = useState(0);
  const [expensesByCategory, setExpensesByCategory] = useState({});
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [tempSalary, setTempSalary] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const updateTotalIncome = (salary, sideIncomes = []) => {
    const sideIncomeTotal = sideIncomes.reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);
    const total = parseFloat(salary) + sideIncomeTotal;
    setTotalIncome(total);
    localStorage.setItem('totalIncome', total.toString());
  };

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

  const updateRecentTransactions = (expenses = [], loans = []) => {
    const allTransactions = [
      ...expenses.map(exp => ({ ...exp, type: 'expense' })),
      ...loans.map(loan => ({ ...loan, type: 'loan' }))
    ]
    .sort((a, b) => new Date(b.date || b.startDate) - new Date(a.date || a.startDate))
    .slice(0, 5);
    
    setRecentTransactions(allTransactions);
  };

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    const storedLoans = localStorage.getItem('loans');
    const storedSalary = localStorage.getItem('monthlySalary');
    const storedSideIncomes = localStorage.getItem('sideIncomes');

    const parsedExpenses = storedExpenses ? JSON.parse(storedExpenses) : [];
    const parsedLoans = storedLoans ? JSON.parse(storedLoans) : [];
    const parsedSalary = storedSalary ? parseFloat(storedSalary) : 0;
    const parsedSideIncomes = storedSideIncomes ? JSON.parse(storedSideIncomes) : [];

    setExpenses(parsedExpenses);
    setLoans(parsedLoans);
    setMonthlySalary(parsedSalary);

    calculateExpenseStats(parsedExpenses);
    calculateLoanStats(parsedLoans);
    updateTotalIncome(parsedSalary, parsedSideIncomes);
    updateRecentTransactions(parsedExpenses, parsedLoans);
  }, []);

  const handleSideIncomeUpdate = (sideIncomes) => {
    updateTotalIncome(monthlySalary, sideIncomes);
  };

  const handleSalarySubmit = () => {
    const newSalary = parseFloat(tempSalary);
    if (!isNaN(newSalary) && newSalary >= 0) {
      setMonthlySalary(newSalary);
      localStorage.setItem('monthlySalary', newSalary.toString());
      setIsEditingSalary(false);
      updateTotalIncome(newSalary);
    }
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | Finance Planner</title>
        <meta name="description" content="View your financial overview, track expenses, and monitor loan payments." />
        <meta name="keywords" content="dashboard, finance overview, expense tracking, loan monitoring" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dashboard | Finance Planner" />
        <meta property="og:description" content="View your financial overview, track expenses, and monitor loan payments." />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Dashboard | Finance Planner" />
        <meta property="twitter:description" content="View your financial overview, track expenses, and monitor loan payments." />
        <meta property="twitter:image" content="/android-chrome-512x512.png" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center space-x-4"
        >
         <div className={`p-3 rounded-full bg-gradient-to-r ${theme.primary} bg-opacity-10`}>
            <LayoutDashboardIcon className={`w-8 h-8 text-white`} />
          </div>
          <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-lg text-gray-600">Track your finances and plan your future</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Monthly Income"
            value={`₹${totalIncome}`}
            icon={CurrencyRupeeIcon}
            color="border-green-200"
          >
            <div className="mt-2">
              {isEditingSalary ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={tempSalary}
                    onChange={(e) => setTempSalary(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter salary"
                  />
                  <button
                    onClick={handleSalarySubmit}
                    className={`px-2 py-1 rounded text-black text-sm bg-gradient-to-r ${theme.primary}`}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Salary: ₹{monthlySalary}</span>
                  <button
                    onClick={() => {
                      setTempSalary(monthlySalary.toString());
                      setIsEditingSalary(true);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </StatCard>
          <StatCard
            title="Total Expenses"
            value={`₹${totalExpenses}`}
            icon={WalletIcon}
            color="border-red-200"
          />
          <StatCard
            title="Total Loans"
            value={`₹${totalLoans}`}
            icon={BanknotesIcon}
            color="border-yellow-200"
          />
          <StatCard
            title="Savings Rate"
            value={`${totalIncome > 0 ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1) : 0}%`}
            icon={ArrowTrendingUpIcon}
            color="border-blue-200"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SideIncomeCard onUpdate={handleSideIncomeUpdate} />
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Expense Categories</h2>
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <CategoryCard 
                key={category}
                category={category}
                amount={amount}
                total={totalExpenses}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <RecentTransactionCard
                key={transaction.id || index}
                item={transaction}
                type={transaction.type}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
