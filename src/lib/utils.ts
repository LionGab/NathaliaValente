import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility functions for design system
export function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Animation utilities
export function createSpringAnimation(
  from: number,
  to: number,
  duration: number = 300,
  damping: number = 0.8
) {
  return {
    from: { transform: `translateY(${from}px)` },
    to: { transform: `translateY(${to}px)` },
    config: {
      duration,
      damping,
      tension: 300
    }
  };
}

// Responsive utilities
export function getResponsiveValue<T>(
  values: { xs?: T; sm?: T; md?: T; lg?: T; xl?: T },
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md'
): T | undefined {
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
  const currentIndex = breakpoints.indexOf(breakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpoints[i] as keyof typeof values;
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
}

// Format utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'Agora mesmo';
  }
  if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h atrás`;
  }
  if (diffInHours < 168) { // 7 days
    return `${Math.floor(diffInHours / 24)}d atrás`;
  }
  
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Accessibility utilities
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getAriaLabel(text: string, action?: string): string {
  return action ? `${action}: ${text}` : text;
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
