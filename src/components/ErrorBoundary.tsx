/**
 * React Error Boundary Component
 * Catches and handles React component errors gracefully
 */

import { Component, ReactNode, ErrorInfo } from 'react';
import { logReactError } from '../services/monitoring.service';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
    // Log error to monitoring service
    logReactError(error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-claude-gray-900 rounded-2xl shadow-claude-lg p-8">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-claude-gray-900 dark:text-white mb-2">
                Ops! Algo deu errado
              </h1>

              {/* Description */}
              <p className="text-claude-gray-600 dark:text-claude-gray-400 mb-6">
                Encontramos um erro inesperado. Não se preocupe, já registramos o problema e vamos corrigi-lo em breve.
              </p>

              {/* Error details (development only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="w-full mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <p className="text-xs font-mono text-red-800 dark:text-red-200 text-left overflow-auto">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="text-xs text-red-700 dark:text-red-300 cursor-pointer">
                        Stack Trace
                      </summary>
                      <pre className="text-xs font-mono text-red-800 dark:text-red-200 mt-2 overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  Recarregar Página
                </button>
              </div>

              {/* Help text */}
              <p className="text-xs text-claude-gray-500 dark:text-claude-gray-500 mt-6">
                Se o problema persistir, tente limpar o cache do navegador ou entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
