import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Crown, Star } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak, size = 'md' }) => {
  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return Crown;
    if (streak >= 14) return Trophy;
    if (streak >= 7) return Star;
    return Flame;
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 14) return 'from-yellow-500 to-orange-500';
    if (streak >= 7) return 'from-blue-500 to-purple-500';
    return 'from-orange-500 to-red-500';
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-xs';
      case 'lg':
        return 'w-12 h-12 text-lg';
      default:
        return 'w-10 h-10 text-sm';
    }
  };

  const Icon = getStreakIcon(streak);

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15,
        delay: 0.2 
      }}
      className={`relative ${getSizeClasses(size)}`}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getStreakColor(streak)} opacity-20 blur-sm`} />
      
      {/* Main badge */}
      <div className={`relative ${getSizeClasses(size)} rounded-full bg-gradient-to-r ${getStreakColor(streak)} flex items-center justify-center text-white font-bold shadow-lg`}>
        <Icon className="w-4 h-4" aria-hidden="true" />
        
        {/* Streak number */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-white text-gray-900 text-xs font-bold rounded-full flex items-center justify-center border-2 border-white"
        >
          {streak}
        </motion.div>
      </div>
    </motion.div>
  );
};
