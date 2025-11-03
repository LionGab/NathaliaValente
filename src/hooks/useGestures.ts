import { useRef, useCallback, useEffect, useState } from 'react';

interface GestureConfig {
  threshold?: number;
  velocity?: number;
  damping?: number;
  stiffness?: number;
}

export const useSwipeGesture = (config: GestureConfig = {}) => {
  const { threshold = 50, velocity = 0.3, damping = 20, stiffness = 300 } = config;

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const onSwipeStart = useCallback((event: TouchEvent | MouseEvent) => {
    // Implementation for swipe start
  }, []);

  const onSwipeMove = useCallback((event: TouchEvent | MouseEvent) => {
    // Implementation for swipe move
  }, []);

  const onSwipeEnd = useCallback((event: TouchEvent | MouseEvent) => {
    // Implementation for swipe end
  }, []);

  return {
    x,
    y,
    onSwipeStart,
    onSwipeMove,
    onSwipeEnd,
  };
};

export const usePullToRefresh = (onRefresh: () => Promise<void>, config: GestureConfig = {}) => {
  const { threshold = 80, damping = 25, stiffness = 300 } = config;

  const [y, setY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = event.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing) {
        const currentY = event.touches[0].clientY;
        const deltaY = currentY - startY.current;

        if (deltaY > 0) {
          event.preventDefault();
          setY(deltaY * 0.5); // Dampen the pull
        }
      }
    },
    [isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }

    setY(0);
  }, [y, threshold, onRefresh, isRefreshing]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    y,
    isRefreshing,
  };
};

export const useInfiniteScroll = (
  callback: () => void,
  hasMore: boolean,
  threshold: number = 100
) => {
  const observerRef = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            callback();
          }
        },
        {
          rootMargin: `${threshold}px`,
        }
      );

      if (node) observerRef.current.observe(node);
    },
    [callback, hasMore, threshold]
  );

  return lastElementRef;
};

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  return { triggerHaptic };
};

export const useLongPress = (onLongPress: () => void, delay: number = 500) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const targetRef = useRef<EventTarget>();

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      targetRef.current = event.target;
      timeoutRef.current = setTimeout(() => {
        onLongPress();
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
  };
};
