/**
 * ClubNath VIP - Environment Configuration
 * Validação e configuração de variáveis de ambiente
 */

export interface AppConfig {
    // Supabase
    supabase: {
        url: string;
        anonKey: string;
    };

    // App
    app: {
        url: string;
        environment: 'development' | 'staging' | 'production';
        name: string;
        version: string;
    };

    // Feature flags
    features: {
        analytics: boolean;
        errorTracking: boolean;
        pwa: boolean;
        offlineMode: boolean;
    };

    // External services
    services: {
        googleAnalytics?: string;
        sentry?: string;
    };

    // Development
    dev: {
        debugMode: boolean;
        mockApi: boolean;
        devTools: boolean;
    };
}

class ConfigManager {
    private config: AppConfig | null = null;
    private validationErrors: string[] = [];

    /**
     * Valida e carrega a configuração
     */
    loadConfig(): AppConfig {
        if (this.config) {
            return this.config;
        }

        this.validationErrors = [];

        try {
            this.config = this.validateAndBuildConfig();
            return this.config;
        } catch (error) {
            console.error('Failed to load configuration:', error);
            throw new Error(`Configuration validation failed: ${this.validationErrors.join(', ')}`);
        }
    }

    /**
     * Valida e constrói a configuração
     */
    private validateAndBuildConfig(): AppConfig {
        const config: AppConfig = {
            supabase: {
                url: this.getRequiredEnvVar('VITE_SUPABASE_URL'),
                anonKey: this.getRequiredEnvVar('VITE_SUPABASE_ANON_KEY')
            },
            app: {
                url: this.getEnvVar('VITE_APP_URL', 'https://clubnath.app'),
                environment: this.getEnvVar('VITE_ENVIRONMENT', 'development') as 'development' | 'staging' | 'production',
                name: this.getEnvVar('VITE_APP_NAME', 'ClubNath VIP'),
                version: this.getEnvVar('VITE_APP_VERSION', '1.0.0')
            },
            features: {
                analytics: this.getBooleanEnvVar('VITE_ENABLE_ANALYTICS', true),
                errorTracking: this.getBooleanEnvVar('VITE_ENABLE_ERROR_TRACKING', true),
                pwa: this.getBooleanEnvVar('VITE_ENABLE_PWA', true),
                offlineMode: this.getBooleanEnvVar('VITE_ENABLE_OFFLINE_MODE', true)
            },
            services: {
                googleAnalytics: this.getOptionalEnvVar('VITE_GOOGLE_ANALYTICS_ID'),
                sentry: this.getOptionalEnvVar('VITE_SENTRY_DSN')
            },
            dev: {
                debugMode: this.getBooleanEnvVar('VITE_DEBUG_MODE', false),
                mockApi: this.getBooleanEnvVar('VITE_MOCK_API', false),
                devTools: this.getBooleanEnvVar('VITE_DEV_TOOLS', false)
            }
        };

        // Validações específicas
        this.validateSupabaseConfig(config.supabase);
        this.validateAppConfig(config.app);
        this.validateFeatureFlags(config.features);

        if (this.validationErrors.length > 0) {
            throw new Error(`Configuration validation failed: ${this.validationErrors.join(', ')}`);
        }

        return config;
    }

    /**
     * Obtém variável de ambiente obrigatória
     */
    private getRequiredEnvVar(key: string): string {
        const value = import.meta.env[key];
        if (!value) {
            this.validationErrors.push(`Missing required environment variable: ${key}`);
            return '';
        }
        return value;
    }

    /**
     * Obtém variável de ambiente opcional
     */
    private getOptionalEnvVar(key: string): string | undefined {
        return import.meta.env[key];
    }

    /**
     * Obtém variável de ambiente com valor padrão
     */
    private getEnvVar(key: string, defaultValue: string): string {
        return import.meta.env[key] || defaultValue;
    }

    /**
     * Obtém variável de ambiente booleana
     */
    private getBooleanEnvVar(key: string, defaultValue: boolean): boolean {
        const value = import.meta.env[key];
        if (value === undefined) {
            return defaultValue;
        }
        return value.toLowerCase() === 'true';
    }

    /**
     * Valida configuração do Supabase
     */
    private validateSupabaseConfig(supabase: AppConfig['supabase']): void {
        if (!supabase.url.startsWith('https://')) {
            this.validationErrors.push('VITE_SUPABASE_URL must be a valid HTTPS URL');
        }

        if (!supabase.anonKey || supabase.anonKey.length < 20) {
            this.validationErrors.push('VITE_SUPABASE_ANON_KEY must be a valid key');
        }
    }

    /**
     * Valida configuração da aplicação
     */
    private validateAppConfig(app: AppConfig['app']): void {
        if (!app.url.startsWith('https://')) {
            this.validationErrors.push('VITE_APP_URL must be a valid HTTPS URL');
        }

        if (!['development', 'staging', 'production'].includes(app.environment)) {
            this.validationErrors.push('VITE_ENVIRONMENT must be development, staging, or production');
        }
    }

    /**
     * Valida feature flags
     */
    private validateFeatureFlags(features: AppConfig['features']): void {
        // Feature flags são opcionais, apenas valida se são booleanos
        // (já validado pelo getBooleanEnvVar)
    }

    /**
     * Retorna a configuração atual
     */
    getConfig(): AppConfig {
        if (!this.config) {
            return this.loadConfig();
        }
        return this.config;
    }

    /**
     * Retorna erros de validação
     */
    getValidationErrors(): string[] {
        return [...this.validationErrors];
    }

    /**
     * Verifica se está em produção
     */
    isProduction(): boolean {
        return this.getConfig().app.environment === 'production';
    }

    /**
     * Verifica se está em desenvolvimento
     */
    isDevelopment(): boolean {
        return this.getConfig().app.environment === 'development';
    }

    /**
     * Verifica se feature está habilitada
     */
    isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
        return this.getConfig().features[feature];
    }
}

// Instância singleton
export const configManager = new ConfigManager();

// Configuração global
export const config = configManager.loadConfig();

// Funções helper
export const getConfig = (): AppConfig => configManager.getConfig();
export const isProduction = (): boolean => configManager.isProduction();
export const isDevelopment = (): boolean => configManager.isDevelopment();
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean =>
    configManager.isFeatureEnabled(feature);

// Hook para React
export const useConfig = () => {
    return {
        config: getConfig(),
        isProduction: isProduction(),
        isDevelopment: isDevelopment(),
        isFeatureEnabled
    };
};
