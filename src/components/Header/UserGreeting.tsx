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
      className="flex items-center gap-3"
    >
      {/* Avatar */}
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border-2 border-pink-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </div>

      {/* Greeting Text */}
      <div className="flex flex-col">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xs text-gray-500 dark:text-gray-400 font-medium"
        >
          {getGreeting()}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-lg font-bold text-gray-900 dark:text-white"
        >
          {name}
        </motion.h1>
      </div>
    </motion.div>
  );
};
