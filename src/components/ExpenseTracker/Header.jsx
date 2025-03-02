import React from 'react';
import { motion } from 'framer-motion';
import { ReceiptRefundIcon } from '@heroicons/react/24/outline';

const Header = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 flex items-center space-x-4"
    >
      <div className={`p-3 rounded-full ${theme.primary} bg-opacity-10`}>
        <ReceiptRefundIcon className={`w-8 h-8 ${theme.highlight}`} />
      </div>
      <div>
        <h1 className="md:text-3xl font-bold text-gray-900">Expense Tracker</h1>
        <p className="md:text-lg text-gray-600">Track and manage your daily expenses</p>
      </div>
    </motion.div>
  );
};

export default Header;
