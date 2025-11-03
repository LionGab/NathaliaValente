import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  motionProps?: MotionProps;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  motionProps,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-pink-500 to-purple-600
      text-white shadow-lg hover:shadow-xl
      focus:ring-pink-500
      active:scale-95
    `,
    secondary: `
      bg-white/10 backdrop-blur-sm
      text-white border border-white/20
      hover:bg-white/20 focus:ring-white/50
      active:scale-95
    `,
    outline: `
      bg-transparent border-2 border-pink-500
      text-pink-500 hover:bg-pink-500 hover:text-white
      focus:ring-pink-500
      active:scale-95
    `,
    ghost: `
      bg-transparent text-pink-500
      hover:bg-pink-500/10 focus:ring-pink-500
      active:scale-95
    `,
    danger: `
      bg-red-500 text-white
      hover:bg-red-600 focus:ring-red-500
      active:scale-95
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-4 py-2 text-sm min-h-[44px]',
    lg: 'px-6 py-3 text-base min-h-[52px]',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  const ButtonComponent = motion.button;

  return (
    <ButtonComponent
      type="button"
      className={buttonClasses}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...(motionProps || {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
      })}
      {...props}
    >
      {loading && (
        <div
          className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      {!loading && leftIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}

      <span className={loading ? 'opacity-0' : ''}>{children}</span>

      {!loading && rightIcon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </ButtonComponent>
  );
};
