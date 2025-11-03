import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  (
    {
      label,
      error,
      success = false,
      helperText,
      leftIcon,
      rightIcon,
      variant = 'default',
      size = 'md',
      fullWidth = false,
      className = '',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const baseClasses = `
      w-full rounded-lg border-2 transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantClasses = {
      default: `
        bg-white/10 backdrop-blur-sm border-white/20
        text-white placeholder-white/60
        focus:border-pink-500 focus:ring-pink-500
        hover:border-white/30
      `,
      filled: `
        bg-white/20 border-white/30
        text-white placeholder-white/60
        focus:border-pink-500 focus:ring-pink-500
        hover:bg-white/25
      `,
      outlined: `
        bg-transparent border-2 border-pink-500
        text-white placeholder-pink-300
        focus:ring-pink-500
        hover:border-pink-400
      `,
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-sm min-h-[44px]',
      lg: 'px-5 py-4 text-base min-h-[52px]',
    };

    const stateClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : success
        ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
        : '';

    const inputClasses = `
      ${baseClasses}
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${stateClasses}
      ${className}
    `.trim();

    return (
      <div className={`space-y-2 ${fullWidth ? 'w-full' : ''}`}>
        {/* Label */}
        <label htmlFor={inputId} className="block text-sm font-semibold text-white">
          {label}
          {required && (
            <span className="text-red-400 ml-1" aria-label="obrigatório">
              *
            </span>
          )}
        </label>

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={`
              ${inputClasses}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || error || success ? 'pr-10' : ''}
            `}
            aria-describedby={`
              ${helperText ? helperId : ''}
              ${error ? errorId : ''}
            `.trim()}
            aria-invalid={!!error}
            aria-required={required}
            {...props}
          />

          {/* Right Icon / Status */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {error && <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />}
            {success && !error && (
              <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
            )}
            {!error && !success && rightIcon && (
              <span className="text-white/60" aria-hidden="true">
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <p id={helperId} className="text-xs text-white/70">
            {helperText}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p
            id={errorId}
            className="text-xs text-red-400 font-medium"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';
