interface AIProvider {
  name: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

interface AIResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: string;
}

interface AIConfig {
  providers: AIProvider[];
  fallbackOrder: string[];
  timeout: number;
  retryAttempts: number;
}

class AIIntegrationService {
  private config: AIConfig;
  private isInitialized = false;

  constructor() {
    this.config = {
      providers: [
        {
          name: 'openai',
          apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-openai-key',
          baseUrl: 'https://api.openai.com/v1',
          model: 'gpt-4',
          maxTokens: 2000,
          temperature: 0.7,
        },
        {
          name: 'anthropic',
          apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || 'demo-anthropic-key',
          baseUrl: 'https://api.anthropic.com/v1',
          model: 'claude-3-sonnet-20240229',
          maxTokens: 2000,
          temperature: 0.7,
        },
        {
          name: 'gemini',
          apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'demo-gemini-key',
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
          model: 'gemini-pro',
          maxTokens: 2000,
          temperature: 0.7,
        },
        {
          name: 'perplexity',
          apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY || 'demo-perplexity-key',
          baseUrl: 'https://api.perplexity.ai',
          model: 'llama-3.1-sonar-small-128k-online',
          maxTokens: 2000,
          temperature: 0.7,
        },
      ],
      fallbackOrder: ['openai', 'anthropic', 'gemini', 'perplexity'],
      timeout: 30000,
      retryAttempts: 2,
    };
  }

  private async makeRequest(
    provider: AIProvider,
    prompt: string,
    context?: any
  ): Promise<AIResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      let response: Response;
      let requestBody: any;

