import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl mx-4',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in',
          sizeStyles[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Modal Header Component
export const ModalHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('mb-4', className)}>
    {children}
  </div>
);

// Modal Footer Component
export const ModalFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6', className)}>
    {children}
  </div>
);
