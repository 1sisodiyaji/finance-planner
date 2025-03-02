import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon, 
} from '@heroicons/react/24/outline';
import { IndianRupeeIcon } from 'lucide-react';

const ExpenseList = ({ expenses, onEdit, onExpenseUpdate, showSuccessMessage }) => {
  const { theme } = useTheme();

  const handleDelete = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
      onExpenseUpdate(updatedExpenses);
      showSuccessMessage('Expense deleted successfully!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white md:p-6 px-1 py-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Expenses</h2>
          <div className={`px-4 py-2 ${theme.accent}  bg-opacity-10 rounded-lg`}>
            <span className={`font-semibold text-white`}>
              Total: {formatCurrency(getTotalExpenses())}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expenses recorded yet</p>
          ) : (
            expenses.map(expense => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-xl bg-gradient-to-r ${theme.primary} border-l-4 ${theme.border} bg-gray-50`}
              >
                <div className="flex justify-between items-start text-white ">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{expense.description}</h3>
                    <div className="flex items-center text-sm space-x-4">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span className='text-nowrap'>{formatDate(expense.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TagIcon className="w-4 h-4" />
                        <span>{expense.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <IndianRupeeIcon className="w-4 h-4" />
                        <span>{formatCurrency(expense.amount)}</span>
                      </div>
                    </div>
                    {expense.notes && (
                      <p className="text-sm mt-1">{expense.notes}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseList;
