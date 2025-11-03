/**
 * Types for multi-model AI integration
 * Supports: Claude Sonnet 4, Gemini 2.5 Flash, GPT-4, Perplexity
 */

export type AIModel = 'claude-sonnet-4' | 'gemini-2.5-flash' | 'gpt-4' | 'perplexity';

export type AICapability =
  | 'empathic-analysis'
  | 'contextual-analysis'
  | 'conversation'
  | 'medical-research';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface AIAnalysisResult {
  model: AIModel;
  sentiment: 'positive' | 'neutral' | 'negative' | 'concerning';
  emotionalState: {
    anxiety: number; // 0-10
    depression: number; // 0-10
    stress: number; // 0-10
    happiness: number; // 0-10
  };
  recommendations: string[];
  alerts?: {
    type: 'postpartum-depression' | 'high-anxiety' | 'severe-stress';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
  }[];
  analysis: string;
  confidence: number; // 0-1
}

export interface PostpartumDepressionScreening {
  score: number; // Edinburgh Postnatal Depression Scale (0-30)
  risk: 'low' | 'moderate' | 'high' | 'critical';
  answers: {
    question: string;
    answer: number;
  }[];
  recommendations: string[];
  needsProfessionalHelp: boolean;
}

export interface EmotionalPattern {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  averageMood: number; // 0-10
  trends: {
    date: string;
    mood: number;
    notes?: string;
  }[];
  insights: string[];
}

export interface AIRequest {
  model: AIModel;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  userId?: string;
  context?: {
    gestationalWeek?: number;
    isPostpartum?: boolean;
    previousHistory?: string[];
  };
}

export interface AIResponse {
  model: AIModel;
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  timestamp: Date;
}
