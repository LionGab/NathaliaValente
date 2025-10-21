/**
 * Color and gradient definitions
 * Centralized theme colors to maintain consistency
 */

import type { Category } from './categories';

/**
 * Tailwind gradient classes for each category
 * These match the design system colors
 */
export const CATEGORY_GRADIENTS: Record<Category, string> = {
  'Look do dia': 'gradient-orange',
  Desabafo: 'gradient-purple',
  Fé: 'gradient-blue',
  'Dica de mãe': 'gradient-green',
};

/**
 * Tailwind gradient classes for profile/card backgrounds
 */
export const CATEGORY_COLORS: Record<Category, string> = {
  'Look do dia': 'from-pink-400 to-rose-400',
  Desabafo: 'from-purple-400 to-indigo-400',
  Fé: 'from-blue-400 to-cyan-400',
  'Dica de mãe': 'from-green-400 to-emerald-400',
};

/**
 * Get gradient class for a category
 * Falls back to gray if category is invalid
 */
export function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category as Category] || 'bg-claude-gray-400';
}

/**
 * Get color gradient for a category
 * Falls back to gray if category is invalid
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category as Category] || 'from-gray-400 to-gray-500';
}

/**
 * Primary brand colors
 */
export const BRAND_COLORS = {
  primary: 'claude-orange-500',
  secondary: 'claude-purple-500',
  accent: 'claude-pink-500',
} as const;

/**
 * Status colors for UI feedback
 */
export const STATUS_COLORS = {
  success: 'green-500',
  error: 'red-500',
  warning: 'yellow-500',
  info: 'blue-500',
} as const;
