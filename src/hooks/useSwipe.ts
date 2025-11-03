/**
 * Custom hook for handling swipe gestures on mobile
 * Provides swipe detection with configurable thresholds
 */

import { useEffect, useRef, useState } from 'react';

export interface SwipeConfig {
  minSwipeDistance?: number; // Minimum distance in pixels to register as swipe
  maxSwipeTime?: number; // Maximum time in ms for swipe gesture
  preventScroll?: boolean; // Prevent default scroll behavior during swipe
}

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

const DEFAULT_CONFIG: SwipeConfig = {
  minSwipeDistance: 50,
  maxSwipeTime: 300,
  preventScroll: false,
};

/**
 * Hook for detecting swipe gestures
 */
export function useSwipe(handlers: SwipeHandlers, config: SwipeConfig = {}) {
  const touchStart = useRef<TouchPosition | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      setIsSwiping(true);

      if (finalConfig.preventScroll) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || !finalConfig.preventScroll) return;
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      setIsSwiping(false);

      // Check if swipe time is within limit
      if (deltaTime > finalConfig.maxSwipeTime!) {
        touchStart.current = null;
        return;
      }

      // Determine swipe direction based on larger delta
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX >= finalConfig.minSwipeDistance!) {
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (absDeltaY >= finalConfig.minSwipeDistance!) {
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      }

      touchStart.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart, {
      passive: !finalConfig.preventScroll,
    });
    document.addEventListener('touchmove', handleTouchMove, {
      passive: !finalConfig.preventScroll,
    });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, finalConfig]);

  return { isSwiping };
}

/**
 * Hook for pull-to-refresh gesture
 */
export function usePullToRefresh(onRefresh: () => void | Promise<void>, threshold = 80) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStart = useRef<number | null>(null);
  const scrollTop = useRef<number>(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      scrollTop.current = window.scrollY || document.documentElement.scrollTop;

      // Only enable pull-to-refresh if at top of page
      if (scrollTop.current === 0) {
        const touch = e.touches[0];
        touchStart.current = touch.clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart.current === null || scrollTop.current > 0) return;

      const touch = e.touches[0];
      const delta = touch.clientY - touchStart.current;

      // Only track downward pull
      if (delta > 0) {
        setPullDistance(Math.min(delta, threshold * 1.5));

        // Prevent default scroll if pulling down
        if (delta > 10) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);

        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      touchStart.current = null;
      setPullDistance(0);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold, pullDistance, isRefreshing]);

  const refreshProgress = Math.min((pullDistance / threshold) * 100, 100);

  return {
    isRefreshing,
    pullDistance,
    refreshProgress,
  };
}

/**
 * Hook for long press gesture
 */
export function useLongPress(
  onLongPress: () => void,
  options: { delay?: number; shouldPreventDefault?: boolean } = {}
) {
  const { delay = 500, shouldPreventDefault = true } = options;
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = (e: TouchEvent | MouseEvent) => {
    if (shouldPreventDefault && e.target) {
      e.preventDefault();
      target.current = e.target;
    }

    timeout.current = setTimeout(() => {
      onLongPress();
    }, delay);
  };

  const clear = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
}
