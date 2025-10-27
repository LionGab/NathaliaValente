import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LoadingSpinner } from './LoadingSpinner';

export const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Processar o código do OAuth
        const { data, error: authError } = await supabase.auth.getSession();

        if (authError) {
          throw authError;
        }

        if (data.session) {
          setStatus('success');
          // Redirecionar para a aplicação após 1 segundo
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          throw new Error('Nenhuma sessão encontrada');
        }
      } catch (err) {
        console.error('Erro no callback:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setStatus('error');

        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    handleCallback();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
            Processando autenticação...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Erro na Autenticação
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            {error || 'Não foi possível completar a autenticação. Redirecionando...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Autenticação Bem-Sucedida!
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">Redirecionando para o app...</p>
      </div>
    </div>
  );
};
