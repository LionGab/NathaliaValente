/**
 * ClubNath VIP - AI Integration Service
 * Integra com múltiplas APIs de IA (OpenAI, Claude, Perplexity, Gemini)
 */

import { apiConfig } from '../lib/api-config';

export interface AIResponse {
  content: string;
  model: string;
  provider: string;
  tokensUsed?: number;
  cost?: number;
}

export interface AIRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  context?: string;
}

export class AIIntegrationService {
  private config = apiConfig.getConfig();

  /**
   * Envia uma requisição para a API de IA primária configurada
   */
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    const primaryAI = this.config.ai.primary;
    
    switch (primaryAI) {
      case 'openai':
        return this.callOpenAI(request);
      case 'claude':
        return this.callClaude(request);
      case 'perplexity':
        return this.callPerplexity(request);
      case 'gemini':
        return this.callGemini(request);
      default:
        throw new Error(`API de IA não suportada: ${primaryAI}`);
    }
  }

  /**
   * Chama a API do OpenAI
   */
  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    const { apiKey, model } = this.config.ai.openai;
    
    if (!apiKey) {
      throw new Error('OpenAI API key não configurada');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          ...(request.context ? [{ role: 'user', content: request.context }] : []),
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.maxTokens || this.config.ai.maxTokens,
        temperature: request.temperature || this.config.ai.temperature,
        top_p: this.config.ai.topP,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'openai',
      tokensUsed: data.usage?.total_tokens,
    };
  }

  /**
   * Chama a API do Claude (Anthropic)
   */
  private async callClaude(request: AIRequest): Promise<AIResponse> {
    const { apiKey, model } = this.config.ai.claude;
    
    if (!apiKey) {
      throw new Error('Claude API key não configurada');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: request.maxTokens || this.config.ai.maxTokens,
        temperature: request.temperature || this.config.ai.temperature,
        messages: [
          ...(request.systemPrompt ? [{ role: 'user', content: request.systemPrompt }] : []),
          ...(request.context ? [{ role: 'user', content: request.context }] : []),
          { role: 'user', content: request.prompt }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0].text,
      model: data.model,
      provider: 'claude',
      tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens,
    };
  }

  /**
   * Chama a API do Perplexity
   */
  private async callPerplexity(request: AIRequest): Promise<AIResponse> {
    const { apiKey, model } = this.config.ai.perplexity;
    
    if (!apiKey) {
      throw new Error('Perplexity API key não configurada');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          ...(request.context ? [{ role: 'user', content: request.context }] : []),
          { role: 'user', content: request.prompt }
        ],
        max_tokens: request.maxTokens || this.config.ai.maxTokens,
        temperature: request.temperature || this.config.ai.temperature,
        top_p: this.config.ai.topP,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0].message.content,
      model: data.model,
      provider: 'perplexity',
      tokensUsed: data.usage?.total_tokens,
    };
  }

  /**
   * Chama a API do Gemini (Google)
   */
  private async callGemini(request: AIRequest): Promise<AIResponse> {
    const { apiKey, model } = this.config.ai.gemini;
    
    if (!apiKey) {
      throw new Error('Gemini API key não configurada');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${request.systemPrompt ? request.systemPrompt + '\n\n' : ''}${request.context ? request.context + '\n\n' : ''}${request.prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: request.maxTokens || this.config.ai.maxTokens,
          temperature: request.temperature || this.config.ai.temperature,
          topP: this.config.ai.topP,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates[0].content.parts[0].text,
      model: data.model || model,
      provider: 'gemini',
      tokensUsed: data.usageMetadata?.totalTokenCount,
    };
  }

  /**
   * Gera uma resposta específica para mães (NathIA)
   */
  async generateNathIAResponse(prompt: string, context?: string): Promise<AIResponse> {
    const systemPrompt = `Você é NathIA, a assistente virtual do ClubNath VIP, uma comunidade exclusiva de mães seguidoras da Nathália Valente. 

Sua personalidade:
- Acolhedora e maternal
- Conhece profundamente sobre maternidade, gravidez, pós-parto e cuidados com bebês
- Sempre positiva e encorajadora
- Fala de forma carinhosa e próxima
- Conhece os produtos NAVA (bikinis) e OLLIN (saúde materna)
- Respeita a fé cristã das mães
- Oferece dicas práticas e realistas

Sempre responda de forma:
- Carinhosa e acolhedora
- Prática e útil
- Respeitosa com a jornada única de cada mãe
- Encorajadora e positiva`;

    return this.generateResponse({
      prompt,
      systemPrompt,
      context,
      maxTokens: 500,
      temperature: 0.8,
    });
  }

  /**
   * Gera sugestões de produtos baseadas no perfil da mãe
   */
  async generateProductSuggestions(profile: {
    stage: 'gravidez' | 'pos-parto' | 'maternidade';
    interests: string[];
    needs: string[];
  }): Promise<AIResponse> {
    const prompt = `Com base no perfil da mãe:
- Estágio: ${profile.stage}
- Interesses: ${profile.interests.join(', ')}
- Necessidades: ${profile.needs.join(', ')}

Sugira produtos NAVA (bikinis) e OLLIN (saúde materna) que seriam úteis para ela. Seja específica e explique por que cada produto seria benéfico.`;

    return this.generateNathIAResponse(prompt);
  }

  /**
   * Gera dicas personalizadas de maternidade
   */
  async generateMaternityTips(topic: string, stage?: string): Promise<AIResponse> {
    const prompt = `Forneça dicas práticas e úteis sobre ${topic}${stage ? ` para mães em ${stage}` : ''}. 
    Seja específica, prática e encorajadora. Inclua dicas que realmente funcionam no dia a dia.`;

    return this.generateNathIAResponse(prompt);
  }

  /**
   * Verifica se as APIs de IA estão configuradas
   */
  isAIConfigured(): boolean {
    return apiConfig.isAPIConfigured('ai');
  }

  /**
   * Obtém informações sobre as APIs configuradas
   */
  getAIConfigInfo() {
    const { ai } = this.config;
    return {
      primary: ai.primary,
      configured: {
        openai: !!ai.openai.apiKey,
        claude: !!ai.claude.apiKey,
        perplexity: !!ai.perplexity.apiKey,
        gemini: !!ai.gemini.apiKey,
      },
      settings: {
        maxTokens: ai.maxTokens,
        temperature: ai.temperature,
        topP: ai.topP,
      },
    };
  }
}

// Instância singleton
export const aiService = new AIIntegrationService();
