import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const StatCard = ({ title, value, icon: Icon, color, children }) => {
  const { theme } = useTheme();

  const formatValue = (val) => {
    if (typeof val !== 'string') {
      return val.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
      });
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm p-6 border-l-4 border-${color}-200`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{formatValue(value)}</p>
          {children}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
