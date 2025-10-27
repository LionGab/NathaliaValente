/**
 * Nossa Maternidade - Hook para Tratamento de Erros
 * Hook personalizado para gerenciar erros de forma reativa
 */

import { useState, useCallback, useEffect } from 'react';
import { errorHandler, AppError, handleError } from '../lib/error-handler';

interface UseErrorHandlerReturn {
  error: AppError | null;
  isLoading: boolean;
  handleError: (error: any, context?: string) => void;
  clearError: () => void;
  retry: () => void;
  errorStats: {
    total: number;
    byCode: Record<string, number>;
    byContext: Record<string, number>;
  };
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryFunction, setRetryFunction] = useState<(() => void) | null>(null);

  const handleErrorCallback = useCallback((error: any, context?: string) => {
    setIsLoading(false);
    const appError = handleError(error, context);
    setError(appError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(() => {
    if (retryFunction) {
      setIsLoading(true);
      setError(null);
      retryFunction();
    }
  }, [retryFunction]);

  const errorStats = errorHandler.getErrorStats();

  return {
    error,
    isLoading,
    handleError: handleErrorCallback,
    clearError,
    retry,
    errorStats
  };
};

/**
 * Hook para tratamento de erros com retry automático
 */
export const useErrorHandlerWithRetry = (
  maxRetries: number = 3,
  retryDelay: number = 1000
): UseErrorHandlerReturn & { retryCount: number; canRetry: boolean } => {
  const [retryCount, setRetryCount] = useState(0);
  const [retryTimeout, setRetryTimeout] = useState<NodeJS.Timeout | null>(null);

  const baseHandler = useErrorHandler();

  const retryWithBackoff = useCallback(() => {
    if (retryCount < maxRetries) {
      const delay = retryDelay * Math.pow(2, retryCount); // Exponential backoff
      
      const timeout = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        baseHandler.retry();
      }, delay);

      setRetryTimeout(timeout);
    }
  }, [retryCount, maxRetries, retryDelay, baseHandler]);

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeout) {
      clearTimeout(retryTimeout);
      setRetryTimeout(null);
    }
  }, [retryTimeout]);

  useEffect(() => {
    return () => {
      clearRetryTimeout();
    };
  }, [clearRetryTimeout]);

  const canRetry = retryCount < maxRetries;

  return {
    ...baseHandler,
    retry: retryWithBackoff,
    retryCount,
    canRetry
  };
};

/**
 * Hook para tratamento de erros específicos de API
 */
export const useAPIErrorHandler = () => {
  const baseHandler = useErrorHandler();

  const handleAPIError = useCallback((error: any, endpoint: string) => {
    const appError = errorHandler.handleAPIError(error, endpoint);
    baseHandler.handleError(appError);
  }, [baseHandler]);

  const handleAuthError = useCallback((error: any) => {
    const appError = errorHandler.handleAuthError(error);
    baseHandler.handleError(appError);
  }, [baseHandler]);

  const handleNetworkError = useCallback((error: any) => {
    const appError = errorHandler.handleNetworkError(error);
    baseHandler.handleError(appError);
  }, [baseHandler]);

  return {
    ...baseHandler,
    handleAPIError,
    handleAuthError,
    handleNetworkError
  };
};

/**
 * Hook para tratamento de erros de validação de formulário
 */
export const useFormErrorHandler = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const baseHandler = useErrorHandler();

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({
      ...prev,
      [field]: message
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return {
    ...baseHandler,
    fieldErrors,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    hasFieldErrors
  };
};
