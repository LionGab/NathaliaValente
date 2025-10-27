/**
 * ClubNath VIP - Error Tracking Service
 * 
 * Serviço centralizado para rastreamento de erros
 * com integração a serviços externos.
 */

export interface ErrorTrackingData {
  message: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  timestamp: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  data?: any;
  context?: string;
  stack?: string;
}

export interface ErrorTrackingConfig {
  enabled: boolean;
  endpoint?: string;
  batchSize: number;
  flushInterval: number;
  maxRetries: number;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private config: ErrorTrackingConfig;
  private errorQueue: ErrorTrackingData[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isOnline = true;

  private constructor() {
    this.config = {
      enabled: import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true',
      endpoint: '/api/errors', // Será implementado no futuro
      batchSize: 10,
      flushInterval: 5000, // 5 segundos
      maxRetries: 3
    };

    this.setupEventListeners();
    this.startFlushTimer();
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Monitorar status de conexão
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrors();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Capturar erros não tratados
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.message,
        level: 'error',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        stack: event.error?.stack,
        context: 'unhandled_error'
      });
    });

    // Capturar promises rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        level: 'error',
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        stack: event.reason?.stack,
        context: 'unhandled_promise_rejection',
        data: { reason: event.reason }
      });
    });
  }

  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flushErrors();
    }, this.config.flushInterval);
  }

  /**
   * Rastreia um erro
   */
  public trackError(errorData: ErrorTrackingData): void {
    if (!this.config.enabled) {
      console.log('Error tracking disabled:', errorData);
      return;
    }

    // Adicionar metadados adicionais
    const enrichedError: ErrorTrackingData = {
      ...errorData,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: errorData.timestamp || new Date().toISOString()
    };

    this.errorQueue.push(enrichedError);

    // Se a fila atingir o tamanho máximo, enviar imediatamente
    if (this.errorQueue.length >= this.config.batchSize) {
      this.flushErrors();
    }

    // Log local para desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Error tracked:', enrichedError);
    }
  }

  /**
   * Rastreia um erro de forma síncrona (para erros críticos)
   */
  public trackErrorSync(errorData: ErrorTrackingData): void {
    if (!this.config.enabled) return;

    const enrichedError: ErrorTrackingData = {
      ...errorData,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      timestamp: errorData.timestamp || new Date().toISOString()
    };

    // Enviar imediatamente usando sendBeacon
    this.sendErrorSync(enrichedError);
  }

  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0 || !this.isOnline) return;

    const errorsToSend = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await this.sendErrors(errorsToSend);
    } catch (error) {
      // Recolocar erros na fila se falhar
      this.errorQueue.unshift(...errorsToSend);
      console.error('Failed to send errors:', error);
    }
  }

  private async sendErrors(errors: ErrorTrackingData[]): Promise<void> {
    if (!this.config.endpoint) {
      // Se não há endpoint configurado, apenas log
      console.log('Error tracking endpoint not configured. Errors:', errors);
      return;
    }

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          errors,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      throw error;
    }
  }

  private sendErrorSync(error: ErrorTrackingData): void {
    if (!this.config.endpoint || !navigator.sendBeacon) return;

    try {
      const success = navigator.sendBeacon(
        this.config.endpoint,
        JSON.stringify({
          errors: [error],
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      );

      if (!success) {
        console.error('Failed to send error via sendBeacon');
      }
    } catch (error) {
      console.error('Error in sendBeacon:', error);
    }
  }

  private getUserId(): string | undefined {
    // Implementar lógica para obter ID do usuário
    // Por enquanto, retornar undefined
    return undefined;
  }

  private getSessionId(): string {
    // Gerar ou recuperar session ID
    let sessionId = sessionStorage.getItem('clubnath_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('clubnath_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Força o envio de todos os erros pendentes
   */
  public forceFlush(): void {
    this.flushErrors();
  }

  /**
   * Limpa a fila de erros
   */
  public clearQueue(): void {
    this.errorQueue = [];
  }

  /**
   * Obtém estatísticas de erros
   */
  public getStats(): { queueLength: number; isOnline: boolean; enabled: boolean } {
    return {
      queueLength: this.errorQueue.length,
      isOnline: this.isOnline,
      enabled: this.config.enabled
    };
  }

  /**
   * Atualiza configuração
   */
  public updateConfig(newConfig: Partial<ErrorTrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.startFlushTimer();
  }

  /**
   * Destrói a instância (limpeza)
   */
  public destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.forceFlush();
  }
}

// Instância singleton
export const errorTracking = ErrorTrackingService.getInstance();

// Funções utilitárias
export const trackError = (errorData: ErrorTrackingData) => {
  errorTracking.trackError(errorData);
};

export const trackErrorSync = (errorData: ErrorTrackingData) => {
  errorTracking.trackErrorSync(errorData);
};

export const trackWarning = (message: string, context?: string, data?: any) => {
  errorTracking.trackError({
    message,
    level: 'warning',
    timestamp: new Date().toISOString(),
    context,
    data
  });
};

export const trackInfo = (message: string, context?: string, data?: any) => {
  errorTracking.trackError({
    message,
    level: 'info',
    timestamp: new Date().toISOString(),
    context,
    data
  });
};

// Auto-inicialização
if (typeof window !== 'undefined') {
  // Garantir que o serviço seja inicializado
  errorTracking;
}
