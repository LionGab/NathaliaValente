/**
 * ClubNath VIP - Centralized Error Handling System
 * Sistema centralizado de tratamento de erros para produção
 */

import { trackError, trackErrorSync } from './error-tracking';

export enum ErrorType {
    NETWORK = 'NETWORK',
    AUTH = 'AUTH',
    VALIDATION = 'VALIDATION',
    SERVER = 'SERVER',
    UNKNOWN = 'UNKNOWN'
}

export interface ErrorContext {
    userId?: string;
    sessionId?: string;
    feature?: string;
    action?: string;
    timestamp: number;
    userAgent?: string;
    url?: string;
}

export interface ErrorDetails {
    type: ErrorType;
    message: string;
    originalError?: Error;
    context: ErrorContext;
    retryable: boolean;
    userFriendlyMessage: string;
}

export class ErrorHandler {
    private static instance: ErrorHandler;
    private errorQueue: ErrorDetails[] = [];
    private maxQueueSize = 100;

    private constructor() { }

    static getInstance(): ErrorHandler {
        if (!ErrorHandler.instance) {
            ErrorHandler.instance = new ErrorHandler();
        }
        return ErrorHandler.instance;
    }

    /**
     * Classifica o tipo de erro baseado no erro original
     */
    private classifyError(error: Error): ErrorType {
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
            return ErrorType.NETWORK;
        }

        if (message.includes('auth') || message.includes('unauthorized') || message.includes('forbidden')) {
            return ErrorType.AUTH;
        }

        if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
            return ErrorType.VALIDATION;
        }

        if (message.includes('server') || message.includes('500') || message.includes('internal')) {
            return ErrorType.SERVER;
        }

        return ErrorType.UNKNOWN;
    }

    /**
     * Gera mensagem amigável para o usuário
     */
    private getUserFriendlyMessage(type: ErrorType, originalMessage: string): string {
        switch (type) {
            case ErrorType.NETWORK:
                return 'Problema de conexão. Verifique sua internet e tente novamente.';

            case ErrorType.AUTH:
                return 'Sessão expirada. Faça login novamente.';

            case ErrorType.VALIDATION:
                return 'Dados inválidos. Verifique as informações e tente novamente.';

            case ErrorType.SERVER:
                return 'Erro interno do servidor. Tente novamente em alguns minutos.';

            default:
                return 'Algo deu errado. Tente novamente.';
        }
    }

    /**
     * Verifica se o erro é recuperável
     */
    private isRetryable(type: ErrorType): boolean {
        return type === ErrorType.NETWORK || type === ErrorType.SERVER;
    }

    /**
     * Processa e registra um erro
     */
    handleError(
        error: Error,
        context: Partial<ErrorContext> = {},
        feature?: string
    ): ErrorDetails {
        const errorType = this.classifyError(error);
        const errorDetails: ErrorDetails = {
            type: errorType,
            message: error.message,
            originalError: error,
            context: {
                ...context,
                feature,
                timestamp: Date.now(),
                userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
            },
            retryable: this.isRetryable(errorType),
            userFriendlyMessage: this.getUserFriendlyMessage(errorType, error.message)
        };

        // Adiciona à fila de erros
        this.addToQueue(errorDetails);

        // Log no console em desenvolvimento
        if (import.meta.env.DEV) {
            console.error('ErrorHandler:', errorDetails);
        }

        // Envia para serviço de monitoramento em produção
        if (import.meta.env.PROD) {
            this.sendToMonitoring(errorDetails);
        }

        return errorDetails;
    }

    /**
     * Adiciona erro à fila
     */
    private addToQueue(error: ErrorDetails): void {
        this.errorQueue.push(error);

        // Remove erros antigos se a fila estiver cheia
        if (this.errorQueue.length > this.maxQueueSize) {
            this.errorQueue.shift();
        }
    }

    /**
     * Envia erro para serviço de monitoramento
     */
    private sendToMonitoring(error: ErrorDetails): void {
        // TODO: Integrar com Sentry ou LogRocket
        // Por enquanto, apenas log estruturado
        try {
            const errorData = {
                type: error.type,
                message: error.message,
                context: error.context,
                stack: error.originalError?.stack,
                timestamp: error.context.timestamp
            };

            // Enviar para serviço de rastreamento de erros
            if (typeof window !== 'undefined') {
                trackError({
                    message: error.message,
                    level: 'error',
                    timestamp: error.context.timestamp,
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                    context: error.type,
                    data: errorData,
                    stack: error.originalError?.stack
                });
            }
        } catch (monitoringError) {
            console.error('Failed to send error to monitoring:', monitoringError);
        }
    }

    /**
     * Retorna erros da fila
     */
    getErrors(): ErrorDetails[] {
        return [...this.errorQueue];
    }

    /**
     * Limpa a fila de erros
     */
    clearErrors(): void {
        this.errorQueue = [];
    }

    /**
     * Verifica se há erros recentes
     */
    hasRecentErrors(minutes: number = 5): boolean {
        const cutoff = Date.now() - (minutes * 60 * 1000);
        return this.errorQueue.some(error => error.context.timestamp > cutoff);
    }
}

// Instância singleton
export const errorHandler = ErrorHandler.getInstance();

// Função helper para uso fácil
export const handleError = (
    error: Error,
    context?: Partial<ErrorContext>,
    feature?: string
): ErrorDetails => {
    return errorHandler.handleError(error, context, feature);
};

// Hook para React
export const useErrorHandler = () => {
    return {
        handleError: (error: Error, context?: Partial<ErrorContext>, feature?: string) =>
            errorHandler.handleError(error, context, feature),
        getErrors: () => errorHandler.getErrors(),
        clearErrors: () => errorHandler.clearErrors(),
        hasRecentErrors: (minutes?: number) => errorHandler.hasRecentErrors(minutes)
    };
};
