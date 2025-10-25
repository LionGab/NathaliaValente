/**
 * ClubNath VIP - API Client with Error Handling and Retry Logic
 * Cliente API com tratamento de erros e lógica de retry
 */

import { supabase } from './supabase';
import { errorHandler, ErrorType, ErrorContext } from './errorHandler';

export interface ApiClientOptions {
    retries?: number;
    timeout?: number;
    retryDelay?: number;
    feature?: string;
}

export interface ApiResponse<T> {
    data: T | null;
    error: Error | null;
    success: boolean;
}

class ApiClient {
    private defaultOptions: Required<ApiClientOptions> = {
        retries: 3,
        timeout: 10000, // 10 segundos
        retryDelay: 1000, // 1 segundo
        feature: 'api'
    };

    /**
     * Executa uma operação com retry automático
     */
    async executeWithRetry<T>(
        operation: () => Promise<T>,
        options: ApiClientOptions = {}
    ): Promise<ApiResponse<T>> {
        const opts = { ...this.defaultOptions, ...options };
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= opts.retries; attempt++) {
            try {
                const result = await this.withTimeout(operation(), opts.timeout);
                return {
                    data: result,
                    error: null,
                    success: true
                };
            } catch (error) {
                lastError = error as Error;

                // Se não é a última tentativa e o erro é recuperável
                if (attempt < opts.retries && this.isRetryableError(error as Error)) {
                    const delay = opts.retryDelay * Math.pow(2, attempt); // Backoff exponencial
                    await this.delay(delay);
                    continue;
                }

                // Se é a última tentativa ou erro não recuperável
                break;
            }
        }

        // Registra o erro
        const errorDetails = errorHandler.handleError(
            lastError!,
            {
                feature: opts.feature,
                action: 'api_call',
                timestamp: Date.now()
            },
            opts.feature
        );

        return {
            data: null,
            error: lastError,
            success: false
        };
    }

    /**
     * Verifica se o erro é recuperável
     */
    private isRetryableError(error: Error): boolean {
        const message = error.message.toLowerCase();
        return (
            message.includes('network') ||
            message.includes('timeout') ||
            message.includes('server') ||
            message.includes('500') ||
            message.includes('502') ||
            message.includes('503') ||
            message.includes('504')
        );
    }

    /**
     * Adiciona timeout à operação
     */
    private withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
        return Promise.race([
            promise,
            new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), timeout);
            })
        ]);
    }

    /**
     * Delay entre tentativas
     */
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Wrapper para operações do Supabase
     */
    async supabaseOperation<T>(
        operation: () => Promise<{ data: T; error: any }>,
        options: ApiClientOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.executeWithRetry(async () => {
            const result = await operation();

            if (result.error) {
                throw new Error(result.error.message || 'Supabase operation failed');
            }

            return result.data;
        }, options);
    }

    /**
     * Wrapper para operações de autenticação
     */
    async authOperation<T>(
        operation: () => Promise<{ data: T; error: any }>,
        options: ApiClientOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.executeWithRetry(async () => {
            const result = await operation();

            if (result.error) {
                throw new Error(result.error.message || 'Authentication failed');
            }

            return result.data;
        }, { ...options, feature: 'auth' });
    }

    /**
     * Wrapper para operações de upload
     */
    async uploadOperation<T>(
        operation: () => Promise<{ data: T; error: any }>,
        options: ApiClientOptions = {}
    ): Promise<ApiResponse<T>> {
        return this.executeWithRetry(async () => {
            const result = await operation();

            if (result.error) {
                throw new Error(result.error.message || 'Upload failed');
            }

            return result.data;
        }, { ...options, feature: 'upload' });
    }
}

// Instância singleton
export const apiClient = new ApiClient();

// Funções helper para uso fácil
export const withRetry = <T>(
    operation: () => Promise<T>,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> => {
    return apiClient.executeWithRetry(operation, options);
};

export const supabaseWithRetry = <T>(
    operation: () => Promise<{ data: T; error: any }>,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> => {
    return apiClient.supabaseOperation(operation, options);
};

export const authWithRetry = <T>(
    operation: () => Promise<{ data: T; error: any }>,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> => {
    return apiClient.authOperation(operation, options);
};

export const uploadWithRetry = <T>(
    operation: () => Promise<{ data: T; error: any }>,
    options?: ApiClientOptions
): Promise<ApiResponse<T>> => {
    return apiClient.uploadOperation(operation, options);
};

// Hook para React
export const useApiClient = () => {
    return {
        withRetry,
        supabaseWithRetry,
        authWithRetry,
        uploadWithRetry,
        apiClient
    };
};
