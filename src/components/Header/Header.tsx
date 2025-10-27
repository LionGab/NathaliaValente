import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { UserGreeting } from './UserGreeting';

export const Header: React.FC = () => {
  const { profile } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-full mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          {/* User Greeting - Centralizado */}
          <UserGreeting
            name={profile?.full_name?.split(' ')[0] || 'Mamãe'}
            avatar={profile?.avatar_url}
          />
        </div>
      </div>
    </motion.header>
  );
};
