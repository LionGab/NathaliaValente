// =====================================================
// CLUBNATH CHAT HISTORY - TIPOS TYPESCRIPT
// NathIA Inteligente com Memória Persistente
// =====================================================

export type ChatSender = 'user' | 'assistant';
export type MessageType = 'text' | 'image' | 'audio' | 'system';

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  message: string;
  sender: ChatSender;
  message_type: MessageType;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ChatSummary {
  id: string;
  user_id: string;
  session_id: string;
  summary: string;
  topics: string[];
  mood_indicators: Record<string, any>;
  created_at: string;
  expires_at: string;
}

export interface MemoryPreferences {
  id: string;
  user_id: string;
  memory_enabled: boolean;
  memory_retention_days: number;
  auto_summarize: boolean;
  personalized_responses: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatContext {
  recent_messages: ChatMessage[];
  recent_summaries: ChatSummary[];
  user_preferences: MemoryPreferences;
  generated_at: string;
}

export interface ChatHistoryFilters {
  user_id: string;
  session_id?: string;
  sender?: ChatSender;
  limit?: number;
  offset?: number;
  start_date?: string;
  end_date?: string;
}

export interface CreateChatMessageData {
  session_id?: string;
  message: string;
  sender: ChatSender;
  message_type?: MessageType;
  metadata?: Record<string, any>;
}

export interface CreateChatSummaryData {
  session_id: string;
  summary: string;
  topics?: string[];
  mood_indicators?: Record<string, any>;
}

export interface UpdateMemoryPreferencesData {
  memory_enabled?: boolean;
  memory_retention_days?: number;
  auto_summarize?: boolean;
  personalized_responses?: boolean;
}

// =====================================================
// INTERFACES PARA NATHIA
// =====================================================

export interface NathIAPrompt {
  system_prompt: string;
  context_summary: string;
  recent_messages: string;
  current_message: string;
  user_name?: string;
  user_context?: Record<string, any>;
}

export interface NathIAResponse {
  message: string;
  context_used: boolean;
  topics_detected: string[];
  mood_indicators: Record<string, any>;
  session_id: string;
  metadata: Record<string, any>;
}

export interface NathIAPersonality {
  name: string;
  tone: string;
  characteristics: string[];
  greeting_templates: string[];
  empathy_phrases: string[];
  validation_phrases: string[];
  christian_elements: string[];
}

// =====================================================
// INTERFACES PARA COMPONENTES
// =====================================================

export interface ChatHistoryProps {
  userId: string;
  sessionId?: string;
  onMessageSelect?: (message: ChatMessage) => void;
  showSummaries?: boolean;
  compact?: boolean;
}

export interface MemoryIndicatorProps {
  hasMemory: boolean;
  lastInteraction?: string;
  topicsCount?: number;
  onManageMemory?: () => void;
}

export interface MemorySettingsProps {
  preferences: MemoryPreferences;
  onUpdate: (data: UpdateMemoryPreferencesData) => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
}

// =====================================================
// INTERFACES PARA SERVIÇOS
// =====================================================

export interface ChatHistoryService {
  // Mensagens
  getChatHistory: (filters: ChatHistoryFilters) => Promise<ChatMessage[]>;
  createChatMessage: (data: CreateChatMessageData) => Promise<ChatMessage>;
  updateChatMessage: (id: string, data: Partial<CreateChatMessageData>) => Promise<ChatMessage>;
  deleteChatMessage: (id: string) => Promise<void>;
  clearChatHistory: (userId: string, sessionId?: string) => Promise<void>;

  // Resumos
  getChatSummaries: (userId: string, limit?: number) => Promise<ChatSummary[]>;
  createChatSummary: (data: CreateChatSummaryData) => Promise<ChatSummary>;
  updateChatSummary: (id: string, data: Partial<CreateChatSummaryData>) => Promise<ChatSummary>;
  deleteChatSummary: (id: string) => Promise<void>;

  // Preferências
  getMemoryPreferences: (userId: string) => Promise<MemoryPreferences>;
  updateMemoryPreferences: (
    userId: string,
    data: UpdateMemoryPreferencesData
  ) => Promise<MemoryPreferences>;

