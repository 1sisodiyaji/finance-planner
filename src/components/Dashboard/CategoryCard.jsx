import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const CategoryCard = ({ category, amount, total }) => {
  const { theme } = useTheme();
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-xl shadow-sm"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">{category}</span>
        <span className="text-gray-600">₹{amount.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${theme.primary} rounded-full h-2`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</p>
    </motion.div>
  );
};

export default CategoryCard;
