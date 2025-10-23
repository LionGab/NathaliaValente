import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    icon: Icon,
    dot,
    children, 
    ...props 
  }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm',
      success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    };
    
    const sizeStyles = {
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1',
      lg: 'text-base px-4 py-1.5',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 font-semibold rounded-full transition-all duration-200',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        )}
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
