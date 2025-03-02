import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import {
  CurrencyDollarIcon,
  TagIcon,
  ArrowPathIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Loans',
  'Other'
];

const ExpenseForm = ({ expenses, editingExpense, setEditingExpense, onExpenseUpdate, showSuccessMessage }) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({ ...editingExpense });
    }
  }, [editingExpense]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let updatedExpenses;
    if (editingExpense) {
      updatedExpenses = expenses.map(expense =>
        expense.id === editingExpense.id ? { ...formData, id: expense.id } : expense
      );
      showSuccessMessage('Expense updated successfully!');
    } else {
      const newExpense = {
        ...formData,
        id: uuidv4(),
        createdAt: new Date().toISOString()
      };
      updatedExpenses = [...expenses, newExpense];
      showSuccessMessage('New expense added successfully!');
    }

    onExpenseUpdate(updatedExpenses);
    resetForm();
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${theme.border}`}
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center">
        {editingExpense ? '✏️ Edit Expense' : '💰 Add New Expense'}
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
            placeholder="Add any additional notes..."
            className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
          />
        </div>

        <div className="flex justify-end space-x-3">
          {editingExpense && (
            <button
              type="button"
              onClick={resetForm}
              className={`px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200`}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-gradient-to-r ${theme.primary} text-white rounded-lg hover:opacity-90 transition-colors duration-200 flex items-center space-x-2`}
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>{editingExpense ? 'Update' : 'Add'} Expense</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ExpenseForm;
