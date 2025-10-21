import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-claude-cream-50 dark:bg-claude-gray-950 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-claude-gray-800 rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Ops! Algo deu errado
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Houve um problema inesperado. Tente recarregar a página.
            </p>
            
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            
            <button
              onClick={this.handleReload}
              className="w-full bg-gradient-to-r from-claude-orange-500 to-claude-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 touch-target"
            >
              <RefreshCw className="w-5 h-5" />
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
