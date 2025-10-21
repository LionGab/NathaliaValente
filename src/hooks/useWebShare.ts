import { useState, useCallback } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

interface UseWebShareReturn {
  share: (data: ShareData) => Promise<void>;
  isSupported: boolean;
  isSharing: boolean;
  error: Error | null;
}

/**
 * Hook para Web Share API
 * Permite compartilhar conteúdo nativo em dispositivos mobile
 */
export function useWebShare(): UseWebShareReturn {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Verifica se Web Share API é suportada
  const isSupported = typeof navigator !== 'undefined' && !!navigator.share;

  const share = useCallback(
    async (data: ShareData) => {
      if (!isSupported) {
        const err = new Error('Web Share API não é suportada neste navegador');
        setError(err);
        throw err;
      }

      setIsSharing(true);
      setError(null);

      try {
        await navigator.share(data);
      } catch (err) {
        // AbortError é lançado quando o usuário cancela o compartilhamento
        if ((err as Error).name !== 'AbortError') {
          setError(err as Error);
          throw err;
        }
      } finally {
        setIsSharing(false);
      }
    },
    [isSupported]
  );

  return {
    share,
    isSupported,
    isSharing,
    error,
  };
}
