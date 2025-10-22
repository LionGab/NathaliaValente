// =====================================================
// CLUBNATH BADGE CARD
// Componente para Exibir Badges
// =====================================================

import React from 'react';
import { 
  Lock, 
  CheckCircle, 
  Clock, 
  Star,
  Trophy,
  Crown,
  Sparkles
} from 'lucide-react';
import { Badge, BadgeProgress } from '../../services/badges.service';

interface BadgeCardProps {
  badge: Badge;
  progress?: BadgeProgress;
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const rarityConfig = {
  common: {
    label: 'Comum',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-gray-700',
    borderColor: 'border-gray-300 dark:border-gray-600',
    glowColor: 'shadow-gray-200 dark:shadow-gray-800'
  },
  rare: {
    label: 'Rara',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-300 dark:border-blue-700',
    glowColor: 'shadow-blue-200 dark:shadow-blue-800'
  },
  epic: {
    label: 'Épica',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    borderColor: 'border-purple-300 dark:border-purple-700',
    glowColor: 'shadow-purple-200 dark:shadow-purple-800'
  },
  legendary: {
    label: 'Lendária',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-300 dark:border-yellow-700',
    glowColor: 'shadow-yellow-200 dark:shadow-yellow-800'
  }
};

const categoryConfig = {
  participation: {
    label: 'Participação',
    icon: '👥',
    color: 'text-green-600'
  },
  faith: {
    label: 'Fé',
    icon: '🙏',
    color: 'text-blue-600'
  },
  support: {
    label: 'Apoio',
    icon: '🤗',
    color: 'text-pink-600'
  },
  journey: {
    label: 'Jornada',
    icon: '🛤️',
    color: 'text-purple-600'
  },
  special: {
    label: 'Especial',
    icon: '⭐',
    color: 'text-yellow-600'
  }
};

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  progress,
  showProgress = true,
  size = 'md',
  onClick
}) => {
  const rarity = rarityConfig[badge.rarity];
  const category = categoryConfig[badge.category];
  const isEarned = progress?.is_earned || false;
  const progressValue = progress?.progress || 0;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  const getRarityIcon = () => {
    switch (badge.rarity) {
      case 'rare':
        return <Star className="w-3 h-3" />;
      case 'epic':
        return <Trophy className="w-3 h-3" />;
      case 'legendary':
        return <Crown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`
        relative bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300
        ${isEarned 
          ? `${rarity.borderColor} ${rarity.glowColor} shadow-lg hover:shadow-xl` 
          : 'border-gray-200 dark:border-gray-700 opacity-60'
        }
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
        ${size === 'lg' ? 'p-4' : 'p-3'}
      `}
      onClick={onClick}
    >
      {/* Badge Icon */}
      <div className={`
        ${sizeClasses[size]} mx-auto mb-3 rounded-full flex items-center justify-center
        ${isEarned ? rarity.bgColor : 'bg-gray-100 dark:bg-gray-700'}
        relative overflow-hidden
      `}>
        <span className={iconSizes[size]}>
          {badge.icon}
        </span>
        
        {/* Earned indicator */}
        {isEarned && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        )}
        
        {/* Rarity indicator */}
        {badge.rarity !== 'common' && (
          <div className={`
            absolute -bottom-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center
            ${rarity.bgColor} ${rarity.color}
          `}>
            {getRarityIcon()}
          </div>
        )}
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className={`
          font-semibold mb-1
          ${size === 'lg' ? 'text-sm' : 'text-xs'}
          ${isEarned ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
        `}>
          {badge.name}
        </h3>
        
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {category.icon}
          </span>
          <span className={`text-xs ${category.color}`}>
            {category.label}
          </span>
        </div>

        {/* Progress Bar */}
        {showProgress && !isEarned && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${rarity.bgColor}`}
              style={{ width: `${progressValue}%` }}
            />
          </div>
        )}

        {/* Progress Text */}
        {showProgress && (
          <div className="flex items-center justify-center gap-1">
            {isEarned ? (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Conquistada
                </span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {progressValue}%
                </span>
              </>
            )}
          </div>
        )}

        {/* Rarity Badge */}
        <div className={`
          mt-2 px-2 py-1 rounded-full text-xs font-medium
          ${rarity.bgColor} ${rarity.color}
        `}>
          {rarity.label}
        </div>
      </div>

      {/* Legendary Glow Effect */}
      {badge.rarity === 'legendary' && isEarned && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/20 via-yellow-500/20 to-yellow-400/20 animate-pulse pointer-events-none" />
      )}

      {/* Sparkle Effect for Epic+ */}
      {(badge.rarity === 'epic' || badge.rarity === 'legendary') && isEarned && (
        <div className="absolute top-2 right-2">
          <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
        </div>
      )}
    </div>
  );
};
