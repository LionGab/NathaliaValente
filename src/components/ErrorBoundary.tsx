/**
 * ClubNath VIP - Error Boundary Component
 * Error boundary para capturar erros de React e exibir fallback UI
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { handleError } from '../lib/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  feature?: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error using our error handler
    handleError(error, {
      feature: this.props.feature || 'unknown',
      action: 'react_error_boundary',
      timestamp: Date.now()
    }, this.props.feature);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ops! Algo deu errado
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.props.feature
                ? `Houve um problema no ${this.props.feature}. Nossa equipe foi notificada.`
                : 'Houve um problema inesperado. Nossa equipe foi notificada.'
              }
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo && (
                    <div className="mt-2">
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors active:scale-95 shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors active:scale-95"
              >
                <Home className="w-4 h-4" />
                Ir para Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Feature-specific error boundaries
export const FeedErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary feature="Feed" fallback={
    <div className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Erro no Feed
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Não foi possível carregar o feed. Tente recarregar a página.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        Recarregar
      </button>
    </div>
  }>
    {children}
  </ErrorBoundary>
);

export const ChatErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary feature="Chat" fallback={
    <div className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Erro no Chat
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Não foi possível carregar o chat. Tente novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        Recarregar
      </button>
    </div>
  }>
    {children}
  </ErrorBoundary>
);

export const GroupsErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary feature="Groups" fallback={
    <div className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Erro nos Grupos
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Não foi possível carregar os grupos. Tente novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        Recarregar
      </button>
    </div>
  }>
    {children}
  </ErrorBoundary>
);

export const ProfileErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary feature="Profile" fallback={
    <div className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Erro no Perfil
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Não foi possível carregar o perfil. Tente novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        Recarregar
      </button>
    </div>
  }>
    {children}
  </ErrorBoundary>
);

export const StoreErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary feature="Store" fallback={
    <div className="p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Erro na Loja
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Não foi possível carregar a loja. Tente novamente.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        Recarregar
      </button>
    </div>
  }>
    {children}
  </ErrorBoundary>
);

// Hook para usar error boundary
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};