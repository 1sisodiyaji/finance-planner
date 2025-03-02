import React from 'react';
import { motion } from 'framer-motion';

const SuccessMessage = ({ message, initial, animate, exit }) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      {message}
    </motion.div>
  );
};

export default SuccessMessage;
