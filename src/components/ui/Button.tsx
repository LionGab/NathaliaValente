import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  // Base styles - Modern Design
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-semibold text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50 touch-target relative overflow-hidden',
  {
    variants: {
      variant: {
        // Primary gradient button - Modern
        primary:
          'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-large hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]',

        // Secondary button - Clean
        secondary:
          'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-2 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 shadow-soft hover:shadow-medium hover:scale-[1.01] active:scale-[0.99]',

        // Ghost button - Subtle
        ghost:
          'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 hover:shadow-soft hover:scale-105',

        // Destructive button - Attention
        destructive:
          'bg-gradient-to-r from-error-500 to-error-600 text-white shadow-large hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',

        // Outline button - Clean
        outline:
          'border-2 border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white hover:shadow-medium hover:scale-[1.01] dark:hover:bg-primary-600 active:scale-[0.99]',

        // Link button - Minimal
        link: 'text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline hover:text-primary-700 dark:hover:text-primary-300',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children && <span className="truncate">{children}</span>}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
