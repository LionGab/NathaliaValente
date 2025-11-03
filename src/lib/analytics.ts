// Google Analytics 4 Integration - Enhanced for Maternity App
export const initAnalytics = () => {
  // Always initialize in development for testing
  if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_title: 'Nossa Maternidade',
      page_location: window.location.href,
      // Enhanced ecommerce for subscription tracking
      send_page_view: true,
      custom_map: {
        custom_parameter_1: 'user_week',
        custom_parameter_2: 'user_type',
        custom_parameter_3: 'subscription_status',
      },
    });

    console.log('✅ Analytics inicializado:', import.meta.env.VITE_GA_MEASUREMENT_ID);
  } else {
    console.warn('⚠️ VITE_GA_MEASUREMENT_ID não configurado');
  }
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

// Track events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

// Track user engagement
export const trackEngagement = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  trackEvent('engagement', {
    event_category: category,
    event_label: label,
    value: value,
    custom_parameter: action,
  });
};

// Track authentication events
export const trackAuth = (action: 'login' | 'logout' | 'signup', method?: string) => {
  trackEvent('auth', {
    event_category: 'authentication',
    event_label: method || 'unknown',
    custom_parameter: action,
  });
};

// Track post interactions
export const trackPostInteraction = (
  action: 'like' | 'comment' | 'share' | 'create',
  postId?: string
) => {
  trackEvent('post_interaction', {
    event_category: 'posts',
    event_label: postId,
    custom_parameter: action,
  });
};

// Track group interactions
export const trackGroupInteraction = (action: 'join' | 'leave' | 'create', groupId?: string) => {
  trackEvent('group_interaction', {
    event_category: 'groups',
    event_label: groupId,
    custom_parameter: action,
  });
};

// Track chat interactions
export const trackChatInteraction = (
  action: 'message' | 'nathia_query',
  messageLength?: number
) => {
  trackEvent('chat_interaction', {
    event_category: 'chat',
    value: messageLength,
    custom_parameter: action,
  });
};

// Track monetization events
export const trackMonetization = (
  action: 'view_shop' | 'add_to_cart' | 'purchase',
  value?: number
) => {
  trackEvent('monetization', {
    event_category: 'ecommerce',
    value: value,
    custom_parameter: action,
  });
};

// Track performance metrics
export const trackPerformance = (metric: string, value: number, unit: string = 'ms') => {
  trackEvent('performance', {
    event_category: 'performance',
    event_label: metric,
    value: value,
    custom_parameter: unit,
  });
};

// Track errors
export const trackError = (error: string, fatal: boolean = false) => {
  trackEvent('exception', {
    description: error,
    fatal: fatal,
  });
};

// === MATERNITY-SPECIFIC EVENTS ===

// Track pregnancy milestones
export const trackPregnancyMilestone = (milestone: string, week: number) => {
  trackEvent('pregnancy_milestone', {
    event_category: 'pregnancy',
    milestone: milestone,
    week: week,
    user_week: week,
  });
};

// Track NAT IA interactions
export const trackNathIA = (
  action: 'query' | 'satisfied' | 'dissatisfied',
  queryLength?: number
) => {
  trackEvent('nathia_interaction', {
    event_category: 'ai_assistant',
    action: action,
    query_length: queryLength,
    user_type: 'gestante',
  });
};

// Track community engagement
export const trackCommunityEngagement = (
  action: 'post_created' | 'comment_added' | 'like_given',
  category?: string
) => {
  trackEvent('community_engagement', {
    event_category: 'community',
    action: action,
    post_category: category,
    user_type: 'gestante',
  });
};

// Track subscription funnel
export const trackSubscriptionFunnel = (
  step: 'paywall_viewed' | 'trial_started' | 'payment_completed' | 'cancelled',
  value?: number
) => {
  trackEvent('subscription_funnel', {
    event_category: 'monetization',
    funnel_step: step,
    value: value,
    currency: 'BRL',
  });
};

// Track content consumption
export const trackContentConsumption = (
  contentType: 'video' | 'article' | 'tip' | 'quote',
  week: number,
  duration?: number
) => {
  trackEvent('content_consumption', {
    event_category: 'content',
    content_type: contentType,
    week: week,
    duration_seconds: duration,
    user_week: week,
  });
};

// Track user journey
export const trackUserJourney = (
  step:
    | 'onboarding_start'
    | 'onboarding_complete'
    | 'first_post'
    | 'first_nathia'
    | 'first_purchase'
) => {
  trackEvent('user_journey', {
    event_category: 'engagement',
    journey_step: step,
    user_type: 'gestante',
  });
};

// Track app performance
export const trackAppPerformance = (
  metric: 'load_time' | 'api_response' | 'image_load',
  value: number,
  unit: string = 'ms'
) => {
  trackEvent('app_performance', {
    event_category: 'performance',
    metric_name: metric,
    value: value,
    unit: unit,
  });
};

// Declare global gtag function
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
