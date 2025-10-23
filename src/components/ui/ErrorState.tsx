import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = 'Algo deu errado',
  message = 'Não foi possível carregar os dados. Por favor, tente novamente.',
  onRetry,
  className = '',
}: ErrorStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
        {message}
      </p>
      
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          className="shadow-lg hover:shadow-xl transition-shadow"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      )}
    </div>
  );
};
