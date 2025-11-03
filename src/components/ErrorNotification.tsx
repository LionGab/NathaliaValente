import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ErrorNotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

const notificationConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-success-50 dark:bg-success-950/50',
    borderColor: 'border-success-200 dark:border-success-800',
    iconColor: 'text-success-600 dark:text-success-400',
    titleColor: 'text-success-800 dark:text-success-200',
    textColor: 'text-success-700 dark:text-success-300',
  },
  error: {
    icon: AlertTriangle,
    bgColor: 'bg-error-50 dark:bg-error-950/50',
    borderColor: 'border-error-200 dark:border-error-800',
    iconColor: 'text-error-600 dark:text-error-400',
    titleColor: 'text-error-800 dark:text-error-200',
    textColor: 'text-error-700 dark:text-error-300',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-warning-50 dark:bg-warning-950/50',
    borderColor: 'border-warning-200 dark:border-warning-800',
    iconColor: 'text-warning-600 dark:text-warning-400',
    titleColor: 'text-warning-800 dark:text-warning-200',
    textColor: 'text-warning-700 dark:text-warning-300',
  },
  info: {
    icon: Info,
    bgColor: 'bg-info-50 dark:bg-info-950/50',
    borderColor: 'border-info-200 dark:border-info-800',
    iconColor: 'text-info-600 dark:text-info-400',
    titleColor: 'text-info-800 dark:text-info-200',
    textColor: 'text-info-700 dark:text-info-300',
  },
};

export const ErrorNotification: React.FC<ErrorNotificationProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isLeaving ? 'translate-x-full opacity-0' : ''}
      `}
    >
      <div
        className={`
          ${config.bgColor} ${config.borderColor}
          border-2 rounded-2xl p-4 shadow-large backdrop-blur-sm
          max-w-sm w-full mx-auto mb-3
        `}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm ${config.titleColor} mb-1`}>
              {notification.title}
            </h4>
            <p className={`text-sm ${config.textColor} leading-relaxed`}>{notification.message}</p>

            {/* Action Button */}
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className={`
                  mt-3 px-3 py-1.5 rounded-lg text-xs font-medium
                  ${config.iconColor} hover:bg-opacity-10
                  transition-all duration-200 hover:scale-105
                `}
              >
                {notification.action.label}
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              flex-shrink-0 p-1 rounded-lg
              ${config.iconColor} hover:bg-opacity-10
              transition-all duration-200 hover:scale-110
            `}
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Container
interface NotificationContainerProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  onClose,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <ErrorNotification key={notification.id} notification={notification} onClose={onClose} />
      ))}
    </div>
  );
};
