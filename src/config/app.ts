/**
 * Application configuration
 */

export const APP_CONFIG = {
  name: 'ClubNath',
  fullName: 'ClubNath - Comunidade de Mulheres',
  description: 'Seu espaço de conexão, fé e bem-estar. Comunidade de mulheres se apoiando mutuamente.',
  version: '1.0.0',
  author: 'ClubNath Team',

  // URLs
  url: {
    production: 'https://clubnath.com.br',
    development: 'http://localhost:5173',
  },

  // Features
  features: {
    pwa: true,
    offline: true,
    notifications: true,
    demoMode: true,
    emotionalIntelligence: true,
    chat: true,
    dailyQuotes: true,
  },

  // Limits
  limits: {
    postCaptionMaxLength: 2000,
    commentMaxLength: 500,
    bioMaxLength: 200,
    maxImageSize: 5 * 1024 * 1024, // 5MB
    maxPostsPerPage: 20,
    maxCommentsPerLoad: 20,
  },

  // Default values
  defaults: {
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=',
    postCategory: 'Todos' as const,
    theme: 'light' as const,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