      switch (provider.name) {
        case 'openai':
          requestBody = {
            model: provider.model,
            messages: [
              {
                role: 'system',
                content: this.getSystemPrompt(context),
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: provider.maxTokens,
            temperature: provider.temperature,
          };
          response = await fetch(`${provider.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${provider.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          });
          break;

        case 'anthropic':
          requestBody = {
            model: provider.model,
            max_tokens: provider.maxTokens,
            temperature: provider.temperature,
            messages: [
              {
                role: 'user',
                content: `${this.getSystemPrompt(context)}\n\n${prompt}`,
              },
            ],
          };
          response = await fetch(`${provider.baseUrl}/messages`, {
            method: 'POST',
            headers: {
              'x-api-key': provider.apiKey,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          });
          break;

        case 'gemini':
          requestBody = {
            contents: [
              {
                parts: [
                  {
                    text: `${this.getSystemPrompt(context)}\n\n${prompt}`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: provider.maxTokens,
              temperature: provider.temperature,
            },
          };
          response = await fetch(
            `${provider.baseUrl}/models/${provider.model}:generateContent?key=${provider.apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: controller.signal,
            }
          );
          break;

        case 'perplexity':
          requestBody = {
            model: provider.model,
            messages: [
              {
                role: 'system',
                content: this.getSystemPrompt(context),
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: provider.maxTokens,
            temperature: provider.temperature,
          };
          response = await fetch(`${provider.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${provider.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal,
          });
          break;

        default:
          throw new Error(`Unsupported provider: ${provider.name}`);
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseResponse(data, provider.name, provider.model);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private parseResponse(data: any, provider: string, model: string): AIResponse {
    switch (provider) {
      case 'openai':
        return {
          content: data.choices[0]?.message?.content || '',
          provider,
          model,
          usage: data.usage,
        };

      case 'anthropic':
        return {
          content: data.content[0]?.text || '',
          provider,
          model,
          usage: data.usage,
        };

      case 'gemini':
        return {
          content: data.candidates[0]?.content?.parts[0]?.text || '',
          provider,
          model,
        };

      case 'perplexity':
        return {
          content: data.choices[0]?.message?.content || '',
          provider,
          model,
          usage: data.usage,
        };

      default:
        return {
          content: '',
          provider,
          model,
          error: 'Unknown provider',
        };
    }
  }

  private getSystemPrompt(context?: any): string {
    const basePrompt = `Você é NathIA, a assistente virtual especializada em maternidade do app "Nossa Maternidade". 

Sua missão é apoiar, orientar e acolher mães em todas as fases da maternidade - desde a gravidez até os primeiros anos do bebê.

CARACTERÍSTICAS:
- Linguagem acolhedora, empática e maternal
- Conhecimento especializado em gravidez, parto, pós-parto e cuidados infantis
- Respostas práticas, seguras e baseadas em evidências
- Sempre incentivar consulta com profissionais de saúde quando necessário
- Foco no bem-estar emocional e físico da mãe

CONTEXTO DO USUÁRIO:`;

    if (context) {
      const contextInfo = [];
      if (context.gestationalWeek)
        contextInfo.push(`Semana gestacional: ${context.gestationalWeek}`);
      if (context.trimester) contextInfo.push(`Trimestre: ${context.trimester}`);
      if (context.babyAge) contextInfo.push(`Idade do bebê: ${context.babyAge}`);
      if (context.preferences) contextInfo.push(`Preferências: ${context.preferences}`);

      return `${basePrompt}\n${contextInfo.join('\n')}\n\nResponda de forma personalizada e acolhedora.`;
    }

    return basePrompt;
  }

  async generateResponse(
    prompt: string,
    context?: any,
    preferredProvider?: string
  ): Promise<AIResponse> {
    const providers = preferredProvider
      ? this.config.providers.filter((p) => p.name === preferredProvider)
      : this.config.providers;

    const fallbackProviders = preferredProvider
      ? [...this.config.fallbackOrder.filter((p) => p !== preferredProvider), preferredProvider]
      : this.config.fallbackOrder;

    let lastError: Error | null = null;

    for (const providerName of fallbackProviders) {
      const provider = providers.find((p) => p.name === providerName);
      if (!provider) continue;

      for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
        try {
          const response = await this.makeRequest(provider, prompt, context);
          if (response.content && !response.error) {
            return response;
          }
        } catch (error) {
          lastError = error as Error;
          console.warn(`Attempt ${attempt + 1} failed for ${provider.name}:`, error);

          if (attempt < this.config.retryAttempts - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
    }

    throw lastError || new Error('All AI providers failed');
  }

  // Métodos específicos para diferentes tipos de consultas
  async getPregnancyAdvice(week: number, question: string): Promise<AIResponse> {
    const context = {
      gestationalWeek: week,
      trimester: Math.ceil(week / 13),
      preferences: 'gravidez',
    };

    return this.generateResponse(question, context, 'anthropic');
  }

  async getPostpartumSupport(question: string, babyAge?: string): Promise<AIResponse> {
    const context = {
      babyAge,
      preferences: 'pós-parto',
    };

    return this.generateResponse(question, context, 'openai');
  }

  async searchWebForInfo(query: string): Promise<AIResponse> {
    const prompt = `Busque informações atualizadas sobre: ${query}. 
    Foque em fontes confiáveis de saúde materna e infantil. 
    Forneça informações práticas e seguras.`;

    return this.generateResponse(prompt, { preferences: 'pesquisa' }, 'perplexity');
  }

  async getEmotionalSupport(message: string, context?: any): Promise<AIResponse> {
    const prompt = `Uma mãe está compartilhando: "${message}". 
    Ofereça apoio emocional, validação e conselhos práticos. 
    Seja empática e acolhedora.`;

    return this.generateResponse(prompt, context, 'anthropic');
  }

  async getNutritionAdvice(question: string, context?: any): Promise<AIResponse> {
    const prompt = `Conselho nutricional para mãe: ${question}. 
    Foque em alimentação saudável durante gravidez/amamentação. 
    Sempre recomende consulta com nutricionista quando necessário.`;

    return this.generateResponse(prompt, context, 'gemini');
  }

  async getExerciseRecommendations(week: number, question: string): Promise<AIResponse> {
    const context = {
      gestationalWeek: week,
      trimester: Math.ceil(week / 13),
      preferences: 'exercícios',
    };

    const prompt = `Recomendações de exercícios seguros para gestante de ${week} semanas: ${question}. 
    Foque em segurança e benefícios.`;

    return this.generateResponse(prompt, context, 'openai');
  }

  async getSleepAdvice(question: string, babyAge?: string): Promise<AIResponse> {
    const context = {
      babyAge,
      preferences: 'sono',
    };

    const prompt = `Conselhos sobre sono: ${question}. 
    Inclua dicas para mãe e bebê.`;

    return this.generateResponse(prompt, context, 'anthropic');
  }

  // Método para análise de sentimento
  async analyzeMood(
    message: string
  ): Promise<{ mood: string; confidence: number; suggestions: string[] }> {
    const prompt = `Analise o estado emocional desta mensagem de uma mãe: "${message}". 
    Responda em JSON com: mood (positivo/neutro/negativo), confidence (0-1), suggestions (array de sugestões).`;

    try {
      const response = await this.generateResponse(prompt, {}, 'openai');
      const analysis = JSON.parse(response.content);
      return analysis;
    } catch (error) {
      console.error('Error analyzing mood:', error);
      return {
        mood: 'neutro',
        confidence: 0.5,
        suggestions: ['Considere conversar com um profissional de saúde mental'],
      };
    }
  }

  // Método para gerar resumos de conversas
  async generateConversationSummary(messages: string[]): Promise<AIResponse> {
    const prompt = `Resuma esta conversa com uma mãe, destacando pontos principais e próximos passos sugeridos:\n\n${messages.join('\n')}`;

    return this.generateResponse(prompt, {}, 'gemini');
  }
}

// Create singleton instance
export const aiIntegrationService = new AIIntegrationService();

export default aiIntegrationService;
