import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import { 
  CalendarIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const LoanForm = ({ loans, editingLoan, setEditingLoan, onLoanUpdate, showSuccessMessage }) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    amount: '',
    startDate: '',
    minimumPayment: '',
  });

  useEffect(() => {
    if (editingLoan) {
      setFormData({ ...editingLoan });
    }
  }, [editingLoan]);

  const resetForm = () => {
    setFormData({ id: '', name: '', amount: '', startDate: '', minimumPayment: '' });
    setEditingLoan(null);
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
    
    let updatedLoans;
    if (editingLoan) {
      updatedLoans = loans.map(loan => loan.id === editingLoan.id ? { ...formData, id: loan.id } : loan);
      showSuccessMessage('Loan updated successfully!');
    } else {
      const newLoan = { ...formData, id: uuidv4(), createdAt: new Date().toISOString() };
      updatedLoans = [...loans, newLoan];
      showSuccessMessage('Loan added successfully!');
    }
    
    onLoanUpdate(updatedLoans);
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
        {editingLoan ? '✏️ Edit Loan' : '💰 Add New Loan'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Loan Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DocumentTextIcon className={`h-5 w-5 ${theme.highlight}`} />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Car Loan"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Loan Amount</label>
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
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className={`h-5 w-5 ${theme.highlight}`} />
            </div>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Monthly Payment</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CurrencyDollarIcon className={`h-5 w-5 ${theme.highlight}`} />
            </div>
            <input
              type="number"
              name="minimumPayment"
              value={formData.minimumPayment}
              onChange={handleInputChange}
              placeholder="Enter monthly payment"
              min="0"
              step="0.01"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          {editingLoan && (
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
              <>
                {editingLoan ? 'Update' : 'Add'} Loan
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default LoanForm;
