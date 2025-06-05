import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', delay = 0, hoverEffect = true }) => {
  const hoverClass = hoverEffect ? 'hover:shadow-lg transition-all duration-300' : '';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-xl p-4 lg:p-6 shadow-card ${hoverClass} ${className}`}
    >
      {children}
    </motion.div>
  );
};