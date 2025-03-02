import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { 
  CurrencyRupeeIcon,
  BanknotesIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const RecentTransactionCard = ({ item, type }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${theme.primary} bg-opacity-10`}>
          {type === 'expense' ? (
            <CurrencyRupeeIcon className={`w-5 h-5 ${theme.highlight}`} />
          ) : (
            <BanknotesIcon className={`w-5 h-5 ${theme.highlight}`} />
          )}
        </div>
        <div>
          <p className="font-medium">{type === 'expense' ? item.description : item.name}</p>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(item.date || item.startDate).toLocaleDateString()}</span>
            <TagIcon className="w-4 h-4 ml-2" />
            <span>{item.category}</span>
          </div>
        </div>
      </div>
      <p className={`font-semibold ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
        ₹{parseFloat(item.amount).toLocaleString()}
      </p>
    </motion.div>
  );
};

export default RecentTransactionCard;
