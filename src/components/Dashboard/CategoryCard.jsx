import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const CategoryCard = ({ category, amount, total }) => {
  const { theme } = useTheme();
  const percentage = total > 0 ? (amount / total) * 100 : 0;

  const formatAmount = (value) => {
    if (!value) return '0';
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-lg shadow-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">{category}</span>
        <span className="text-gray-600">₹{formatAmount(amount)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-gradient-to-r ${theme.primary} rounded-full h-2`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-right">
        <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
      </div>
    </motion.div>
  );
};

export default CategoryCard;
