import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const LoanList = ({ loans, onEdit, onLoanUpdate, showSuccessMessage }) => {
  const { theme } = useTheme();

  const handleDelete = (loanId) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      const updatedLoans = loans.filter(loan => loan.id !== loanId);
      onLoanUpdate(updatedLoans);
      showSuccessMessage('Loan deleted successfully!');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl shadow-lg md:p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Your Loans</h2>
      <div className="space-y-4">
        {loans.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No loans added yet</p>
        ) : (
          loans.map(loan => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl border-l-4 ${theme.border} text-white ${theme.secondary}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{loan.name}</h3>
                  <p >Amount: {formatCurrency(loan.amount)}</p>
                  <p >Monthly Payment: {formatCurrency(loan.minimumPayment)}</p>
                  <p >Start Date: {formatDate(loan.startDate)}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(loan)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(loan.id)}
                    className="p-2 text-gray-900 hover:text-red-600 transition-colors duration-200 cursor-pointer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default LoanList;
