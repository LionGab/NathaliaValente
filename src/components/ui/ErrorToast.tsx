/**
 * Nossa Maternidade - Componente de Notificação de Erro
 * Toast elegante para exibir erros ao usuário
 */

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, RefreshCw, Wifi, Shield, AlertTriangle } from 'lucide-react';
import { AppError } from '../../lib/error-handler';

interface ErrorToastProps {
  error: AppError | null;
  onClose: () => void;
  onRetry?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  error,
  onClose,
  onRetry,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setIsAnimating(true);

      if (autoClose) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [error, autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  const getErrorIcon = (code: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
      case 'FETCH_ERROR':
      case 'NETWORK_UNAVAILABLE':
        return <Wifi className="w-5 h-5 text-orange-500" />;
      case 'AUTH_ERROR':
      case 'INVALID_CREDENTIALS':
      case 'EMAIL_NOT_CONFIRMED':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'PERMISSION_ERROR':
      case 'FORBIDDEN':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getErrorColor = (code: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
      case 'FETCH_ERROR':
      case 'NETWORK_UNAVAILABLE':
        return 'border-orange-200 bg-orange-50';
      case 'AUTH_ERROR':
      case 'INVALID_CREDENTIALS':
      case 'EMAIL_NOT_CONFIRMED':
        return 'border-red-200 bg-red-50';
      case 'PERMISSION_ERROR':
      case 'FORBIDDEN':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  const getRetryText = (code: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
      case 'TIMEOUT':
      case 'FETCH_ERROR':
        return 'Tentar novamente';
      case 'AUTH_ERROR':
      case 'INVALID_CREDENTIALS':
        return 'Tentar login novamente';
      default:
        return 'Tentar novamente';
    }
  };

  if (!isVisible || !error) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div
        className={`
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
          border rounded-lg shadow-lg p-4
          ${getErrorColor(error.code)}
        `}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getErrorIcon(error.code)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                {error.code === 'NETWORK_ERROR' && 'Problema de Conexão'}
                {error.code === 'AUTH_ERROR' && 'Erro de Login'}
                {error.code === 'PERMISSION_ERROR' && 'Acesso Negado'}
                {error.code === 'VALIDATION_ERROR' && 'Erro de Validação'}
                {error.code === 'API_ERROR' && 'Erro na API'}
                {!['NETWORK_ERROR', 'AUTH_ERROR', 'PERMISSION_ERROR', 'VALIDATION_ERROR', 'API_ERROR'].includes(error.code) && 'Erro'}
              </h4>
              
              <button
                onClick={handleClose}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="mt-1 text-sm text-gray-600">
              {error.message}
            </p>
            
            {error.details && import.meta.env.DEV && (
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer">
                  Detalhes técnicos
                </summary>
                <pre className="mt-1 text-xs text-gray-500 bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </details>
            )}
            
            {onRetry && (
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  {getRetryText(error.code)}
                </button>
                
                <button
                  onClick={handleClose}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook para usar ErrorToast facilmente
 */
export const useErrorToast = () => {
  const [error, setError] = useState<AppError | null>(null);
  const [retryFunction, setRetryFunction] = useState<(() => void) | null>(null);

  const showError = (appError: AppError, retry?: () => void) => {
    setError(appError);
    setRetryFunction(() => retry || null);
  };

  const hideError = () => {
    setError(null);
    setRetryFunction(null);
  };

  const ErrorToastComponent = () => (
    <ErrorToast
      error={error}
      onClose={hideError}
      onRetry={retryFunction || undefined}
    />
  );

  return {
    showError,
    hideError,
    ErrorToastComponent
  };
};
