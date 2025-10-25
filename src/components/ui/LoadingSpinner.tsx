import React from 'react';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-primary-500',
  secondary: 'text-secondary-500',
  white: 'text-white',
  gray: 'text-neutral-500'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text
}) => {
  const loadingText = text || 'Carregando...';

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
      aria-label={loadingText}
    >
      <div
        className={cn(
          'border-2 border-current border-t-transparent rounded-full animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{loadingText}</span>
      {text && (
        <p className={cn('text-sm font-medium animate-fade-in', colorClasses[color])}>
          {text}
        </p>
      )}
    </div>
  );
};

// Pulse loading for cards
export const PulseLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn('animate-pulse', className)}
      role="status"
      aria-live="polite"
      aria-label="Carregando conteúdo..."
    >
      <span className="sr-only">Carregando conteúdo...</span>
      <div className="space-y-4">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
      </div>
    </div>
  );
};

// Skeleton for posts
export const PostSkeleton: React.FC = () => {
  return (
    <div
      className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md"
      role="status"
      aria-live="polite"
      aria-label="Carregando post..."
    >
      <span className="sr-only">Carregando post...</span>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 animate-pulse"></div>
        </div>
      </div>

      <div className="h-48 bg-neutral-200 dark:bg-neutral-700 rounded-xl mb-4 animate-pulse"></div>

      <div className="space-y-2 mb-4">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full animate-pulse"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-4/5 animate-pulse"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/5 animate-pulse"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
};
