/**
 * Multi-Model AI Service
 * Integrates Claude Sonnet 4, Gemini 2.5 Flash, GPT-4, and Perplexity
 */

import type {
  AIRequest,
  AIResponse,
  AIAnalysisResult,
  PostpartumDepressionScreening,
} from './types';

/**
 * Main AI Service orchestrator
 * Routes requests to appropriate AI model based on capability
 */
export class AIService {
  private static instance: AIService;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Analyze emotional state using Claude Sonnet 4 (empathic analysis)
   */
  async analyzeEmotionalState(
    userInput: string,
    context?: {
      gestationalWeek?: number;
      isPostpartum?: boolean;
      previousHistory?: string[];
    }
  ): Promise<AIAnalysisResult> {
    const request: AIRequest = {
      model: 'claude-sonnet-4',
      messages: [
        {
          role: 'system',
          content: `Você é uma IA especializada em análise emocional e psicológica para mães e gestantes. 
          Analise o estado emocional com empatia, identificando sinais de:
          - Ansiedade
          - Depressão (incluindo depressão pós-parto)
          - Estresse
          - Bem-estar emocional
          
          Forneça recomendações práticas e empáticas. Se identificar sinais graves, alerte sobre a necessidade de ajuda profissional.`,
        },
        {
          role: 'user',
          content: `Contexto: ${context?.isPostpartum ? 'Período pós-parto' : context?.gestationalWeek ? `${context.gestationalWeek}ª semana de gestação` : 'Maternidade'}
          
Mensagem: ${userInput}`,
        },
      ],
      context,
    };

    return this.callAI(request);
  }

  /**
   * Get contextual analysis using Gemini 2.5 Flash
   */
  async getContextualAnalysis(
    userInput: string,
    context?: {
      gestationalWeek?: number;
      isPostpartum?: boolean;
    }
  ): Promise<AIResponse> {
    const request: AIRequest = {
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: `Você é NathAI, assistente especializada em maternidade. 
          Analise o contexto e forneça informações relevantes sobre:
          - Fase gestacional ou pós-parto
          - Padrões de comportamento
          - Necessidades específicas
          - Recomendações personalizadas`,
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      context,
    };

    return this.callAI(request);
  }

  /**
   * Conversational AI using GPT-4
   */
  async getConversationalResponse(
    userInput: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    context?: {
      gestationalWeek?: number;
      isPostpartum?: boolean;
    }
  ): Promise<AIResponse> {
    const request: AIRequest = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Você é uma assistente virtual especializada em maternidade, oferecendo:
          - Conversação natural e empática
          - Recomendações personalizadas
          - Suporte emocional
          - Informações práticas sobre maternidade`,
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: userInput,
        },
      ],
      context,
    };

    return this.callAI(request);
  }

  /**
   * Medical research using Perplexity
   */
  async getMedicalResearch(query: string): Promise<AIResponse> {
    const request: AIRequest = {
      model: 'perplexity',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente de pesquisa médica especializado em saúde materna e infantil.
          Forneça informações atualizadas com fontes confiáveis sobre:
          - Saúde gestacional
          - Cuidados pós-parto
          - Desenvolvimento infantil
          - Práticas baseadas em evidências
          
          Sempre cite as fontes das informações.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
    };

    return this.callAI(request);
  }

  /**
   * Postpartum depression screening (Edinburgh Scale)
   */
  async screenPostpartumDepression(answers: number[]): Promise<PostpartumDepressionScreening> {
    // Edinburgh Postnatal Depression Scale questions
    const questions = [
      'Consegui rir e ver o lado divertido das coisas',
      'Senti prazer ao pensar no futuro',
      'Culpei-me sem necessidade quando as coisas correram mal',
      'Senti-me ansiosa ou preocupada sem uma boa razão',
      'Senti medo ou pânico sem uma boa razão',
      'Senti que as coisas estavam me dominando',
      'Tive dificuldade para dormir mesmo quando o bebê estava dormindo',
      'Senti-me triste ou muito infeliz',
      'Chorei porque estava infeliz',
      'Tive pensamentos de fazer mal a mim mesma',
    ];

    const score = answers.reduce((sum, val) => sum + val, 0);
    const risk = score >= 13 ? 'critical' : score >= 10 ? 'high' : score >= 7 ? 'moderate' : 'low';
    const needsProfessionalHelp = score >= 10 || answers[9] > 0;

    const recommendations: string[] = [];
    if (risk === 'critical' || needsProfessionalHelp) {
      recommendations.push(
        'É muito importante que você procure ajuda profissional imediatamente.',
        'Entre em contato com seu médico ou serviço de saúde mental.',
        'Ligue 188 (CVV) se precisar conversar com alguém agora.'
      );
    } else if (risk === 'high') {
      recommendations.push(
        'Recomendamos fortemente que você consulte um profissional de saúde.',
        'Compartilhe seus sentimentos com pessoas de confiança.',
        'Priorize momentos de autocuidado e descanso.'
      );
    } else if (risk === 'moderate') {
      recommendations.push(
        'Mantenha contato com seu médico e comunique como está se sentindo.',
        'Busque apoio de familiares e amigos.',
        'Pratique atividades que lhe trazem bem-estar.'
      );
    } else {
      recommendations.push(
        'Continue cuidando de si mesma e mantendo uma rotina saudável.',
        'Não hesite em pedir ajuda quando necessário.',
        'Aproveite os momentos com seu bebê.'
      );
    }

    return {
      score,
      risk,
      answers: answers.map((answer, index) => ({
        question: questions[index],
        answer,
      })),
      recommendations,
      needsProfessionalHelp,
    };
  }

  /**
   * Call AI with request (mock implementation for now)
   * In production, this would call actual AI APIs
   */
  private async callAI(request: AIRequest): Promise<AIAnalysisResult | AIResponse> {
    // Mock implementation - simulates AI response
    // TODO: Implement actual API calls to Claude, Gemini, GPT-4, and Perplexity

    console.log(`[AI Service] Calling ${request.model}...`);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockAnalysis: AIAnalysisResult = {
      model: request.model,
      sentiment: 'neutral',
      emotionalState: {
        anxiety: 5,
        depression: 3,
        stress: 6,
        happiness: 7,
      },
      recommendations: [
        'Reserve momentos do dia para relaxar e fazer atividades que gosta',
        'Converse com pessoas de confiança sobre seus sentimentos',
        'Mantenha uma rotina de sono regular quando possível',
      ],
      analysis:
        'Com base na sua mensagem, percebo que você está navegando pelos desafios da maternidade com consciência. É natural sentir uma mistura de emoções nesse período.',
      confidence: 0.85,
    };

    if (request.model === 'claude-sonnet-4') {
      return mockAnalysis;
    }

    const mockResponse: AIResponse = {
      model: request.model,
      content:
        'Olá! Estou aqui para ajudar. Como posso apoiar você hoje no seu momento de maternidade?',
      timestamp: new Date(),
      usage: {
        promptTokens: 100,
        completionTokens: 50,
        totalTokens: 150,
      },
    };

    return mockResponse;
  }
}

export const aiService = AIService.getInstance();
