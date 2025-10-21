/**
 * Pull-to-refresh hook for mobile devices
 * Implements native-like pull-to-refresh functionality
 */

import { useEffect, useRef, useState, useCallback } from 'react';

export interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number; // Pixels to pull before triggering refresh
  resistance?: number; // Pull resistance factor (0-1)
  enabled?: boolean;
}

export interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
}

export const usePullToRefresh = (options: PullToRefreshOptions) => {
  const { onRefresh, threshold = 80, resistance = 0.5, enabled = true } = options;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
  });

  const startY = useRef(0);
  const currentY = useRef(0);
  const scrollableElement = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const element = scrollableElement.current || document.documentElement;

      // Only allow pull-to-refresh when at the top of the page
      if (element.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    },
    [enabled]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || state.isRefreshing) return;

      const element = scrollableElement.current || document.documentElement;

      // Only process if we're at the top and pulling down
      if (element.scrollTop === 0 && startY.current > 0) {
        currentY.current = e.touches[0].clientY;
        const diff = currentY.current - startY.current;

        if (diff > 0) {
          // Prevent default scroll behavior
          e.preventDefault();

          // Calculate pull distance with resistance
          const pullDistance = diff * resistance;

          setState((prev) => ({
            ...prev,
            isPulling: true,
            pullDistance: Math.min(pullDistance, threshold * 1.5),
          }));
        }
      }
    },
    [enabled, resistance, threshold, state.isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || state.isRefreshing) return;

    if (state.pullDistance >= threshold) {
      // Trigger refresh
      setState((prev) => ({
        ...prev,
        isRefreshing: true,
        isPulling: false,
      }));

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      } finally {
        setState((prev) => ({
          ...prev,
          isRefreshing: false,
          pullDistance: 0,
        }));
      }
    } else {
      // Reset state
      setState((prev) => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
      }));
    }

    startY.current = 0;
    currentY.current = 0;
  }, [enabled, onRefresh, state.pullDistance, state.isRefreshing, threshold]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  const setScrollableElement = (element: HTMLElement | null) => {
    scrollableElement.current = element;
  };

  return {
    ...state,
    setScrollableElement,
  };
};
