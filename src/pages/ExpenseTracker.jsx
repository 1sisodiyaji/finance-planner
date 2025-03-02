import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from '../context/ThemeContext';
import { ExpenseForm, ExpenseList, Header, SuccessMessage } from '../components/ExpenseTracker';

const ExpenseTracker = () => {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  const handleExpenseUpdate = (updatedExpenses) => {
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Expense Tracker | Finance Planner</title>
        <meta name="description" content="Track and manage your daily expenses, categorize spending, and maintain a detailed record of your financial transactions." />
        <meta name="keywords" content="expense tracker, spending management, expense categories, financial tracking" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Expense Tracker | Finance Planner" />
        <meta property="og:description" content="Track and manage your daily expenses, categorize spending, and maintain a detailed record of your financial transactions." />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Expense Tracker | Finance Planner" />
        <meta property="twitter:description" content="Track and manage your daily expenses, categorize spending, and maintain a detailed record of your financial transactions." />
        <meta property="twitter:image" content="/android-chrome-512x512.png" />
      </Helmet>
      <div className="max-w-6xl mx-auto md:px-4 md:py-8">
        <Header theme={theme} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExpenseForm
            expenses={expenses}
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
            onExpenseUpdate={handleExpenseUpdate}
            showSuccessMessage={showSuccessMessage}
          />
          <ExpenseList
            expenses={expenses}
            onEdit={setEditingExpense}
            onExpenseUpdate={handleExpenseUpdate}
            showSuccessMessage={showSuccessMessage}
          />
        </div>
        <AnimatePresence>
          {showSuccess && (
            <SuccessMessage
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              message={successMessage}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ExpenseTracker;