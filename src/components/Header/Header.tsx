import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Settings, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserGreeting } from './UserGreeting';
import { NotificationBadge } from './NotificationBadge';

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
        <div className="flex items-center justify-between">
          {/* User Greeting */}
          <UserGreeting 
            name={profile?.full_name?.split(' ')[0] || 'Mamãe'}
            avatar={profile?.avatar_url}
          />

          {/* Center - Search */}
          <div className="flex-1 max-w-xs mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
              />
            </div>
          </div>

          {/* Right - Notifications & Settings */}
          <div className="flex items-center gap-3">
            <NotificationBadge count={3} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Configurações"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
