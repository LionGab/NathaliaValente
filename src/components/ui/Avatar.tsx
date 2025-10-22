// =====================================================
// CLUBNATH AVATAR - COMPONENTE REACT
// Sistema de Avatares Emoji Personalizáveis
// =====================================================

import React, { FC } from 'react';
import { cn } from '../../lib/utils';

export type AvatarType =
  | 'exausta'
  | 'oracao'
  | 'radiante'
  | 'vulneravel'
  | 'pensativa'
  | 'determinada'
  | 'gravida'
  | 'amamentando'
  | 'hijab'
  | 'blackpower'
  | 'asiatica'
  | 'cadeirante';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarBadge = 'premium' | 'verified' | 'nathy' | null;

interface AvatarProps {
  type: AvatarType;
  size?: AvatarSize;
  badge?: AvatarBadge;
  onClick?: () => void;
  className?: string;
  alt?: string;
  'aria-label'?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-12 h-12', // 48px
  md: 'w-20 h-20', // 80px
  lg: 'w-30 h-30', // 120px
  xl: 'w-40 h-40'  // 160px
};

const badgeConfig: Record<AvatarBadge, { icon: string; color: string; label: string }> = {
  premium: {
    icon: '👑',
    color: 'bg-yellow-500',
    label: 'Membro Premium'
  },
  verified: {
    icon: '✓',
    color: 'bg-blue-500',
    label: 'Verificado'
  },
  nathy: {
    icon: '💜',
    color: 'bg-pink-500',
    label: 'Nathy Aprovou'
  },
  null: {
    icon: '',
    color: '',
    label: ''
  }
};

const avatarLabels: Record<AvatarType, string> = {
  exausta: 'Mãe exausta',
  oracao: 'Mãe em oração',
  radiante: 'Mãe radiante',
  vulneravel: 'Mãe vulnerável',
  pensativa: 'Mãe pensativa',
  determinada: 'Mãe determinada',
  gravida: 'Mãe grávida',
  amamentando: 'Mãe amamentando',
  hijab: 'Mãe com hijab',
  blackpower: 'Mãe black power',
  asiatica: 'Mãe asiática',
  cadeirante: 'Mãe cadeirante'
};

