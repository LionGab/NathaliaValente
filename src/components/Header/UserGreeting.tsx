import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface UserGreetingProps {
  name: string;
  avatar?: string;
}

export const UserGreeting: React.FC<UserGreetingProps> = ({ name, avatar }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex items-center gap-2 sm:gap-3"
    >
      {/* Avatar - Mobile First */}
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-pink-200"
          />
        ) : (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        )}
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      {/* Greeting Text - Mobile First */}
      <div className="flex flex-col">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium"
        >
          {getGreeting()}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-base sm:text-lg font-bold text-gray-900 dark:text-white"
        >
          {name}
        </motion.h1>
      </div>
    </motion.div>
  );
};
