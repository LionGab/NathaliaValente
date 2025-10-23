import { useState, useCallback } from 'react';
import { Notification, NotificationType } from '../components/ErrorNotification';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      action?: {
        label: string;
        onClick: () => void;
      };
    }
  ) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options?.duration ?? (type === 'error' ? 0 : 5000), // Errors don't auto-dismiss
      action: options?.action,
    };

    setNotifications(prev => [...prev, notification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
    return addNotification('success', title, message, options);
  }, [addNotification]);

  const showError = useCallback((title: string, message: string, options?: { action?: { label: string; onClick: () => void } }) => {
    return addNotification('error', title, message, { ...options, duration: 0 });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
    return addNotification('warning', title, message, options);
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => {
    return addNotification('info', title, message, options);
  }, [addNotification]);

  // Error handling helpers
  const handleApiError = useCallback((error: any, context?: string) => {
    let title = 'Erro na operação';
    let message = 'Ocorreu um erro inesperado. Tente novamente.';

    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    if (context) {
      title = `Erro em ${context}`;
    }

    return showError(title, message, {
      action: {
        label: 'Tentar novamente',
        onClick: () => window.location.reload(),
      },
    });
  }, [showError]);

  const handleNetworkError = useCallback(() => {
    return showError(
      'Problema de conexão',
      'Verifique sua conexão com a internet e tente novamente.',
      {
        action: {
          label: 'Verificar conexão',
          onClick: () => {
            if (navigator.onLine) {
              showInfo('Conexão OK', 'Sua conexão está funcionando normalmente.');
            } else {
              showWarning('Sem conexão', 'Você está offline. Verifique sua internet.');
            }
          },
        },
      }
    );
  }, [showError, showInfo, showWarning]);

  const handleValidationError = useCallback((errors: string[]) => {
    return showError(
      'Dados inválidos',
      errors.length === 1 ? errors[0] : `Múltiplos erros encontrados: ${errors.join(', ')}`,
    );
  }, [showError]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleApiError,
    handleNetworkError,
    handleValidationError,
  };
};
