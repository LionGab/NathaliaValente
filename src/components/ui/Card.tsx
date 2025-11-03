import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const baseClasses = 'rounded-lg border bg-card text-card-foreground shadow-sm';

  const variantClasses = {
    default:
      'bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-soft hover:shadow-medium transition-all duration-300',
    elevated:
      'bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-glow hover:shadow-lg transition-all duration-300',
    outlined:
      'bg-transparent border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300',
    gradient:
      'bg-gradient-to-br shadow-large hover:shadow-glow transition-all duration-300 border border-white/10',
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
};
