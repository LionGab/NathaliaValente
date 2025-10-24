/**
 * Feature Flags Configuration
 * 
 * This file manages feature flags for the ClubNath VIP application.
 * Features can be enabled/disabled via environment variables or runtime configuration.
 */

export interface FeatureFlags {
  // Core Features
  safetyFeatures: boolean;
  arTryOn: boolean;
  babyTestIntegration: boolean;
  advancedMatching: boolean;
  pushNotifications: boolean;
  analytics: boolean;
  
  // UI Features
  darkMode: boolean;
  animations: boolean;
  accessibility: boolean;
  
  // Development Features
  mockData: boolean;
  debugMode: boolean;
  devMode: boolean;
  
  // External Integrations
  googleMaps: boolean;
  firebase: boolean;
  stripe: boolean;
  openai: boolean;
  
  // Social Features
  socialLogin: boolean;
  sharing: boolean;
  comments: boolean;
  
  // Premium Features
  premiumContent: boolean;
  exclusiveGroups: boolean;
  prioritySupport: boolean;
}

/**
 * Get feature flags from environment variables
 */
export const getFeatureFlags = (): FeatureFlags => {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  
  return {
    // Core Features
    safetyFeatures: import.meta.env.VITE_ENABLE_SAFETY_FEATURES === 'true' || isDev,
    arTryOn: import.meta.env.VITE_ENABLE_AR_TRYON === 'true' || isDev,
    babyTestIntegration: import.meta.env.VITE_ENABLE_BABYTEST_INTEGRATION === 'true' || isDev,
    advancedMatching: import.meta.env.VITE_ENABLE_ADVANCED_MATCHING === 'true' || isDev,
    pushNotifications: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true' || isDev,
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || isProd,
    
    // UI Features
    darkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true' || true,
    animations: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true' || true,
    accessibility: import.meta.env.VITE_ENABLE_ACCESSIBILITY === 'true' || true,
    
    // Development Features
    mockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || isDev,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true' || isDev,
    devMode: import.meta.env.VITE_DEV_MODE === 'true' || isDev,
    
    // External Integrations
    googleMaps: !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    firebase: !!import.meta.env.VITE_FIREBASE_API_KEY,
    stripe: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    openai: !!import.meta.env.VITE_OPENAI_API_KEY,
    
    // Social Features
    socialLogin: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
    sharing: true,
    comments: true,
    
    // Premium Features
    premiumContent: isProd,
    exclusiveGroups: isProd,
    prioritySupport: isProd,
  };
};

/**
 * Check if a specific feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  const flags = getFeatureFlags();
  return flags[feature];
};

/**
 * Get API configuration
 */
export const getApiConfig = () => {
  return {
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    ollin: {
      apiKey: import.meta.env.VITE_OLLIN_API_KEY,
      baseUrl: import.meta.env.VITE_OLLIN_API_BASE_URL || 'https://api.babytest.com.br',
    },
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    },
    googleMaps: {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    },
    stripe: {
      publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    },
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    },
    ar: {
      apiKey: import.meta.env.VITE_AR_API_KEY,
      serviceUrl: import.meta.env.VITE_AR_SERVICE_URL,
    },
    emergency: {
      apiKey: import.meta.env.VITE_EMERGENCY_API_KEY,
      serviceUrl: import.meta.env.VITE_EMERGENCY_SERVICE_URL,
    },
  };
};

/**
 * Validate required environment variables
 */
export const validateEnvironment = (): { isValid: boolean; missing: string[] } => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  return {
    isValid: missing.length === 0,
    missing,
  };
};

/**
 * Get app configuration
 */
export const getAppConfig = () => {
  return {
    name: import.meta.env.VITE_APP_NAME || 'ClubNath VIP',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'Comunidade exclusiva da Nathália Valente',
    defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'light',
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'pt-BR',
    supportedLanguages: import.meta.env.VITE_SUPPORTED_LANGUAGES?.split(',') || ['pt-BR'],
    cdnUrl: import.meta.env.VITE_CDN_URL,
    imagesCdnUrl: import.meta.env.VITE_IMAGES_CDN_URL,
    privacyPolicyUrl: import.meta.env.VITE_PRIVACY_POLICY_URL,
    termsUrl: import.meta.env.VITE_TERMS_URL,
    gdprEnabled: import.meta.env.VITE_GDPR_ENABLED === 'true',
  };
};

// Export feature flags instance
export const featureFlags = getFeatureFlags();
export const apiConfig = getApiConfig();
export const appConfig = getAppConfig();
