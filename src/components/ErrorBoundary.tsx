import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Log error to external service in production
    if (import.meta.env.PROD) {
      // You can integrate with services like Sentry, LogRocket, etc.
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-error-50 via-warning-50 to-info-50 dark:from-neutral-900 dark:via-error-950 dark:to-warning-950 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Background Elements */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-error-200/20 dark:bg-error-800/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-warning-200/20 dark:bg-warning-800/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-info-200/10 dark:bg-info-800/5 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="card-modern dark:card-dark-modern rounded-3xl p-8 sm:p-10 max-w-lg w-full shadow-large relative z-10 animate-fade-in">
            {/* Error Icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-error-500 to-warning-500 rounded-3xl flex items-center justify-center shadow-large mx-auto animate-bounce-gentle">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-info-500 rounded-full px-3 py-1 shadow-lg animate-pulse">
                  <Bug className="w-4 h-4 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-error-600 dark:text-error-400 mb-2 tracking-tight">
                Oops! Algo deu errado
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                Encontramos um problema inesperado
              </p>
            </div>

            {/* Error Details */}
            <div className="space-y-4 mb-8">
              <div className="bg-error-50 dark:bg-error-950/50 border border-error-200 dark:border-error-800 rounded-2xl p-4">
                <h3 className="font-semibold text-error-800 dark:text-error-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Detalhes do Erro
                </h3>
                <p className="text-sm text-error-700 dark:text-error-300 font-mono bg-error-100 dark:bg-error-900 p-2 rounded-lg">
                  {this.state.error?.message || 'Erro desconhecido'}
                </p>
              </div>

              {import.meta.env.DEV && this.state.errorInfo && (
                <details className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4">
                  <summary className="font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    Stack Trace (Desenvolvimento)
                  </summary>
                  <pre className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 overflow-auto max-h-40 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 px-6 rounded-2xl font-bold shadow-large hover:shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 touch-target"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Tentar Novamente</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 py-4 px-6 rounded-2xl font-semibold shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 touch-target"
              >
                <Home className="w-5 h-5" />
                <span>Voltar ao Início</span>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Se o problema persistir, entre em contato com o suporte
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}