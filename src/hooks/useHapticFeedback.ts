import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: HapticType = 'medium') => {
    // Verificar se o navegador suporta vibração
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50],
        success: [20, 10, 20],
        warning: [30, 20, 30],
        error: [50, 20, 50, 20, 50]
      };
      
      navigator.vibrate(patterns[type]);
    }
    
    // Fallback para dispositivos sem vibração
    if (!('vibrate' in navigator)) {
      // Simular feedback visual
      document.body.style.transform = 'scale(0.98)';
      setTimeout(() => {
        document.body.style.transform = 'scale(1)';
      }, 100);
    }
  }, []);

  const triggerSuccess = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const triggerWarning = useCallback(() => triggerHaptic('warning'), [triggerHaptic]);
  const triggerError = useCallback(() => triggerHaptic('error'), [triggerHaptic]);
  const triggerLight = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const triggerHeavy = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);

  return {
    triggerHaptic,
    triggerSuccess,
    triggerWarning,
    triggerError,
    triggerLight,
    triggerHeavy
  };
};
