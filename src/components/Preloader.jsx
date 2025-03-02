import React from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';

const Preloader = ({ onLoadingComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const letterVariants = {
    initial: { y: 100, opacity: 0 },
    animate: i => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    })
  };

  const codeIconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        delay: 1.3,
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const text = "CraftFossLabs";

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#1e1e1e] z-50">
      <div className="flex items-center mb-4">
        {text.split('').map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="initial"
            animate="animate"
            className="text-4xl font-bold"
            style={{
              color: i < 5 ? '#519aba' : i < 8 ? '#e7c17a' : '#bd93f9',
              textShadow: '0 0 10px rgba(255,255,255,0.3)'
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <motion.div
        variants={codeIconVariants}
        initial="initial"
        animate="animate"
        className="mt-4"
      >
        <Code2 size={40} className="text-[#519aba]" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="mt-8 text-[#cccccc] text-sm"
      >
        Loading your workspace...
      </motion.div>
    </div>
  );
};

export default Preloader;