export const Avatar: FC<AvatarProps> = ({
  type,
  size = 'md',
  badge = null,
  onClick,
  className,
  alt,
  'aria-label': ariaLabel
}) => {
  const badgeInfo = badgeConfig[badge];
  const avatarLabel = avatarLabels[type];
  const finalAriaLabel = ariaLabel || alt || avatarLabel;

  return (
    <div className="relative inline-block">
      <img
        src={`/avatars/avatar-${getAvatarNumber(type)}-${type}.svg`}
        alt={alt || avatarLabel}
        aria-label={finalAriaLabel}
        className={cn(
          sizeClasses[size],
          'rounded-full cursor-pointer hover:scale-105 transition-transform duration-200',
          'focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
          className
        )}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        tabIndex={onClick ? 0 : -1}
        role={onClick ? 'button' : 'img'}
      />
      
      {badge && (
        <div 
          className={cn(
            'absolute -bottom-1 -right-1 rounded-full p-1 text-white text-xs',
            'flex items-center justify-center min-w-[20px] min-h-[20px]',
            'shadow-lg border-2 border-white',
            badgeInfo.color
          )}
          aria-label={badgeInfo.label}
          title={badgeInfo.label}
        >
          <span className="text-xs font-bold">
            {badgeInfo.icon}
          </span>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para obter o número do avatar
const getAvatarNumber = (type: AvatarType): string => {
  const numbers: Record<AvatarType, string> = {
    exausta: '01',
    oracao: '02',
    radiante: '03',
    vulneravel: '04',
    pensativa: '05',
    determinada: '06',
    gravida: '07',
    amamentando: '08',
    hijab: '09',
    blackpower: '10',
    asiatica: '11',
    cadeirante: '12'
  };
  return numbers[type];
};

// =====================================================
// COMPONENTE AVATAR GRID (Para seleção)
// =====================================================

interface AvatarGridProps {
  selectedAvatar?: AvatarType;
  onSelect: (avatar: AvatarType) => void;
  size?: AvatarSize;
  showLabels?: boolean;
  className?: string;
}

export const AvatarGrid: FC<AvatarGridProps> = ({
  selectedAvatar,
  onSelect,
  size = 'md',
  showLabels = false,
  className
}) => {
  const allAvatars: AvatarType[] = [
    'exausta', 'oracao', 'radiante', 'vulneravel',
    'pensativa', 'determinada', 'gravida', 'amamentando',
    'hijab', 'blackpower', 'asiatica', 'cadeirante'
  ];

  return (
    <div className={cn('grid grid-cols-4 gap-4 p-4', className)}>
      {allAvatars.map((avatar) => (
        <div
          key={avatar}
          className={cn(
            'relative cursor-pointer transition-all duration-200',
            'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2',
            'rounded-2xl p-2',
            selectedAvatar === avatar 
              ? 'ring-4 ring-pink-500 bg-pink-50 dark:bg-pink-900/20' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          )}
          onClick={() => onSelect(avatar)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(avatar);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Selecionar avatar ${avatarLabels[avatar]}`}
        >
          <div className="flex flex-col items-center gap-2">
            <Avatar 
              type={avatar} 
              size={size}
              aria-label={avatarLabels[avatar]}
            />
            {showLabels && (
              <span className="text-xs text-center text-gray-600 dark:text-gray-400 font-medium">
                {avatarLabels[avatar]}
              </span>
            )}
          </div>
          
          {selectedAvatar === avatar && (
            <div className="absolute top-1 right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// =====================================================
// COMPONENTE AVATAR PREVIEW
// =====================================================

interface AvatarPreviewProps {
  type: AvatarType;
  name?: string;
  badge?: AvatarBadge;
  size?: AvatarSize;
  className?: string;
}

export const AvatarPreview: FC<AvatarPreviewProps> = ({
  type,
  name,
  badge,
  size = 'lg',
  className
}) => {
  return (
    <div className={cn('flex flex-col items-center gap-3 p-4', className)}>
      <Avatar 
        type={type} 
        size={size}
        badge={badge}
        aria-label={name || avatarLabels[type]}
      />
      {name && (
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {avatarLabels[type]}
          </p>
        </div>
      )}
    </div>
  );
};

// =====================================================
// HOOK PARA AVATARES
// =====================================================

export const useAvatar = () => {
  const getRandomAvatar = (): AvatarType => {
    const avatars: AvatarType[] = [
      'exausta', 'oracao', 'radiante', 'vulneravel',
      'pensativa', 'determinada', 'gravida', 'amamentando',
      'hijab', 'blackpower', 'asiatica', 'cadeirante'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const getAvatarByMood = (mood: string): AvatarType => {
    const moodMap: Record<string, AvatarType> = {
      'tired': 'exausta',
      'exhausted': 'exausta',
      'prayer': 'oracao',
      'spiritual': 'oracao',
      'happy': 'radiante',
      'joyful': 'radiante',
      'sad': 'vulneravel',
      'vulnerable': 'vulneravel',
      'thoughtful': 'pensativa',
      'thinking': 'pensativa',
      'determined': 'determinada',
      'strong': 'determinada',
      'pregnant': 'gravida',
      'breastfeeding': 'amamentando',
      'nursing': 'amamentando'
    };
    
    return moodMap[mood.toLowerCase()] || getRandomAvatar();
  };

  const getAvatarByContext = (context: string): AvatarType => {
    const contextMap: Record<string, AvatarType> = {
      'postpartum': 'exausta',
      'new-mom': 'vulneravel',
      'experienced': 'determinada',
      'spiritual': 'oracao',
      'celebration': 'radiante',
      'reflection': 'pensativa'
    };
    
    return contextMap[context.toLowerCase()] || getRandomAvatar();
  };

  return {
    getRandomAvatar,
    getAvatarByMood,
    getAvatarByContext,
    allAvatars: [
      'exausta', 'oracao', 'radiante', 'vulneravel',
      'pensativa', 'determinada', 'gravida', 'amamentando',
      'hijab', 'blackpower', 'asiatica', 'cadeirante'
    ] as AvatarType[]
  };
};

export default Avatar;
