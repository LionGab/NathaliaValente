import { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  style,
  ...props 
}: SkeletonProps) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variantStyles[variant],
        className
      )}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style,
      }}
      {...props}
    />
  );
};

// Pre-made skeleton components for common use cases

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/3" />
        <Skeleton variant="text" className="w-1/4" />
      </div>
    </div>
    
    <Skeleton variant="rectangular" height={192} className="mb-4" />
    
    <div className="space-y-2 mb-4">
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-4/5" />
      <Skeleton variant="text" className="w-3/5" />
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex gap-4">
        <Skeleton variant="rectangular" width={64} height={32} />
        <Skeleton variant="rectangular" width={64} height={32} />
      </div>
      <Skeleton variant="rectangular" width={32} height={32} />
    </div>
  </div>
);

export const SkeletonPost = () => (
  <div className="space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-1/4" />
        <Skeleton variant="text" className="w-1/6" />
      </div>
    </div>
    <Skeleton variant="rectangular" height={300} />
    <div className="space-y-2">
      <Skeleton variant="text" />
      <Skeleton variant="text" className="w-5/6" />
    </div>
  </div>
);

export const SkeletonProfile = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center">
      <Skeleton variant="circular" width={96} height={96} className="mb-4" />
      <Skeleton variant="text" className="w-32 mb-2" />
      <Skeleton variant="text" className="w-48" />
    </div>
    
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center space-y-2">
          <Skeleton variant="text" className="w-12 mx-auto" />
          <Skeleton variant="text" className="w-16 mx-auto" />
        </div>
      ))}
    </div>
    
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="rectangular" height={80} />
      ))}
    </div>
  </div>
);
