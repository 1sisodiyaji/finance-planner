import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  CalendarIcon,
  WalletIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { TagIcon } from 'lucide-react';

const RecentTransactionCard = ({ item, type }) => {
  if (!item) return null;

  const { theme } = useTheme();

  const formatAmount = (amount) => {
    if (!amount) return '0';
    const value = parseFloat(amount);
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  };

  const getDisplayTitle = () => {
    if (type === 'expense') {
      return item.description || 'Expense';
    }
    return item.purpose || item.name || 'Loan';
  };

  const getDisplayDate = () => {
    const date = item.date || item.startDate;
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${type === 'expense' ? 'bg-red-100' : 'bg-green-100'}`}>
          {type === 'expense' ? (
            <WalletIcon className={`w-5 h-5 ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`} />
          ) : (
            <BanknotesIcon className={`w-5 h-5 ${type === 'expense' ? 'text-red-600' : 'text-green-600'}`} />
          )}
        </div>
        <div>
          <p className="font-medium">{getDisplayTitle()}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{getDisplayDate()}</span>
            <TagIcon className="w-4 h-4 ml-2" />
            <span>{item.category}</span>
          </div>
        </div>
      </div>
      <p className={`font-semibold ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
        ₹{formatAmount(item.amount)}
      </p>
    </motion.div>
  );
};

export default RecentTransactionCard;
