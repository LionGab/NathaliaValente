/**
 * ClubNath VIP - API Configuration Manager
 * 
 * Centraliza todas as configurações de APIs externas
 * e fornece métodos seguros para acessá-las.
 */

export interface APIConfig {
  openai: {
    apiKey: string;
    baseURL: string;
    model: string;
  };
  anthropic: {
    apiKey: string;
    baseURL: string;
    model: string;
  };
  gemini: {
    apiKey: string;
    baseURL: string;
    model: string;
  };
  perplexity: {
    apiKey: string;
    baseURL: string;
    model: string;
  };
  supabase: {
    url: string;
    anonKey: string;
  };
}

class APIConfigManager {
  private static instance: APIConfigManager;
  private config: APIConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): APIConfigManager {
    if (!APIConfigManager.instance) {
      APIConfigManager.instance = new APIConfigManager();
    }
    return APIConfigManager.instance;
  }

  private loadConfig(): APIConfig {
    return {
      openai: {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
        baseURL: 'https://api.openai.com/v1',
        model: 'gpt-4-turbo-preview'
      },
      anthropic: {
        apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
        baseURL: 'https://api.anthropic.com/v1',
        model: 'claude-3-sonnet-20240229'
      },
      gemini: {
        apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta',
        model: 'gemini-pro'
      },
      perplexity: {
        apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY || '',
        baseURL: 'https://api.perplexity.ai',
        model: 'llama-3.1-sonar-small-128k-online'
      },
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || '',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      }
    };
  }

  /**
   * Obtém configuração de uma API específica
   */
  public getAPIConfig(apiName: keyof APIConfig): APIConfig[keyof APIConfig] {
    return this.config[apiName];
  }

  /**
   * Verifica se uma API está configurada
   */
  public isAPIConfigured(apiName: keyof APIConfig): boolean {
    const apiConfig = this.config[apiName];
    if ('apiKey' in apiConfig) {
      return !!apiConfig.apiKey;
    }
    if ('url' in apiConfig && 'anonKey' in apiConfig) {
      return !!(apiConfig.url && apiConfig.anonKey);
    }
    return false;
  }

  /**
   * Obtém todas as APIs configuradas
   */
  public getConfiguredAPIs(): (keyof APIConfig)[] {
    return (Object.keys(this.config) as (keyof APIConfig)[]).filter(
      apiName => this.isAPIConfigured(apiName)
    );
  }

  /**
   * Valida se todas as APIs necessárias estão configuradas
   */
  public validateRequiredAPIs(): { isValid: boolean; missing: string[] } {
    const requiredAPIs: (keyof APIConfig)[] = ['supabase'];
    const missing: string[] = [];

    requiredAPIs.forEach(apiName => {
      if (!this.isAPIConfigured(apiName)) {
        missing.push(apiName);
      }
    });

    return {
      isValid: missing.length === 0,
      missing
    };
  }

  /**
   * Obtém configuração completa
   */
  public getFullConfig(): APIConfig {
    return { ...this.config };
  }

  /**
   * Atualiza configuração (útil para testes)
   */
  public updateConfig(newConfig: Partial<APIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Instância singleton
export const apiConfig = APIConfigManager.getInstance();

// Funções utilitárias
export const getOpenAIConfig = () => apiConfig.getAPIConfig('openai');
export const getAnthropicConfig = () => apiConfig.getAPIConfig('anthropic');
export const getGeminiConfig = () => apiConfig.getAPIConfig('gemini');
export const getPerplexityConfig = () => apiConfig.getAPIConfig('perplexity');
export const getSupabaseConfig = () => apiConfig.getAPIConfig('supabase');

export const isOpenAIConfigured = () => apiConfig.isAPIConfigured('openai');
export const isAnthropicConfigured = () => apiConfig.isAPIConfigured('anthropic');
export const isGeminiConfigured = () => apiConfig.isAPIConfigured('gemini');
export const isPerplexityConfigured = () => apiConfig.isAPIConfigured('perplexity');
export const isSupabaseConfigured = () => apiConfig.isAPIConfigured('supabase');

// Validação de configuração
export const validateAPIConfiguration = () => {
  const validation = apiConfig.validateRequiredAPIs();
  
  if (!validation.isValid) {
    console.error('❌ APIs obrigatórias não configuradas:', validation.missing);
    console.error('💡 Configure as variáveis de ambiente necessárias no arquivo .env');
  } else {
    console.log('✅ Todas as APIs obrigatórias estão configuradas');
  }

  const configuredAPIs = apiConfig.getConfiguredAPIs();
  console.log('🔧 APIs configuradas:', configuredAPIs);

  return validation;
};

// Auto-validação na inicialização
if (typeof window !== 'undefined') {
  validateAPIConfiguration();
}