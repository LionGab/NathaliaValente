/**
 * Application routes configuration
 */

export const ROUTES = {
  HOME: '/',
  FEED: '/feed',
  CHAT: '/chat',
  SEARCH: '/search',
  DAILY_QUOTE: '/daily',
  PROFILE: '/profile',
  AUTH: '/auth',
  ONBOARDING: '/onboarding',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

export const NAVIGATION_ITEMS = [
  { path: ROUTES.FEED, icon: 'Home', label: 'Feed' },
  { path: ROUTES.SEARCH, icon: 'Search', label: 'Buscar' },
  { path: ROUTES.DAILY_QUOTE, icon: 'Sparkles', label: 'Frase' },
  { path: ROUTES.CHAT, icon: 'MessageCircle', label: 'Chat' },
] as const;
