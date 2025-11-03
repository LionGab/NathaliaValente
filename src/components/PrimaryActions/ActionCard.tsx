import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  onClick: () => void;
  isLarge?: boolean;
  isPrimary?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  color,
  bgColor,
  onClick,
  isLarge = false,
  isPrimary = false,
}) => {
  const cardVariants = {
    hover: {
      scale: 1.02,
      y: -2,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: { duration: 0.1 },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: isPrimary ? 5 : 0,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.button
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-4 transition-all duration-300
        ${isLarge ? 'col-span-2' : ''}
        ${isPrimary ? 'shadow-lg' : 'shadow-md'}
        hover:shadow-xl
        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
      `}
      style={{ backgroundColor: bgColor }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-white/20 transform translate-x-8 -translate-y-8" />
        <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white/10 transform -translate-x-4 translate-y-4" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <motion.div
          variants={iconVariants}
          className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
            isPrimary ? 'shadow-lg' : 'shadow-md'
          }`}
          style={{ backgroundColor: color }}
        >
          <Icon className={`text-white ${isPrimary ? 'w-6 h-6' : 'w-5 h-5'}`} />
        </motion.div>

        {/* Text */}
        <div className="text-left">
          <h3
            className={`font-bold text-gray-900 dark:text-white mb-1 ${
              isPrimary ? 'text-lg' : 'text-base'
            }`}
          >
            {title}
          </h3>
          <p className={`text-gray-600 dark:text-gray-300 ${isPrimary ? 'text-sm' : 'text-xs'}`}>
            {subtitle}
          </p>
        </div>

        {/* Arrow indicator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 right-4"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Hover effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
      />
    </motion.button>
  );
};
