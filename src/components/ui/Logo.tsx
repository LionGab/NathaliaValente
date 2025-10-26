import React from 'react';
import { cn } from '../../lib/utils';

export type LogoType = 'community' | 'nath' | 'clubnath' | 'mother-baby';

interface LogoProps {
  type: LogoType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const logoConfig = {
  community: {
    src: '/logos/clubnath-logo.png',
    alt: 'ClubNath - Comunidade de Mães',
    title: 'ClubNath - Comunidade de Mães'
  },
  nath: {
    src: '/logos/nath-avatar.svg',
    alt: 'Nath - Assistente IA',
    title: 'Nath - Assistente IA'
  },
  clubnath: {
    src: '/logos/clubnath-logo.png',
    alt: 'ClubNath',
    title: 'ClubNath'
  },
  'mother-baby': {
    src: '/logos/clubnath-mother-baby.svg',
    alt: 'ClubNath - Mãe e Bebê',
    title: 'ClubNath - Mãe e Bebê'
  }
};

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export const Logo: React.FC<LogoProps> = ({
  type,
  size = 'md',
  className,
  onClick
}) => {
  const config = logoConfig[type];

  return (
    <img
      src={config.src}
      alt={config.alt}
      title={config.title}
      className={cn(
        'transition-transform duration-200 hover:scale-105',
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

// Componente específico para o header
export const HeaderLogo: React.FC<{ className?: string }> = ({ className }) => (
  <Logo
    type="clubnath"
    size="md"
    className={cn('hover:scale-110 transition-transform duration-300', className)}
  />
);

// Componente específico para a Nath
export const NathLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ className, size = 'lg' }) => (
  <Logo
    type="nath"
    size={size}
    className={cn('hover:scale-110 transition-transform duration-300', className)}
  />
);

// Componente específico para a comunidade
export const CommunityLogo: React.FC<{ className?: string }> = ({ className }) => (
  <Logo
    type="community"
    size="xl"
    className={cn('hover:scale-110 transition-transform duration-300', className)}
  />
);
