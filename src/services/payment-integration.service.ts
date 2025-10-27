/**
 * ClubNath VIP - Payment Integration Service
 * Integra com Stripe e PayPal para processamento de pagamentos
 */

import { apiConfig } from '../lib/api-config';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
  client_secret: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'pix';
  last4?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
}

export interface CreatePaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
  customerId?: string;
  paymentMethodId?: string;
}

export class PaymentIntegrationService {
  private config = apiConfig.getConfig();

  /**
   * Cria um Payment Intent no Stripe
   */
  async createStripePaymentIntent(data: CreatePaymentData): Promise<PaymentIntent> {
    const { publishableKey, secretKey } = this.config.payments.stripe;
    
    if (!secretKey) {
      throw new Error('Stripe secret key não configurada');
    }

    // Em produção, isso seria feito no backend
    // Aqui simulamos a criação do Payment Intent
    const response = await fetch('/api/payments/stripe/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100), // Stripe usa centavos
        currency: data.currency.toLowerCase(),
        description: data.description,
        metadata: data.metadata,
        customer: data.customerId,
        payment_method: data.paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status} ${response.statusText}`);
    }

    const paymentIntent = await response.json();
    
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Converter de centavos
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret,
    };
  }

  /**
   * Confirma um Payment Intent no Stripe
   */
  async confirmStripePayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    const { secretKey } = this.config.payments.stripe;
    
    if (!secretKey) {
      throw new Error('Stripe secret key não configurada');
    }

    const response = await fetch('/api/payments/stripe/confirm-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status} ${response.statusText}`);
    }

    const paymentIntent = await response.json();
    
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret,
    };
  }

  /**
   * Cria um pagamento no PayPal
   */
  async createPayPalPayment(data: CreatePaymentData): Promise<{ id: string; approval_url: string }> {
    const { clientId } = this.config.payments.paypal;
    
    if (!clientId) {
      throw new Error('PayPal client ID não configurado');
    }

    const response = await fetch('/api/payments/paypal/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        metadata: data.metadata,
        return_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      }),
    });

    if (!response.ok) {
      throw new Error(`PayPal API error: ${response.status} ${response.statusText}`);
    }

    const payment = await response.json();
    
    return {
      id: payment.id,
      approval_url: payment.links.find((link: any) => link.rel === 'approval_url')?.href || '',
    };
  }

  /**
   * Executa um pagamento no PayPal
   */
  async executePayPalPayment(paymentId: string, payerId: string): Promise<{ id: string; state: string }> {
    const response = await fetch('/api/payments/paypal/execute-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        payer_id: payerId,
      }),
    });

    if (!response.ok) {
      throw new Error(`PayPal API error: ${response.status} ${response.statusText}`);
    }

    const payment = await response.json();
    
    return {
      id: payment.id,
      state: payment.state,
    };
  }

  /**
   * Cria um pagamento PIX (Brasil)
   */
  async createPixPayment(data: CreatePaymentData): Promise<{ qr_code: string; copy_paste: string; expires_at: string }> {
    const response = await fetch('/api/payments/pix/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: data.amount,
        description: data.description,
        metadata: data.metadata,
      }),
    });

    if (!response.ok) {
      throw new Error(`PIX API error: ${response.status} ${response.statusText}`);
    }

    const pix = await response.json();
    
    return {
      qr_code: pix.qr_code,
      copy_paste: pix.copy_paste,
      expires_at: pix.expires_at,
    };
  }

  /**
   * Obtém métodos de pagamento salvos do usuário
   */
  async getSavedPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    const { secretKey } = this.config.payments.stripe;
    
    if (!secretKey) {
      throw new Error('Stripe secret key não configurada');
    }

    const response = await fetch(`/api/payments/stripe/payment-methods?customer=${customerId}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.data.map((pm: any) => ({
      id: pm.id,
      type: pm.type,
      last4: pm.card?.last4,
      brand: pm.card?.brand,
      exp_month: pm.card?.exp_month,
      exp_year: pm.card?.exp_year,
    }));
  }

  /**
   * Salva um método de pagamento
   */
  async savePaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod> {
    const { secretKey } = this.config.payments.stripe;
    
    if (!secretKey) {
      throw new Error('Stripe secret key não configurada');
    }

    const response = await fetch('/api/payments/stripe/attach-payment-method', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
        customer_id: customerId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status} ${response.statusText}`);
    }

    const pm = await response.json();
    
    return {
      id: pm.id,
      type: pm.type,
      last4: pm.card?.last4,
      brand: pm.card?.brand,
      exp_month: pm.card?.exp_month,
      exp_year: pm.card?.exp_year,
    };
  }

  /**
   * Remove um método de pagamento salvo
   */
  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    const { secretKey } = this.config.payments.stripe;
    
    if (!secretKey) {
      throw new Error('Stripe secret key não configurada');
    }

    const response = await fetch(`/api/payments/stripe/detach-payment-method`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        payment_method_id: paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe API error: ${response.status} ${response.statusText}`);
    }
  }

  /**
   * Obtém o status de um pagamento
   */
  async getPaymentStatus(paymentId: string, provider: 'stripe' | 'paypal' | 'pix'): Promise<{ status: string; amount?: number; currency?: string }> {
    const response = await fetch(`/api/payments/${provider}/status/${paymentId}`);
    
    if (!response.ok) {
      throw new Error(`${provider} API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Processa um reembolso
   */
  async processRefund(paymentId: string, amount?: number, reason?: string): Promise<{ id: string; status: string; amount: number }> {
    const response = await fetch('/api/payments/refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        amount,
        reason,
      }),
    });

    if (!response.ok) {
      throw new Error(`Refund API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Verifica se os sistemas de pagamento estão configurados
   */
  isPaymentConfigured(): boolean {
    return apiConfig.isAPIConfigured('payments');
  }

  /**
   * Obtém informações sobre os sistemas de pagamento configurados
   */
  getPaymentConfigInfo() {
    const { payments } = this.config;
    return {
      stripe: {
        configured: !!payments.stripe.publishableKey,
        publishableKey: payments.stripe.publishableKey,
      },
      paypal: {
        configured: !!payments.paypal.clientId,
        clientId: payments.paypal.clientId,
      },
    };
  }

  /**
   * Formata valor para exibição
   */
  formatCurrency(amount: number, currency: string = 'BRL'): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Valida dados de pagamento
   */
  validatePaymentData(data: CreatePaymentData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.amount || data.amount <= 0) {
      errors.push('Valor deve ser maior que zero');
    }

    if (!data.currency) {
      errors.push('Moeda é obrigatória');
    }

    if (!data.description) {
      errors.push('Descrição é obrigatória');
    }

    if (data.amount > 10000) {
      errors.push('Valor muito alto para pagamento online');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Instância singleton
export const paymentService = new PaymentIntegrationService();
