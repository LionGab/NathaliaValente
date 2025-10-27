/**
 * ClubNath VIP - API Configuration Service
 * Centraliza todas as configurações de APIs externas
 */

export interface APIConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  ai: {
    openai: {
      apiKey: string;
      model: string;
    };
    claude: {
      apiKey: string;
      model: string;
    };
    perplexity: {
      apiKey: string;
      model: string;
    };
    gemini: {
      apiKey: string;
      model: string;
    };
    primary: string;
    maxTokens: number;
    temperature: number;
    topP: number;
  };
  payments: {
    stripe: {
      publishableKey: string;
      secretKey: string;
    };
    paypal: {
      clientId: string;
    };
  };
  features: {
    safety: boolean;
    arTryOn: boolean;
    babyTest: boolean;
    advancedMatching: boolean;
    pushNotifications: boolean;
    analytics: boolean;
    aiFeatures: boolean;
    payments: boolean;
  };
  external: {
    nava: {
      storeUrl: string;
      apiKey?: string;
    };
    ollin: {
      storeUrl: string;
      babyTestUrl: string;
      apiKey?: string;
    };
  };
}

class APIConfigService {
  private config: APIConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): APIConfig {
    return {
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || '',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '',
      },
      ai: {
        openai: {
          apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
          model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4',
        },
        claude: {
          apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
          model: import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        },
        perplexity: {
          apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY || '',
          model: import.meta.env.VITE_PERPLEXITY_MODEL || 'llama-3.1-sonar-small-128k-online',
        },
        gemini: {
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
          model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro',
        },
        primary: import.meta.env.VITE_PRIMARY_AI_SERVICE || 'openai',
        maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '2000'),
        temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7'),
        topP: parseFloat(import.meta.env.VITE_AI_TOP_P || '0.9'),
      },
      payments: {
        stripe: {
          publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
          secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
        },
        paypal: {
          clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
        },
      },
      features: {
        safety: import.meta.env.VITE_ENABLE_SAFETY_FEATURES === 'true',
        arTryOn: import.meta.env.VITE_ENABLE_AR_TRYON === 'true',
        babyTest: import.meta.env.VITE_ENABLE_BABYTEST_INTEGRATION === 'true',
        advancedMatching: import.meta.env.VITE_ENABLE_ADVANCED_MATCHING === 'true',
        pushNotifications: import.meta.env.VITE_ENABLE_PUSH_NOTIFICATIONS === 'true',
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        aiFeatures: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
        payments: import.meta.env.VITE_ENABLE_PAYMENTS === 'true',
      },
      external: {
        nava: {
          storeUrl: import.meta.env.VITE_NAVA_STORE_URL || 'https://www.navabeachwear.com.br/',
          apiKey: import.meta.env.VITE_NAVA_API_KEY,
        },
        ollin: {
          storeUrl: import.meta.env.VITE_OLLIN_STORE_URL || 'https://ollin.com.br/',
          babyTestUrl: import.meta.env.VITE_OLLIN_BABYTEST_URL || 'https://ollin.com.br/babytest',
          apiKey: import.meta.env.VITE_OLLIN_API_KEY,
        },
      },
    };
  }

  /**
   * Obtém a configuração completa
   */
  getConfig(): APIConfig {
    return this.config;
  }

  /**
   * Verifica se uma API está configurada
   */
  isAPIConfigured(apiName: keyof APIConfig): boolean {
    switch (apiName) {
      case 'supabase':
        return !!(this.config.supabase.url && this.config.supabase.anonKey);
      case 'ai':
        return this.isAIConfigured();
      case 'payments':
        return this.isPaymentsConfigured();
      default:
        return false;
    }
  }

  /**
   * Verifica se pelo menos uma API de IA está configurada
   */
  private isAIConfigured(): boolean {
    const { openai, claude, perplexity, gemini } = this.config.ai;
    return !!(openai.apiKey || claude.apiKey || perplexity.apiKey || gemini.apiKey);
  }

  /**
   * Verifica se pelo menos um sistema de pagamento está configurado
   */
  private isPaymentsConfigured(): boolean {
    const { stripe, paypal } = this.config.payments;
    return !!(stripe.publishableKey || paypal.clientId);
  }

  /**
   * Obtém a configuração da API de IA primária
   */
  getPrimaryAIConfig() {
    const { primary } = this.config.ai;
    switch (primary) {
      case 'openai':
        return this.config.ai.openai;
      case 'claude':
        return this.config.ai.claude;
      case 'perplexity':
        return this.config.ai.perplexity;
      case 'gemini':
        return this.config.ai.gemini;
      default:
        return this.config.ai.openai;
    }
  }

  /**
   * Verifica se uma feature está habilitada
   */
  isFeatureEnabled(feature: keyof APIConfig['features']): boolean {
    return this.config.features[feature];
  }

  /**
   * Obtém a URL base da API
   */
  getAPIBaseURL(): string {
    return import.meta.env.VITE_API_BASE_URL || this.config.supabase.url;
  }

  /**
   * Verifica se está em modo de desenvolvimento
   */
  isDevelopment(): boolean {
    return import.meta.env.VITE_DEV_MODE === 'true' || import.meta.env.DEV;
  }

  /**
   * Verifica se deve usar dados mock
   */
  shouldUseMockData(): boolean {
    return import.meta.env.VITE_USE_MOCK_DATA === 'true' || this.isDevelopment();
  }

  /**
   * Obtém configurações de rate limiting
   */
  getRateLimitConfig() {
    return {
      limit: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '100'),
      window: parseInt(import.meta.env.VITE_API_RATE_WINDOW || '60000'),
    };
  }

  /**
   * Obtém configurações de cache
   */
  getCacheConfig() {
    return {
      ttl: parseInt(import.meta.env.VITE_CACHE_TTL || '300000'),
      imageOptimization: import.meta.env.VITE_IMAGE_OPTIMIZATION === 'true',
      lazyLoading: import.meta.env.VITE_LAZY_LOADING === 'true',
    };
  }

  /**
   * Valida se todas as configurações essenciais estão presentes
   */
  validateEssentialConfig(): { isValid: boolean; missing: string[] } {
    const missing: string[] = [];

    // Supabase é essencial
    if (!this.config.supabase.url) missing.push('VITE_SUPABASE_URL');
    if (!this.config.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY');

    // Pelo menos uma API de IA é recomendada
    if (!this.isAIConfigured()) {
      missing.push('Pelo menos uma API de IA (OpenAI, Claude, Perplexity ou Gemini)');
    }

    // Pelo menos um sistema de pagamento é recomendado
    if (!this.isPaymentsConfigured()) {
      missing.push('Pelo menos um sistema de pagamento (Stripe ou PayPal)');
    }

    return {
      isValid: missing.length === 0,
      missing,
    };
  }

  /**
   * Obtém informações de debug sobre as configurações
   */
  getDebugInfo() {
    const validation = this.validateEssentialConfig();
    
    return {
      environment: import.meta.env.MODE,
      isDevelopment: this.isDevelopment(),
      useMockData: this.shouldUseMockData(),
      configuredAPIs: {
        supabase: this.isAPIConfigured('supabase'),
        ai: this.isAPIConfigured('ai'),
        payments: this.isAPIConfigured('payments'),
      },
      primaryAI: this.config.ai.primary,
      features: this.config.features,
      validation,
      apiBaseURL: this.getAPIBaseURL(),
    };
  }
}

// Instância singleton
export const apiConfig = new APIConfigService();

// Exportar também a classe para testes
export { APIConfigService };
