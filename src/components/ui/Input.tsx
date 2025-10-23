import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth,
    success,
    type = 'text',
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label className="block text-sm font-semibold text-gray-900 dark:text-white">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200',
              'text-gray-900 dark:text-white placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              leftIcon && 'pl-10',
              (rightIcon || isPassword) && 'pr-10',
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10' 
                : success
                ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50 dark:bg-green-900/10'
                : 'border-gray-200 dark:border-gray-700 focus:border-pink-500 focus:ring-pink-500/20 bg-white dark:bg-gray-800',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {!isPassword && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
          
          {!isPassword && !rightIcon && error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
          
          {!isPassword && !rightIcon && success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
        
        {!error && helperText && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
