import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, amount, icon: Icon, color }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-2xl shadow-md border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">₹{amount.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-full ${theme.primary} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${theme.highlight}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
