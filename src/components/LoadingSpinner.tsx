import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  variant?: 'default' | 'modern' | 'minimal';
  showIcon?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  message = 'Carregando...', 
  className = '',
  variant = 'modern',
  showIcon = true
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600 dark:text-primary-400`} />
      </div>
    );
  }

  if (variant === 'default') {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
        <div
          className={`
            animate-spin rounded-full border-primary-500 border-t-transparent
            ${sizeClasses[size]} border-4
          `}
          aria-label="Loading"
          role="status"
        />
        {message && (
          <p className={`${textSizeClasses[size]} text-neutral-500 dark:text-neutral-400 animate-pulse`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Modern variant (default)
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      {/* Modern Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin border-t-transparent`}></div>
        
        {/* Middle ring */}
        <div className={`absolute inset-2 border-4 border-secondary-200 dark:border-secondary-800 rounded-full animate-spin border-t-transparent`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        
        {/* Inner ring */}
        <div className={`absolute inset-4 border-4 border-accent-200 dark:border-accent-800 rounded-full animate-spin border-b-transparent`} style={{ animationDuration: '2s' }}></div>
        
        {/* Center icon */}
        {showIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Loading text */}
      {message && (
        <div className="text-center">
          <p className={`${textSizeClasses[size]} font-medium text-neutral-700 dark:text-neutral-300 animate-pulse`}>
            {message}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className="w-1 h-1 bg-primary-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-secondary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}