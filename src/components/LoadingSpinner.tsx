interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Carregando...', 
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-4 border-claude-orange-500 border-t-transparent ${sizeClasses[size]}`}
        role="status"
        aria-hidden="true"
        aria-label="Loading spinner"
      />
      {text && (
        <p className="text-sm text-claude-gray-500 dark:text-claude-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};
