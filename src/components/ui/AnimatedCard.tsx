import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
    <motion.div
      className={cn(
        "relative cursor-pointer",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glow effect */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 blur-xl"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
