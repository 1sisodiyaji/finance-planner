import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { LoanForm, LoanList } from '../components/LoanPlanner';
import { Helmet } from 'react-helmet';

const LoanPlanner = () => {
  const { theme } = useTheme();
  const [loans, setLoans] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingLoan, setEditingLoan] = useState(null);

  useEffect(() => {
    const storedLoans = localStorage.getItem('loans');
    if (storedLoans) {
      setLoans(JSON.parse(storedLoans));
    }
  }, []);

  const handleLoanUpdate = (updatedLoans) => {
    setLoans(updatedLoans);
    localStorage.setItem('loans', JSON.stringify(updatedLoans));
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <>
      <Helmet>
        <title>Loan Planner | Finance Planner</title>
        <meta name="description" content="Plan and manage your loans, calculate EMIs, track loan payments, and analyze your loan portfolio effectively." />
        <meta name="keywords" content="loan planner, EMI calculator, loan management, loan tracking, financial planning" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Loan Planner | Finance Planner" />
        <meta property="og:description" content="Plan and manage your loans, calculate EMIs, track loan payments, and analyze your loan portfolio effectively." />
        <meta property="og:image" content="/android-chrome-512x512.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Loan Planner | Finance Planner" />
        <meta property="twitter:description" content="Plan and manage your loans, calculate EMIs, track loan payments, and analyze your loan portfolio effectively." />
        <meta property="twitter:image" content="/android-chrome-512x512.png" />
      </Helmet>
      <div className="max-w-6xl mx-auto md:px-4 md:py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center space-x-4"
        >
          <div className={`p-3 rounded-full bg-gradient-to-r ${theme.primary} bg-opacity-10`}>
            <BanknotesIcon className={`w-8 h-8 text-white`} />
          </div>
          <div>
            <h1 className="md:text-3xl font-bold text-gray-900">Loan Planner</h1>
            <p className="md:text-lg text-gray-600">Manage your loans with ease</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LoanForm
            loans={loans}
            editingLoan={editingLoan}
            setEditingLoan={setEditingLoan}
            onLoanUpdate={handleLoanUpdate}
            showSuccessMessage={showSuccessMessage}
          />
          <LoanList
            loans={loans}
            onEdit={setEditingLoan}
            onLoanUpdate={handleLoanUpdate}
            showSuccessMessage={showSuccessMessage}
          />
        </div>

        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LoanPlanner;
