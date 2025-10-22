import React from 'react';
import { cn } from '../../lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  tiltIntensity?: number;
  glowEffect?: boolean;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hoverScale = 1.02,
  tiltIntensity = 15,
  glowEffect = true,
  onClick
}) => {
  return (
    <div
      className={cn(
        "relative cursor-pointer transition-transform duration-200 ease-out hover:scale-105 active:scale-95",
        className
      )}
      onClick={onClick}
      style={{
        transform: `scale(${hoverScale})`,
        transition: 'transform 0.2s ease-out'
      }}
    >
      {/* Glow effect */}
      {glowEffect && (
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
