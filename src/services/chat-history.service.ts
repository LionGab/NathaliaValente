// =====================================================
// CLUBNATH CHAT HISTORY - SERVIÇO COMPLETO
// NathIA Inteligente com Memória Persistente
// =====================================================

import { supabase } from '../lib/supabase';
import type {
  ChatMessage,
  ChatSummary,
  MemoryPreferences,
  ChatContext,
  ChatHistoryFilters,
  CreateChatMessageData,
  CreateChatSummaryData,
  UpdateMemoryPreferencesData,
  NathIAPrompt,
  NathIAResponse,
  ChatHistoryService
} from '../types/chat-history';
import { 
  NATHIA_PERSONALITY, 
  DEFAULT_MEMORY_PREFERENCES,
  buildContextSummary,
  generateGreeting,
  getTopicsFromMessages,
  getMoodIndicators
} from '../types/chat-history';

// =====================================================
// SERVIÇO PRINCIPAL DE CHAT HISTORY
// =====================================================

export const chatHistoryService: ChatHistoryService = {
  // =====================================================
  // MENSAGENS
  // =====================================================
  
  async getChatHistory(filters: ChatHistoryFilters): Promise<ChatMessage[]> {
    const {
      user_id,
      session_id,
      sender,
      limit = 50,
      offset = 0,
      start_date,
      end_date
    } = filters;

    let queryBuilder = supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtros opcionais
    if (session_id) {
      queryBuilder = queryBuilder.eq('session_id', session_id);
    }
    
    if (sender) {
      queryBuilder = queryBuilder.eq('sender', sender);
    }
    
    if (start_date) {
      queryBuilder = queryBuilder.gte('created_at', start_date);
    }
    
    if (end_date) {
      queryBuilder = queryBuilder.lte('created_at', end_date);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching chat history:', error);
      throw new Error('Erro ao buscar histórico de conversas');
    }

    return data || [];
  },

  async createChatMessage(data: CreateChatMessageData): Promise<ChatMessage> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: message, error } = await supabase
      .from('chat_history')
      .insert({
        ...data,
        user_id: user.user.id,
        session_id: data.session_id || crypto.randomUUID()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating chat message:', error);
      throw new Error('Erro ao criar mensagem');
    }

    return message;
  },

  async updateChatMessage(id: string, data: Partial<CreateChatMessageData>): Promise<ChatMessage> {
    const { data: message, error } = await supabase
      .from('chat_history')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating chat message:', error);
      throw new Error('Erro ao atualizar mensagem');
    }

    return message;
  },

  async deleteChatMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting chat message:', error);
      throw new Error('Erro ao deletar mensagem');
    }
  },

  async clearChatHistory(userId: string, sessionId?: string): Promise<void> {
    let queryBuilder = supabase
      .from('chat_history')
      .delete()
      .eq('user_id', userId);

    if (sessionId) {
      queryBuilder = queryBuilder.eq('session_id', sessionId);
    }

    const { error } = await queryBuilder;

    if (error) {
      console.error('Error clearing chat history:', error);
      throw new Error('Erro ao limpar histórico');
    }
  },

  // =====================================================
  // RESUMOS
  // =====================================================

  async getChatSummaries(userId: string, limit = 10): Promise<ChatSummary[]> {
    const { data, error } = await supabase
      .from('chat_summaries')
      .select('*')
      .eq('user_id', userId)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching chat summaries:', error);
      throw new Error('Erro ao buscar resumos');
    }

    return data || [];
  },

  async createChatSummary(data: CreateChatSummaryData): Promise<ChatSummary> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('Usuário não autenticado');

    const { data: summary, error } = await supabase
      .from('chat_summaries')
      .insert({
        ...data,
        user_id: user.user.id
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating chat summary:', error);
      throw new Error('Erro ao criar resumo');
    }

    return summary;
  },

  async updateChatSummary(id: string, data: Partial<CreateChatSummaryData>): Promise<ChatSummary> {
    const { data: summary, error } = await supabase
      .from('chat_summaries')
      .update(data)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating chat summary:', error);
      throw new Error('Erro ao atualizar resumo');
    }

    return summary;
  },

  async deleteChatSummary(id: string): Promise<void> {
    const { error } = await supabase
      .from('chat_summaries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting chat summary:', error);
      throw new Error('Erro ao deletar resumo');
    }
  },

  // =====================================================
  // PREFERÊNCIAS
  // =====================================================

  async getMemoryPreferences(userId: string): Promise<MemoryPreferences> {
    const { data, error } = await supabase
      .from('memory_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching memory preferences:', error);
      throw new Error('Erro ao buscar preferências');
    }

    // Se não existir, criar com valores padrão
    if (!data) {
      return await this.createDefaultMemoryPreferences(userId);
    }

    return data;
  },

  async updateMemoryPreferences(userId: string, data: UpdateMemoryPreferencesData): Promise<MemoryPreferences> {
    const { data: preferences, error } = await supabase
      .from('memory_preferences')
      .upsert({
        user_id: userId,
        ...data,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error updating memory preferences:', error);
      throw new Error('Erro ao atualizar preferências');
    }

    return preferences;
  },

  // =====================================================
  // CONTEXTO PARA IA
  // =====================================================

  async getChatContext(userId: string): Promise<ChatContext> {
    // Usar a função SQL para obter contexto completo
    const { data, error } = await supabase.rpc('get_chat_context_for_ai', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error getting chat context:', error);
      throw new Error('Erro ao buscar contexto');
    }

    return data;
  },

  async buildNathIAPrompt(userMessage: string, context: ChatContext): Promise<NathIAPrompt> {
    const { recent_messages, recent_summaries, user_preferences } = context;
    
    // Verificar se deve usar memória
    const useMemory = user_preferences.memory_enabled && user_preferences.personalized_responses;
    
    // Construir prompt do sistema
    const systemPrompt = this.buildSystemPrompt(useMemory);
    
    // Construir resumo do contexto
    const contextSummary = useMemory ? buildContextSummary(recent_summaries, recent_messages) : '';
    
    // Construir mensagens recentes
    const recentMessagesText = useMemory ? this.buildRecentMessagesText(recent_messages) : '';
    
    // Detectar tópicos e humor
    const topics = getTopicsFromMessages(recent_messages);
    const moodIndicators = getMoodIndicators(recent_messages);
    
    return {
      system_prompt: systemPrompt,
      context_summary: contextSummary,
      recent_messages: recentMessagesText,
      current_message: userMessage,
      user_context: {
        topics,
        mood_indicators,
        has_memory: useMemory,
        last_interaction: recent_messages[0]?.created_at
      }
    };
  },

  // =====================================================
  // UTILITÁRIOS
  // =====================================================

  async exportChatHistory(userId: string, format: 'json' | 'csv' = 'json'): Promise<string> {
    const messages = await this.getChatHistory({ user_id: userId, limit: 1000 });
    
    if (format === 'json') {
      return JSON.stringify(messages, null, 2);
    } else {
      // CSV format
      const headers = ['Data', 'Remetente', 'Mensagem', 'Tipo'];
      const rows = messages.map(msg => [
        new Date(msg.created_at).toLocaleString('pt-BR'),
        msg.sender === 'user' ? 'Usuária' : 'NathIA',
        msg.message.replace(/"/g, '""'), // Escape quotes
        msg.message_type
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      return csvContent;
    }
  },

  async cleanupOldHistory(): Promise<void> {
    const { error } = await supabase.rpc('cleanup_old_chat_history');
    
    if (error) {
      console.error('Error cleaning up old history:', error);
      throw new Error('Erro ao limpar histórico antigo');
    }
  },

  // =====================================================
  // MÉTODOS PRIVADOS
  // =====================================================

  async createDefaultMemoryPreferences(userId: string): Promise<MemoryPreferences> {
    const { data, error } = await supabase
      .from('memory_preferences')
      .insert({
        user_id: userId,
        ...DEFAULT_MEMORY_PREFERENCES
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating default memory preferences:', error);
      throw new Error('Erro ao criar preferências padrão');
    }

    return data;
  },

  buildSystemPrompt(useMemory: boolean): string {
    const basePrompt = `Você é o NathIA, assistente virtual do ClubNath, uma comunidade de mães.

PERSONALIDADE:
- Seja jovem, empática e validadora
- Use "miga" para se dirigir às mães
- Inclua elementos cristãos sutis e naturais
- Mantenha tom acolhedor e compreensivo
- Sempre valide os sentimentos da mãe

DIRETRIZES:
- Responda em português brasileiro
- Seja específica e prática
- Ofereça suporte emocional
- Use emojis moderadamente (💜, 🙏, 🤗)
- Evite conselhos médicos específicos
- Encoraje a buscar ajuda profissional quando necessário`;

    if (useMemory) {
      return basePrompt + `

MEMÓRIA:
- Você tem acesso ao histórico de conversas anteriores
- Reconheça se já conversou com esta mãe antes
- Faça referências ao que foi discutido anteriormente
- Personalize suas respostas baseadas no contexto
- Seja consistente com informações já compartilhadas`;
    }

    return basePrompt;
  },

  buildRecentMessagesText(messages: ChatMessage[]): string {
    if (messages.length === 0) return '';

    const recentMessages = messages.slice(0, 10).reverse(); // Últimas 10, em ordem cronológica
    
    return recentMessages.map(msg => {
      const sender = msg.sender === 'user' ? 'Usuária' : 'NathIA';
      return `${sender}: ${msg.message}`;
    }).join('\n');
  }
};

// =====================================================
// FUNÇÕES AUXILIARES PARA NATHIA
// =====================================================

export const generateNathIAResponse = async (
  userMessage: string,
  userId: string
): Promise<NathIAResponse> => {
  try {
    // Buscar contexto
    const context = await chatHistoryService.getChatContext(userId);
    
    // Construir prompt
    const prompt = await chatHistoryService.buildNathIAPrompt(userMessage, context);
    
    // Chamar API do Claude
    const response = await callClaudeAPI(prompt);
    
    // Salvar mensagens no histórico
    const sessionId = crypto.randomUUID();
    
    await chatHistoryService.createChatMessage({
      session_id: sessionId,
      message: userMessage,
      sender: 'user',
      message_type: 'text'
    });
    
    await chatHistoryService.createChatMessage({
      session_id: sessionId,
      message: response.message,
      sender: 'assistant',
      message_type: 'text',
      metadata: {
        model: 'claude-3-5-sonnet',
        tokens_used: response.metadata?.tokens_used,
        context_used: prompt.context_summary.length > 0
      }
    });
    
    // Criar resumo se necessário
    if (context.user_preferences.auto_summarize) {
      await createConversationSummary(sessionId, userMessage, response.message, context);
    }
    
    return {
      message: response.message,
      context_used: prompt.context_summary.length > 0,
      topics_detected: prompt.user_context?.topics || [],
      mood_indicators: prompt.user_context?.mood_indicators || {},
      session_id: sessionId,
      metadata: response.metadata || {}
    };
    
  } catch (error) {
    console.error('Error generating NathIA response:', error);
    throw new Error('Erro ao gerar resposta do NathIA');
  }
};

const callClaudeAPI = async (prompt: NathIAPrompt): Promise<{ message: string; metadata?: any }> => {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('API key do Claude não configurada');
  }
  
  const fullPrompt = `${prompt.system_prompt}

${prompt.context_summary ? `CONTEXTO:\n${prompt.context_summary}\n` : ''}

${prompt.recent_messages ? `CONVERSAS RECENTES:\n${prompt.recent_messages}\n` : ''}

MENSAGEM ATUAL:
Usuária: ${prompt.current_message}

Responda com empatia e continuidade, considerando o contexto quando disponível.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: fullPrompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Erro na API do Claude: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    message: data.content[0].text,
    metadata: {
      tokens_used: data.usage?.total_tokens,
      model: data.model
    }
  };
};

const createConversationSummary = async (
  sessionId: string,
  userMessage: string,
  assistantMessage: string,
  context: ChatContext
): Promise<void> => {
  try {
    const topics = getTopicsFromMessages([{ message: userMessage } as ChatMessage]);
    const moodIndicators = getMoodIndicators([{ message: userMessage } as ChatMessage]);
    
    const summary = `Conversa sobre ${topics.join(', ') || 'maternidade'}. ${userMessage.substring(0, 100)}...`;
    
    await chatHistoryService.createChatSummary({
      session_id: sessionId,
      summary,
      topics,
      mood_indicators
    });
  } catch (error) {
    console.error('Error creating conversation summary:', error);
    // Não falhar se não conseguir criar resumo
  }
};

// =====================================================
// HOOKS PERSONALIZADOS
// =====================================================

export const useChatHistory = (userId: string, sessionId?: string) => {
  return {
    queryKey: ['chat-history', userId, sessionId],
    queryFn: () => chatHistoryService.getChatHistory({ user_id: userId, session_id: sessionId })
  };
};

export const useChatContext = (userId: string) => {
  return {
    queryKey: ['chat-context', userId],
    queryFn: () => chatHistoryService.getChatContext(userId)
  };
};

export const useMemoryPreferences = (userId: string) => {
  return {
    queryKey: ['memory-preferences', userId],
    queryFn: () => chatHistoryService.getMemoryPreferences(userId)
  };
};

// =====================================================
// EXPORT DEFAULT
// =====================================================

export default chatHistoryService;
