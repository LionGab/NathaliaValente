import { useState, useCallback } from 'react';
import { aiIntegrationService, AIResponse } from '../services/ai-integration.service';

interface AIState {
    isLoading: boolean;
    error: string | null;
    lastResponse: AIResponse | null;
}

interface AIHooks {
    // State
    isLoading: boolean;
    error: string | null;
    lastResponse: AIResponse | null;

    // Actions
    askQuestion: (question: string, context?: any) => Promise<AIResponse | null>;
    getPregnancyAdvice: (week: number, question: string) => Promise<AIResponse | null>;
    getPostpartumSupport: (question: string, babyAge?: string) => Promise<AIResponse | null>;
    searchWebForInfo: (query: string) => Promise<AIResponse | null>;
    getEmotionalSupport: (message: string, context?: any) => Promise<AIResponse | null>;
    getNutritionAdvice: (question: string, context?: any) => Promise<AIResponse | null>;
    getExerciseRecommendations: (week: number, question: string) => Promise<AIResponse | null>;
    getSleepAdvice: (question: string, babyAge?: string) => Promise<AIResponse | null>;
    analyzeMood: (message: string) => Promise<{ mood: string; confidence: number; suggestions: string[] } | null>;
    generateConversationSummary: (messages: string[]) => Promise<AIResponse | null>;

    // Utilities
    clearError: () => void;
    clearResponse: () => void;
}

export const useAI = (): AIHooks => {
    const [state, setState] = useState<AIState>({
        isLoading: false,
        error: null,
        lastResponse: null
    });

    const setLoading = useCallback((loading: boolean) => {
        setState(prev => ({ ...prev, isLoading: loading }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    const setResponse = useCallback((response: AIResponse | null) => {
        setState(prev => ({ ...prev, lastResponse: response }));
    }, []);

    const executeAIRequest = useCallback(async (
        requestFn: () => Promise<AIResponse>
    ): Promise<AIResponse | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await requestFn();
            setResponse(response);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setError(errorMessage);
            console.error('AI request failed:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError, setResponse]);

    const askQuestion = useCallback(async (
        question: string,
        context?: any
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.generateResponse(question, context)
        );
    }, [executeAIRequest]);

    const getPregnancyAdvice = useCallback(async (
        week: number,
        question: string
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.getPregnancyAdvice(week, question)
        );
    }, [executeAIRequest]);

    const getPostpartumSupport = useCallback(async (
        question: string,
        babyAge?: string
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.getPostpartumSupport(question, babyAge)
        );
    }, [executeAIRequest]);

    const searchWebForInfo = useCallback(async (
        query: string
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.searchWebForInfo(query)
        );
    }, [executeAIRequest]);

    const getEmotionalSupport = useCallback(async (
        message: string,
        context?: any
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.getEmotionalSupport(message, context)
        );
    }, [executeAIRequest]);

    const getNutritionAdvice = useCallback(async (
        question: string,
        context?: any
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.getNutritionAdvice(question, context)
        );
    }, [executeAIRequest]);

    const getExerciseRecommendations = useCallback(async (
        week: number,
        question: string
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.getExerciseRecommendations(week, question)
        );
    }, [executeAIRequest]);

    const getSleepAdvice = useCallback(async (
        question: string,
        babyAge?: string
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.getSleepAdvice(question, babyAge)
        );
    }, [executeAIRequest]);

    const analyzeMood = useCallback(async (
        message: string
    ): Promise<{ mood: string; confidence: number; suggestions: string[] } | null> => {
        setLoading(true);
        setError(null);

        try {
            const analysis = await aiIntegrationService.analyzeMood(message);
            return analysis;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro na análise de humor';
            setError(errorMessage);
            console.error('Mood analysis failed:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const generateConversationSummary = useCallback(async (
        messages: string[]
    ): Promise<AIResponse | null> => {
        return executeAIRequest(() =>
            aiIntegrationService.generateConversationSummary(messages)
        );
    }, [executeAIRequest]);

    const clearError = useCallback(() => {
        setError(null);
    }, [setError]);

    const clearResponse = useCallback(() => {
        setResponse(null);
    }, [setResponse]);

    return {
        // State
        isLoading: state.isLoading,
        error: state.error,
        lastResponse: state.lastResponse,

        // Actions
        askQuestion,
        getPregnancyAdvice,
        getPostpartumSupport,
        searchWebForInfo,
        getEmotionalSupport,
        getNutritionAdvice,
        getExerciseRecommendations,
        getSleepAdvice,
        analyzeMood,
        generateConversationSummary,

        // Utilities
        clearError,
        clearResponse
    };
};

// Hook específico para NathIA (Chat)
export const useNathIA = () => {
    const ai = useAI();
    const [conversationHistory, setConversationHistory] = useState<string[]>([]);
    const [moodAnalysis, setMoodAnalysis] = useState<{
        mood: string;
        confidence: number;
        suggestions: string[];
    } | null>(null);

    const sendMessage = useCallback(async (
        message: string,
        context?: any
    ): Promise<string> => {
        // Adicionar mensagem ao histórico
        setConversationHistory(prev => [...prev, message]);

        // Analisar humor da mensagem
        const mood = await ai.analyzeMood(message);
        if (mood) {
            setMoodAnalysis(mood);
        }

        // Obter resposta da IA
        const response = await ai.getEmotionalSupport(message, context);

        if (response && response.content) {
            // Adicionar resposta ao histórico
            setConversationHistory(prev => [...prev, response.content]);
            return response.content;
        }

        return 'Desculpe, não consegui processar sua mensagem no momento. Tente novamente.';
    }, [ai]);

    const clearConversation = useCallback(() => {
        setConversationHistory([]);
        setMoodAnalysis(null);
        ai.clearResponse();
    }, [ai]);

    const generateSummary = useCallback(async () => {
        if (conversationHistory.length === 0) return null;

        return ai.generateConversationSummary(conversationHistory);
    }, [ai, conversationHistory]);

    return {
        ...ai,
        conversationHistory,
        moodAnalysis,
        sendMessage,
        clearConversation,
        generateSummary
    };
};

// Hook para recomendações personalizadas
export const usePersonalizedRecommendations = () => {
    const ai = useAI();
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateRecommendations = useCallback(async (
        userContext: {
            gestationalWeek?: number;
            babyAge?: string;
            interests?: string[];
            concerns?: string[];
        }
    ) => {
        setIsGenerating(true);

        try {
            const prompt = `Com base no perfil da usuária:
      - Semana gestacional: ${userContext.gestationalWeek || 'N/A'}
      - Idade do bebê: ${userContext.babyAge || 'N/A'}
      - Interesses: ${userContext.interests?.join(', ') || 'N/A'}
      - Preocupações: ${userContext.concerns?.join(', ') || 'N/A'}
      
      Gere 5 recomendações personalizadas de conteúdo, atividades ou recursos que seriam úteis para esta mãe.`;

            const response = await ai.askQuestion(prompt, userContext);

            if (response && response.content) {
                // Extrair recomendações do texto (assumindo que são listadas)
                const lines = response.content.split('\n').filter(line =>
                    line.trim() && (line.includes('•') || line.includes('-') || line.includes('1.') || line.includes('2.'))
                );
                setRecommendations(lines);
            }
        } catch (error) {
            console.error('Error generating recommendations:', error);
        } finally {
            setIsGenerating(false);
        }
    }, [ai]);

    const clearRecommendations = useCallback(() => {
        setRecommendations([]);
    }, []);

    return {
        recommendations,
        isGenerating,
        generateRecommendations,
        clearRecommendations
    };
};