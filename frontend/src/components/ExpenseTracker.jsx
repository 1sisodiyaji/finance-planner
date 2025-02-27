import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import {
  CalendarIcon,
  CurrencyDollarIcon,
  TagIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Loans',
  'Other'
];

const ExpenseTracker = () => {
  const { theme } = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    const storedExpenses = Cookies.get('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  const saveExpensesToCookies = (updatedExpenses) => {
    Cookies.set('expenses', JSON.stringify(updatedExpenses), { expires: 7 });
  };

  const resetForm = () => {
    setFormData({
      id: '',
      description: '',
      amount: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingExpense(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let updatedExpenses;
    if (editingExpense) {
      updatedExpenses = expenses.map(expense =>
        expense.id === editingExpense.id ? { ...formData, id: expense.id } : expense
      );
      showSuccessMessage('Expense updated successfully! ');
    } else {
      const newExpense = {
        ...formData,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      updatedExpenses = [...expenses, newExpense];
      showSuccessMessage('New expense added successfully! ');
    }

    setExpenses(updatedExpenses);
    saveExpensesToCookies(updatedExpenses);
    resetForm();
    setIsSubmitting(false);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({ ...expense });
  };

  const handleDelete = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
      setExpenses(updatedExpenses);
      saveExpensesToCookies(updatedExpenses);
      showSuccessMessage('Expense deleted successfully! ');
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center space-x-4"
      >
        <div className={`p-3 rounded-full ${theme.primary} bg-opacity-10`}>
          <ReceiptRefundIcon className={`w-8 h-8 ${theme.highlight}`} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600">Track and manage your daily expenses</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${theme.secondary}`}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            {editingExpense ? ' Edit Expense' : ' Add New Expense'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="What did you spend on?"
                required
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className={`h-5 w-5 ${theme.highlight}`} />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <TagIcon className={`h-5 w-5 ${theme.highlight}`} />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                >
                  {EXPENSE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className={`h-5 w-5 ${theme.highlight}`} />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes..."
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                rows="3"
              />
            </div>

            <div className="flex justify-end space-x-3">
              {editingExpense && (
                <motion.button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 flex items-center space-x-2 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <XCircleIcon className="w-5 h-5" />
                  <span>Cancel</span>
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`${theme.primary} text-white px-6 py-3 rounded-xl flex items-center space-x-2 disabled:opacity-50 transition-all duration-200`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    <span>{editingExpense ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{editingExpense ? 'Update Expense' : 'Add Expense'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Expenses</h2>
            <div className={`${theme.primary} bg-opacity-10 px-4 py-2 rounded-xl`}>
              <p className="text-sm font-medium">
                Total Expenses: <span className="font-bold">₹{getTotalExpenses().toLocaleString()}</span>
              </p>
            </div>
          </div>

          {expenses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <ChartBarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Expenses Yet</h3>
              <p className="text-gray-600">Start tracking your expenses using the form</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <motion.div
                  key={expense.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${theme.secondary} hover:shadow-lg transition-shadow duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{expense.description}</h3>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center">
                          <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                          ₹{parseFloat(expense.amount).toLocaleString()}
                        </p>
                        <p className="flex items-center">
                          <TagIcon className="w-5 h-5 mr-2" />
                          {expense.category}
                        </p>
                        <p className="flex items-center">
                          <CalendarIcon className="w-5 h-5 mr-2" />
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                        {expense.notes && (
                          <p className="text-sm text-gray-500 mt-2">{expense.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleEdit(expense)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <PencilIcon className="w-5 h-5 text-gray-600" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(expense.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <TrashIcon className="w-5 h-5 text-red-500" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseTracker;