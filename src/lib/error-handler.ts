/**
 * Nossa Maternidade - Sistema de Tratamento de Erros
 * Tratamento centralizado e robusto de erros
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  context?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Trata erros de autenticação
   */
  handleAuthError(error: any): AppError {
    const authError: AppError = {
      code: 'AUTH_ERROR',
      message: 'Erro de autenticação',
      details: error,
      timestamp: new Date(),
      context: 'authentication'
    };

    // Mapear erros específicos do Supabase
    if (error?.message?.includes('Invalid login credentials')) {
      authError.code = 'INVALID_CREDENTIALS';
      authError.message = 'Email ou senha incorretos';
    } else if (error?.message?.includes('Email not confirmed')) {
      authError.code = 'EMAIL_NOT_CONFIRMED';
      authError.message = 'Email não confirmado. Verifique sua caixa de entrada.';
    } else if (error?.message?.includes('Too many requests')) {
      authError.code = 'RATE_LIMIT_EXCEEDED';
      authError.message = 'Muitas tentativas. Tente novamente em alguns minutos.';
    } else if (error?.message?.includes('User not found')) {
      authError.code = 'USER_NOT_FOUND';
      authError.message = 'Usuário não encontrado';
    }

    this.logError(authError);
    return authError;
  }

  /**
   * Trata erros de rede
   */
  handleNetworkError(error: any): AppError {
    const networkError: AppError = {
      code: 'NETWORK_ERROR',
      message: 'Erro de conexão',
      details: error,
      timestamp: new Date(),
      context: 'network'
    };

    if (error?.message?.includes('timeout')) {
      networkError.code = 'TIMEOUT';
      networkError.message = 'Tempo limite esgotado. Verifique sua conexão.';
    } else if (error?.message?.includes('Failed to fetch')) {
      networkError.code = 'FETCH_ERROR';
      networkError.message = 'Erro ao conectar com o servidor.';
    } else if (error?.message?.includes('Network error')) {
      networkError.code = 'NETWORK_UNAVAILABLE';
      networkError.message = 'Sem conexão com a internet.';
    }

    this.logError(networkError);
    return networkError;
  }

  /**
   * Trata erros de validação
   */
  handleValidationError(error: any, field?: string): AppError {
    const validationError: AppError = {
      code: 'VALIDATION_ERROR',
      message: 'Erro de validação',
      details: error,
      timestamp: new Date(),
      context: 'validation'
    };

    if (field) {
      validationError.message = `Erro de validação no campo: ${field}`;
    }

    this.logError(validationError);
    return validationError;
  }

  /**
   * Trata erros de permissão
   */
  handlePermissionError(error: any): AppError {
    const permissionError: AppError = {
      code: 'PERMISSION_ERROR',
      message: 'Permissão insuficiente',
      details: error,
      timestamp: new Date(),
      context: 'permission'
    };

    this.logError(permissionError);
    return permissionError;
  }

  /**
   * Trata erros de API
   */
  handleAPIError(error: any, endpoint?: string): AppError {
    const apiError: AppError = {
      code: 'API_ERROR',
      message: 'Erro na API',
      details: error,
      timestamp: new Date(),
      context: 'api'
    };

    if (endpoint) {
      apiError.message = `Erro na API: ${endpoint}`;
    }

    if (error?.status === 404) {
      apiError.code = 'NOT_FOUND';
      apiError.message = 'Recurso não encontrado';
    } else if (error?.status === 403) {
      apiError.code = 'FORBIDDEN';
      apiError.message = 'Acesso negado';
    } else if (error?.status === 500) {
      apiError.code = 'SERVER_ERROR';
      apiError.message = 'Erro interno do servidor';
    }

    this.logError(apiError);
    return apiError;
  }

  /**
   * Trata erros genéricos
   */
  handleGenericError(error: any, context?: string): AppError {
    const genericError: AppError = {
      code: 'GENERIC_ERROR',
      message: 'Ocorreu um erro inesperado',
      details: error,
      timestamp: new Date(),
      context: context || 'unknown'
    };

    this.logError(genericError);
    return genericError;
  }

  /**
   * Log de erro
   */
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Manter apenas os últimos 100 erros
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log no console em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Error logged:', error);
    }

    // Enviar para serviço de monitoramento em produção
    if (import.meta.env.PROD) {
      this.sendToMonitoring(error);
    }
  }

  /**
   * Envia erro para serviço de monitoramento
   */
  private async sendToMonitoring(error: AppError): Promise<void> {
    try {
      // Aqui você pode integrar com Sentry, LogRocket, etc.
      console.log('Sending error to monitoring service:', error);
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }

  /**
   * Obtém erros recentes
   */
  getRecentErrors(limit: number = 10): AppError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Limpa log de erros
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Obtém estatísticas de erros
   */
  getErrorStats(): { total: number; byCode: Record<string, number>; byContext: Record<string, number> } {
    const stats = {
      total: this.errorLog.length,
      byCode: {} as Record<string, number>,
      byContext: {} as Record<string, number>
    };

    this.errorLog.forEach(error => {
      stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;
      stats.byContext[error.context || 'unknown'] = (stats.byContext[error.context || 'unknown'] || 0) + 1;
    });

    return stats;
  }
}

// Instância singleton
export const errorHandler = ErrorHandler.getInstance();

// Funções utilitárias
export const handleError = (error: any, context?: string): AppError => {
  if (error?.message?.includes('auth') || error?.message?.includes('login')) {
    return errorHandler.handleAuthError(error);
  }
  
  if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
    return errorHandler.handleNetworkError(error);
  }
  
  if (error?.message?.includes('validation') || error?.message?.includes('invalid')) {
    return errorHandler.handleValidationError(error);
  }
  
  if (error?.message?.includes('permission') || error?.message?.includes('forbidden')) {
    return errorHandler.handlePermissionError(error);
  }
  
  if (error?.status || error?.response) {
    return errorHandler.handleAPIError(error);
  }
  
  return errorHandler.handleGenericError(error, context);
};

export const showErrorToast = (error: AppError): void => {
  // Aqui você pode integrar com seu sistema de toast/notificação
  console.error('Error toast:', error.message);
};

export const logError = (error: any, context?: string): void => {
  const appError = handleError(error, context);
  showErrorToast(appError);
};
