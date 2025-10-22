import { AlertTriangle, Info, X } from 'lucide-react';
import { Button } from './Button';
import { useEffect } from 'react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'info',
  loading = false,
}: ConfirmDialogProps) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const variantConfig = {
    destructive: {
      icon: AlertTriangle,
      iconColor: 'text-error-600',
      bgColor: 'bg-error-50 dark:bg-error-500/10',
      borderColor: 'border-error-200 dark:border-error-500/20',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-warning-600',
      bgColor: 'bg-warning-50 dark:bg-warning-500/10',
      borderColor: 'border-warning-200 dark:border-warning-500/20',
    },
    info: {
      icon: Info,
      iconColor: 'text-info-600',
      bgColor: 'bg-info-50 dark:bg-info-500/10',
      borderColor: 'border-info-200 dark:border-info-500/20',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Fechar"
          disabled={loading}
        >
          <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Icon */}
          <div className={`mb-4 inline-flex p-3 rounded-xl ${config.bgColor} ${config.borderColor} border-2`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h2
            id="dialog-title"
            className="text-2xl font-bold text-neutral-900 dark:text-white mb-2"
          >
            {title}
          </h2>

          {/* Message */}
          <p
            id="dialog-description"
            className="text-base text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed"
          >
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'primary'}
              onClick={handleConfirm}
              className="flex-1"
              loading={loading}
              disabled={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
