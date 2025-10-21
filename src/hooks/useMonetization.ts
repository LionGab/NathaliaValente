import { useState, useEffect } from 'react';

interface MonetizationStrategy {
  type: 'freemium' | 'subscription' | 'paywall' | 'community';
  price: number;
  currency: 'BRL' | 'USD';
  features: string[];
  cta: string;
}

interface UserEngagement {
  sessionTime: number;
  postsViewed: number;
  interactions: number;
  daysActive: number;
}

export const useMonetization = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerVariant, setBannerVariant] = useState<'premium' | 'community' | 'exclusive'>('premium');
  const [userEngagement, setUserEngagement] = useState<UserEngagement>({
    sessionTime: 0,
    postsViewed: 0,
    interactions: 0,
    daysActive: 0
  });

  // Track user engagement
  useEffect(() => {
    const startTime = Date.now();
    
    const updateSessionTime = () => {
      setUserEngagement(prev => ({
        ...prev,
        sessionTime: Date.now() - startTime
      }));
    };

    const interval = setInterval(updateSessionTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smart banner timing based on engagement
  useEffect(() => {
    const { sessionTime, postsViewed, interactions } = userEngagement;
    
    // Show banner when user is highly engaged
    if (sessionTime > 30000 && postsViewed > 3 && interactions > 2) {
      setShowBanner(true);
      
      // Choose variant based on behavior
      if (interactions > 5) {
        setBannerVariant('community');
      } else if (postsViewed > 5) {
        setBannerVariant('exclusive');
      } else {
        setBannerVariant('premium');
      }
    }
  }, [userEngagement]);

  const trackInteraction = (type: 'post_view' | 'like' | 'comment' | 'share') => {
    setUserEngagement(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
      postsViewed: type === 'post_view' ? prev.postsViewed + 1 : prev.postsViewed
    }));
  };

  const getMonetizationStrategy = (): MonetizationStrategy => {
    const { sessionTime, postsViewed, interactions } = userEngagement;
    
    // High engagement = premium subscription
    if (interactions > 10 && sessionTime > 60000) {
      return {
        type: 'subscription',
        price: 39,
        currency: 'BRL',
        features: ['Lives exclusivas', 'Grupo VIP', 'Conteúdo antecipado', 'Suporte prioritário'],
        cta: 'Assinar Club Nath Premium'
      };
    }
    
    // Medium engagement = community access
    if (interactions > 5) {
      return {
        type: 'community',
        price: 19,
        currency: 'BRL',
        features: ['Grupo WhatsApp', 'Conteúdo exclusivo', 'Suporte da comunidade'],
        cta: 'Entrar na Comunidade'
      };
    }
    
    // Low engagement = freemium with paywall
    return {
      type: 'paywall',
      price: 9,
      currency: 'BRL',
      features: ['Conteúdo premium', 'Sem anúncios'],
      cta: 'Desbloquear Conteúdo'
    };
  };

  const handleMonetizationClick = (strategy: MonetizationStrategy) => {
    // Track conversion attempt
    console.log('Monetization click:', strategy);
    
    // In a real app, this would redirect to payment
    // For now, we'll simulate the flow
    if (strategy.type === 'subscription') {
      // Redirect to subscription page
      window.open('/subscribe', '_blank');
    } else if (strategy.type === 'community') {
      // Redirect to WhatsApp group
      window.open('https://wa.me/5511999999999', '_blank');
    } else {
      // Show paywall modal
      setShowBanner(true);
    }
  };

  return {
    showBanner,
    bannerVariant,
    userEngagement,
    trackInteraction,
    getMonetizationStrategy,
    handleMonetizationClick,
    closeBanner: () => setShowBanner(false)
  };
};
