import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-pink-600 dark:text-pink-400" aria-hidden="true" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          className="shadow-lg hover:shadow-xl transition-shadow"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
