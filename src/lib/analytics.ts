// Google Analytics 4 Integration
export const initAnalytics = () => {
    if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
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
        });
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
export const trackEngagement = (action: string, category: string, label?: string, value?: number) => {
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
export const trackPostInteraction = (action: 'like' | 'comment' | 'share' | 'create', postId?: string) => {
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
export const trackChatInteraction = (action: 'message' | 'nathia_query', messageLength?: number) => {
    trackEvent('chat_interaction', {
        event_category: 'chat',
        value: messageLength,
        custom_parameter: action,
    });
};

// Track monetization events
export const trackMonetization = (action: 'view_shop' | 'add_to_cart' | 'purchase', value?: number) => {
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

// Declare global gtag function
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}
