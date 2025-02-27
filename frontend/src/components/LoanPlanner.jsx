import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { 
  CalendarIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  TrashIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const LoanPlanner = () => {
  const { theme } = useTheme();
  const [loans, setLoans] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingLoan, setEditingLoan] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    amount: '',
    startDate: '',
    minimumPayment: '',
  });

  useEffect(() => {
    const storedLoans = Cookies.get('loans');
    if (storedLoans) {
      setLoans(JSON.parse(storedLoans));
    }
  }, []);

  const saveLoansToCookies = (updatedLoans) => {
    Cookies.set('loans', JSON.stringify(updatedLoans), { expires: 7 }); // Save for 7 days
  };

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

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
    
    setLoans(updatedLoans);
    saveLoansToCookies(updatedLoans);
    resetForm();
    setIsSubmitting(false);
  };

  const handleEdit = (loan) => {
    setEditingLoan(loan);
    setFormData({ ...loan });
  };

  const handleDelete = (loanId) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      const updatedLoans = loans.filter(loan => loan.id !== loanId);
      setLoans(updatedLoans);
      saveLoansToCookies(updatedLoans);
      showSuccessMessage('Loan deleted successfully!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center space-x-4"
      >
        <div className={`p-3 rounded-full ${theme.primary} bg-opacity-10`}>
          <BanknotesIcon className={`w-8 h-8 ${theme.highlight}`} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Planner</h1>
          <p className="text-gray-600">Manage your loans with ease</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${theme.secondary}`}
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
                    <span>{editingLoan ? 'Updating...' : 'Adding...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{editingLoan ? 'Update Loan' : 'Add Loan'}</span>
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
          <h2 className="text-xl font-semibold mb-4">Your Loans</h2>
          {loans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <XCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Loans Yet</h3>
              <p className="text-gray-600">Start by adding your first loan</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <motion.div
                  key={loan.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${theme.secondary} hover:shadow-lg transition-shadow duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{loan.name}</h3>
                      <div className="space-y-1 text-gray-600">
                        <p className="flex items-center">
                          <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                          Amount: ${parseFloat(loan.amount).toLocaleString()}
                        </p>
                        <p className="flex items-center">
                          <CalendarIcon className="w-5 h-5 mr-2" />
                          Start: {new Date(loan.startDate).toLocaleDateString()}
                        </p>
                        <p className="flex items-center">
                          <BanknotesIcon className="w-5 h-5 mr-2" />
                          Monthly: ${parseFloat(loan.minimumPayment).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => handleEdit(loan)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <PencilIcon className="w-5 h-5 text-gray-600" />
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(loan.id)}
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

export default LoanPlanner;