  // Contexto para IA
  getChatContext: (userId: string) => Promise<ChatContext>;
  buildNathIAPrompt: (userMessage: string, context: ChatContext) => Promise<NathIAPrompt>;

  // Utilitários
  exportChatHistory: (userId: string, format: 'json' | 'csv') => Promise<string>;
  cleanupOldHistory: () => Promise<void>;
}

// =====================================================
// CONSTANTES
// =====================================================

export const NATHIA_PERSONALITY: NathIAPersonality = {
  name: 'NathIA',
  tone: 'jovem, empática, validadora, cristã leve',
  characteristics: [
    'Usa "miga" para se dirigir às mães',
    'Sempre reconhece conversas anteriores',
    'Oferece validação emocional',
    'Inclui elementos cristãos sutis',
    'Mantém tom acolhedor e compreensivo',
    'Personaliza respostas baseadas no histórico',
  ],
  greeting_templates: [
    'Oi de novo, miga! 💜',
    'Que bom te ver por aqui novamente!',
    'Oi, querida! Como você está?',
    'Olá, miga! Estava com saudades!',
  ],
  empathy_phrases: [
    'Eu te entendo demais, miga',
    'Que fase difícil, né?',
    'Você está sendo uma mãe incrível',
    'É normal se sentir assim',
    'Você não está sozinha nisso',
    'Que coragem você tem!',
  ],
  validation_phrases: [
    'Você está fazendo o seu melhor',
    'Cada mãe tem seu jeito',
    'Não existe mãe perfeita',
    'Você está aprendendo e crescendo',
    'Seus sentimentos são válidos',
    'Você é mais forte do que imagina',
  ],
  christian_elements: [
    'Deus te deu essa missão especial',
    'Ore por sabedoria e paciência',
    'Deus está cuidando de vocês',
    'Confie no plano dEle para sua família',
    'Peça forças ao Senhor',
    'Deus te abençoe, miga',
  ],
};

export const DEFAULT_MEMORY_PREFERENCES: Omit<
  MemoryPreferences,
  'id' | 'user_id' | 'created_at' | 'updated_at'
> = {
  memory_enabled: true,
  memory_retention_days: 30,
  auto_summarize: true,
  personalized_responses: true,
};

export const MAX_MESSAGE_LENGTH = 4000;
export const MAX_HISTORY_MESSAGES = 10;
export const MAX_SUMMARIES = 5;
export const DEFAULT_RETENTION_DAYS = 30;
export const MAX_RETENTION_DAYS = 365;

// =====================================================
// UTILITÁRIOS
// =====================================================

export const formatChatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Agora mesmo';
  if (diffInHours < 24) return `${diffInHours}h atrás`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} dias atrás`;

  return date.toLocaleDateString('pt-BR');
};

export const getMemoryIndicatorText = (hasMemory: boolean, topicsCount: number = 0): string => {
  if (!hasMemory) return 'NathIA não lembra de conversas anteriores';
  if (topicsCount === 0) return 'NathIA lembra de você 💜';
  return `NathIA lembra de ${topicsCount} tópicos sobre você 💜`;
};

export const shouldUseMemory = (preferences: MemoryPreferences): boolean => {
  return preferences.memory_enabled && preferences.personalized_responses;
};

export const getTopicsFromMessages = (messages: ChatMessage[]): string[] => {
  const topics = new Set<string>();

  messages.forEach((message) => {
    const text = message.message.toLowerCase();

    // Detectar tópicos comuns
    if (text.includes('amamentação') || text.includes('amamentar')) topics.add('amamentação');
    if (text.includes('sono') || text.includes('dormir')) topics.add('sono');
    if (text.includes('cansaço') || text.includes('cansada')) topics.add('cansaço');
    if (text.includes('choro') || text.includes('chorando')) topics.add('choro do bebê');
    if (text.includes('alimentação') || text.includes('comida')) topics.add('alimentação');
    if (text.includes('desenvolvimento') || text.includes('crescimento'))
      topics.add('desenvolvimento');
    if (text.includes('relacionamento') || text.includes('casamento')) topics.add('relacionamento');
    if (text.includes('trabalho') || text.includes('carreira')) topics.add('carreira');
    if (text.includes('família') || text.includes('parentes')) topics.add('família');
    if (text.includes('saúde') || text.includes('médico')) topics.add('saúde');
  });

  return Array.from(topics);
};

export const getMoodIndicators = (messages: ChatMessage[]): Record<string, any> => {
  const indicators: Record<string, any> = {
    stress_level: 'normal',
    emotional_state: 'neutral',
    support_needed: false,
    confidence_level: 'medium',
  };

  const recentText = messages
    .slice(0, 5)
    .map((m) => m.message.toLowerCase())
    .join(' ');

  // Detectar nível de estresse
  if (
    recentText.includes('estressada') ||
    recentText.includes('ansiosa') ||
    recentText.includes('preocupada')
  ) {
    indicators.stress_level = 'high';
  } else if (
    recentText.includes('tranquila') ||
    recentText.includes('calma') ||
    recentText.includes('bem')
  ) {
    indicators.stress_level = 'low';
  }

  // Detectar estado emocional
  if (
    recentText.includes('triste') ||
    recentText.includes('deprimida') ||
    recentText.includes('chorando')
  ) {
    indicators.emotional_state = 'sad';
  } else if (
    recentText.includes('feliz') ||
    recentText.includes('alegre') ||
    recentText.includes('contente')
  ) {
    indicators.emotional_state = 'happy';
  } else if (
    recentText.includes('frustrada') ||
    recentText.includes('irritada') ||
    recentText.includes('brava')
  ) {
    indicators.emotional_state = 'frustrated';
  }

  // Detectar necessidade de suporte
  if (
    recentText.includes('ajuda') ||
    recentText.includes('não sei') ||
    recentText.includes('dificuldade')
  ) {
    indicators.support_needed = true;
  }

  // Detectar nível de confiança
  if (
    recentText.includes('confiante') ||
    recentText.includes('segura') ||
    recentText.includes('conseguindo')
  ) {
    indicators.confidence_level = 'high';
  } else if (
    recentText.includes('insegura') ||
    recentText.includes('dúvida') ||
    recentText.includes('medo')
  ) {
    indicators.confidence_level = 'low';
  }

  return indicators;
};

export const buildContextSummary = (summaries: ChatSummary[], messages: ChatMessage[]): string => {
  if (summaries.length === 0 && messages.length === 0) {
    return 'Primeira conversa com esta usuária.';
  }

  const topics = getTopicsFromMessages(messages);
  const moodIndicators = getMoodIndicators(messages);

  let summary = 'Contexto da usuária:\n';

  if (topics.length > 0) {
    summary += `- Tópicos discutidos: ${topics.join(', ')}\n`;
  }

  if (moodIndicators.stress_level !== 'normal') {
    summary += `- Nível de estresse: ${moodIndicators.stress_level}\n`;
  }

  if (moodIndicators.emotional_state !== 'neutral') {
    summary += `- Estado emocional: ${moodIndicators.emotional_state}\n`;
  }

  if (moodIndicators.support_needed) {
    summary += '- Precisa de suporte e validação\n';
  }

  if (summaries.length > 0) {
    summary += '\nResumos de conversas anteriores:\n';
    summaries.slice(0, 3).forEach((s, index) => {
      summary += `${index + 1}. ${s.summary}\n`;
    });
  }

  return summary;
};

export const generateGreeting = (hasMemory: boolean, topics: string[] = []): string => {
  if (!hasMemory) {
    return NATHIA_PERSONALITY.greeting_templates[
      Math.floor(Math.random() * NATHIA_PERSONALITY.greeting_templates.length)
    ];
  }

  const templates = [
    `Oi de novo, miga! 💜 Na última vez você me contou sobre ${topics[0] || 'sua jornada'}. Como está isso hoje?`,
    `Que bom te ver por aqui! Lembro que você estava lidando com ${topics[0] || 'alguns desafios'}. Como tem sido?`,
    `Oi, querida! Estava pensando em você e em como você estava com ${topics[0] || 'tudo'}. Me conta como está!`,
    `Olá, miga! Lembro das nossas conversas sobre ${topics.slice(0, 2).join(' e ') || 'maternidade'}. Como você está?`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};
