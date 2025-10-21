/**
 * Centralized constants export
 */

export * from './categories';
export * from './colors';

/**
 * App configuration constants
 */
export const APP_CONFIG = {
  name: 'ClubNath',
  description: 'Apoio e Conexão para Mães',
  version: '1.0.0',
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxCaptionLength: 1000,
  maxBioLength: 200,
  postsPerPage: 20,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

/**
 * API endpoints (if needed in the future)
 */
export const API_ENDPOINTS = {
  chat: '/functions/v1/chat-ai',
} as const;
