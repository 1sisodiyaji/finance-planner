import React from 'react';
import { motion } from 'framer-motion';

const SummaryCard = ({ title, value, icon: Icon, color = 'blue' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm p-4 sm:p-6"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </motion.div>
);

export default SummaryCard;
