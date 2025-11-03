import { supabase } from '../../../lib/supabase';
import { trackEngagement } from '../../../lib/analytics';

export interface NathIAMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  context?: {
    userMood?: string;
    motherhoodStage?: string;
    currentChallenges?: string[];
    recentPosts?: any[];
    userGoals?: string[];
  };
}

export interface NathIAContext {
  userProfile: {
    id: string;
    full_name: string;
    motherhood_stage: string;
    interests: string[];
    goals: string[];
    personality_traits: string[];
  };
  recentMessages: NathIAMessage[];
  currentMood: string;
  activeChallenges: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
}

class NathIAEnhancedService {
  private readonly SYSTEM_PROMPTS = {
    morning: 'Bom dia! Que lindo começar o dia com você aqui. Como está se sentindo hoje?',
    afternoon: 'Olá! Espero que seu dia esteja sendo abençoado. Em que posso te ajudar?',
    evening: 'Boa tarde! Que bom te ver aqui novamente. Como foi seu dia?',
    night: 'Boa noite! Que momento especial para refletir e se conectar. Como posso te apoiar?',
  };

  private readonly MOOD_RESPONSES = {
    happy: 'Que alegria ver você feliz! 😊 Compartilhe essa energia positiva comigo.',
    sad: 'Sinto que você está passando por um momento difícil. Estou aqui para te apoiar. 💙',
    anxious: 'Entendo sua ansiedade. Vamos respirar juntas e encontrar calma. 🌸',
    tired: 'Maternidade é cansativo mesmo. Você está fazendo um trabalho incrível. 💪',
    grateful: 'Que lindo ver gratidão no seu coração! Isso é uma bênção. 🙏',
    overwhelmed: 'Sei que pode parecer muito, mas você é mais forte do que imagina. 🌟',
  };

  /**
   * Generate enhanced response from NathIA with full context
   */
  async generateResponse(
    userId: string,
    userMessage: string,
    context?: Partial<NathIAContext>
  ): Promise<string> {
    try {
      // Get or build context
      const fullContext = await this.buildContext(userId, context);

      // Analyze user mood and intent
      const moodAnalysis = await this.analyzeMood(userMessage, fullContext);
      const intent = await this.analyzeIntent(userMessage);

      // Generate contextual response
      const response = await this.generateContextualResponse(
        userMessage,
        fullContext,
        moodAnalysis,
        intent
      );

      // Save conversation
      await this.saveConversation(userId, userMessage, response, fullContext);

      // Track engagement
      trackEngagement('nathia_interaction', 'chat', userId, userMessage.length);

      return response;
    } catch (error) {
      console.error('Error generating NathIA response:', error);
      return 'Desculpe, estou passando por um momento de reflexão. Pode tentar novamente? 🙏';
    }
  }

  /**
   * Build comprehensive context for NathIA
   */
  private async buildContext(
    userId: string,
    providedContext?: Partial<NathIAContext>
  ): Promise<NathIAContext> {
    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, motherhood_stage, interests, goals, personality_traits')
      .eq('id', userId)
      .single();

    // Get recent messages
    const { data: messages } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent posts for context
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Determine time context
    const hour = new Date().getHours();
    const timeOfDay =
      hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    // Determine season
    const month = new Date().getMonth();
    const season = month < 3 ? 'spring' : month < 6 ? 'summer' : month < 9 ? 'autumn' : 'winter';

    return {
      userProfile: profile || {
        id: userId,
        full_name: 'Mamãe',
        motherhood_stage: 'experienced',
        interests: [],
        goals: [],
        personality_traits: [],
      },
      recentMessages: messages || [],
      currentMood: providedContext?.currentMood || 'neutral',
      activeChallenges: providedContext?.activeChallenges || [],
      timeOfDay,
      season,
      ...providedContext,
    };
  }

  /**
   * Analyze user mood from message
   */
  private async analyzeMood(message: string, context: NathIAContext): Promise<string> {
    const moodKeywords = {
      happy: ['feliz', 'alegre', 'grata', 'abençoada', 'maravilhoso', 'incrível', 'amor'],
      sad: ['triste', 'chateada', 'deprimida', 'melancólica', 'difícil', 'pesado'],
      anxious: ['ansiosa', 'preocupada', 'nervosa', 'agitada', 'estressada', 'tensão'],
      tired: ['cansada', 'exausta', 'esgotada', 'sem energia', 'fadiga'],
      grateful: ['grata', 'abençoada', 'agradecida', 'fortuna', 'sorte'],
      overwhelmed: ['sobrecarregada', 'muito', 'demais', 'não aguento', 'explodir'],
    };

    const lowerMessage = message.toLowerCase();

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return mood;
      }
    }

    return 'neutral';
  }

  /**
   * Analyze user intent
   */
  private async analyzeIntent(message: string): Promise<string> {
    const intentKeywords = {
      advice: ['conselho', 'ajuda', 'o que fazer', 'como', 'dica'],
      prayer: ['oração', 'rezar', 'deus', 'fé', 'abençoa'],
      support: ['apoio', 'suporte', 'compreensão', 'entender'],
      sharing: ['compartilhar', 'contar', 'aconteceu', 'experiência'],
      question: ['?', 'por que', 'quando', 'onde', 'quem', 'o que'],
    };

    const lowerMessage = message.toLowerCase();

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  /**
   * Generate contextual response
   */
  private async generateContextualResponse(
    userMessage: string,
    context: NathIAContext,
    mood: string,
    intent: string
  ): Promise<string> {
    // Start with time-appropriate greeting
    let response = this.SYSTEM_PROMPTS[context.timeOfDay];

    // Add mood-appropriate response
    if (mood !== 'neutral') {
      response += ` ${this.MOOD_RESPONSES[mood as keyof typeof this.MOOD_RESPONSES]}`;
    }

    // Add contextual advice based on motherhood stage
    const motherhoodAdvice = this.getMotherhoodStageAdvice(
      context.userProfile.motherhood_stage,
      mood
    );
    if (motherhoodAdvice) {
      response += ` ${motherhoodAdvice}`;
    }

    // Add intent-specific response
    const intentResponse = this.getIntentResponse(intent, context, userMessage);
    if (intentResponse) {
      response += ` ${intentResponse}`;
    }

    // Add personalized touch
    const personalizedTouch = this.getPersonalizedTouch(context);
    if (personalizedTouch) {
      response += ` ${personalizedTouch}`;
    }

    // Add closing with encouragement
    response += this.getEncouragingClosing(mood, context.timeOfDay);

    return response;
  }

  /**
   * Get advice based on motherhood stage
   */
  private getMotherhoodStageAdvice(stage: string, mood: string): string {
    const advice = {
      pregnant: {
        happy: 'Que bênção estar grávida! Aproveite cada momento dessa jornada única.',
        anxious: 'A gravidez pode trazer muitas dúvidas. Lembre-se: você já é uma mãe incrível.',
        tired:
          'O cansaço na gravidez é normal. Descanse quando puder, seu corpo está trabalhando muito.',
      },
      new_mom: {
        happy: 'Os primeiros meses são mágicos! Cada sorriso do seu bebê é uma bênção.',
        anxious: 'Ser mãe de primeira viagem é desafiador. Você está aprendendo e isso é normal.',
        tired: 'Maternidade é cansativo mesmo. Peça ajuda quando precisar, você não está sozinha.',
      },
      experienced: {
        happy: 'Sua experiência é um tesouro! Compartilhe sua sabedoria com outras mães.',
        anxious: 'Mesmo experiente, cada fase traz novos desafios. Você tem a força necessária.',
        tired: 'Múltiplos filhos exigem muito. Você é uma super-heroína disfarçada de mãe.',
      },
      grandmother: {
        happy: 'Que alegria ser avó! Sua sabedoria é um presente para toda a família.',
        anxious: 'Cuidar dos netos pode ser cansativo. Lembre-se de cuidar de si também.',
        tired: 'Ser avó é uma bênção, mas também é trabalho. Descanse quando precisar.',
      },
    };

    return (
      advice[stage as keyof typeof advice]?.[mood as keyof (typeof advice)[keyof typeof advice]] ||
      ''
    );
  }

  /**
   * Get response based on user intent
   */
  private getIntentResponse(intent: string, context: NathIAContext, message: string): string {
    switch (intent) {
      case 'advice':
        return 'Estou aqui para te apoiar. Compartilhe mais sobre sua situação para que eu possa te ajudar melhor.';

      case 'prayer':
        return 'Que lindo momento de conexão com Deus! Vamos orar juntas pela sua situação.';

      case 'support':
        return 'Você não está sozinha. Estou aqui para te ouvir e apoiar em tudo que precisar.';

      case 'sharing':
        return 'Obrigada por compartilhar isso comigo. Sua experiência pode ajudar outras mães também.';

      case 'question':
        return 'Que pergunta importante! Vou fazer o meu melhor para te ajudar com isso.';

      default:
        return 'Estou aqui para te acompanhar nessa jornada. Como posso te apoiar hoje?';
    }
  }

  /**
   * Add personalized touch based on user context
   */
  private getPersonalizedTouch(context: NathIAContext): string {
    const touches = [];

    // Reference recent interests
    if (context.userProfile.interests.length > 0) {
      const randomInterest =
        context.userProfile.interests[
          Math.floor(Math.random() * context.userProfile.interests.length)
        ];
      touches.push(`Vejo que você gosta de ${randomInterest}. Que lindo!`);
    }

    // Reference goals
    if (context.userProfile.goals.length > 0) {
      const randomGoal =
        context.userProfile.goals[Math.floor(Math.random() * context.userProfile.goals.length)];
      touches.push(`Lembro que você tem o objetivo de ${randomGoal}. Como está indo?`);
    }

    // Reference personality
    if (context.userProfile.personality_traits.length > 0) {
      const randomTrait =
        context.userProfile.personality_traits[
          Math.floor(Math.random() * context.userProfile.personality_traits.length)
        ];
      touches.push(`Sua ${randomTrait} é uma qualidade linda!`);
    }

    return touches.length > 0 ? touches[Math.floor(Math.random() * touches.length)] : '';
  }

  /**
   * Get encouraging closing
   */
  private getEncouragingClosing(mood: string, timeOfDay: string): string {
    const closings = {
      morning: ' Que seu dia seja abençoado e cheio de alegrias! 🌅',
      afternoon: ' Que a tarde continue sendo produtiva e feliz! ☀️',
      evening: ' Que a noite seja tranquila e renovadora! 🌙',
      night: ' Que você tenha um sono reparador e sonhos lindos! 🌟',
    };

    const moodClosings = {
      happy: ' Continue espalhando essa alegria! 😊',
      sad: ' Lembre-se: você é mais forte do que imagina. 💪',
      anxious: ' Respire fundo. Você consegue! 🌸',
      tired: ' Descanse. Você merece! 💤',
      grateful: ' Que gratidão continue enchendo seu coração! 🙏',
      overwhelmed: ' Um passo de cada vez. Você vai conseguir! 🌟',
    };

    return (moodClosings[mood as keyof typeof moodClosings] || '') + (closings[timeOfDay] || '');
  }

  /**
   * Save conversation to database
   */
  private async saveConversation(
    userId: string,
    userMessage: string,
    assistantMessage: string,
    context: NathIAContext
  ): Promise<void> {
    try {
      // Save user message
      await supabase.from('chat_history').insert({
        user_id: userId,
        message: userMessage,
        role: 'user',
        context: {
          mood: context.currentMood,
          timeOfDay: context.timeOfDay,
          season: context.season,
        },
      });

      // Save assistant message
      await supabase.from('chat_history').insert({
        user_id: userId,
        message: assistantMessage,
        role: 'assistant',
        context: {
          mood: context.currentMood,
          timeOfDay: context.timeOfDay,
          season: context.season,
          userProfile: context.userProfile,
        },
      });
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  }

  /**
   * Get conversation summary for user
   */
  async getConversationSummary(userId: string, days: number = 7): Promise<string> {
    try {
      const { data: messages } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (!messages || messages.length === 0) {
        return 'Você ainda não conversou comigo esta semana. Estou aqui quando precisar! 💙';
      }

      const userMessages = messages.filter((m) => m.role === 'user');
      const commonTopics = this.extractCommonTopics(userMessages);
      const moodTrends = this.analyzeMoodTrends(userMessages);

      return `Esta semana conversamos sobre ${commonTopics.join(', ')}. ${moodTrends} Continue compartilhando comigo! 💙`;
    } catch (error) {
      console.error('Error getting conversation summary:', error);
      return 'Estou aqui para continuar nossa conversa sempre que precisar! 💙';
    }
  }

  /**
   * Extract common topics from messages
   */
  private extractCommonTopics(messages: any[]): string[] {
    const topics = {
      maternidade: ['bebê', 'filho', 'criança', 'maternidade', 'mãe'],
      fé: ['deus', 'oração', 'fé', 'igreja', 'bíblia'],
      relacionamento: ['marido', 'esposo', 'família', 'relacionamento'],
      trabalho: ['trabalho', 'carreira', 'emprego', 'profissional'],
      saúde: ['saúde', 'médico', 'hospital', 'bem-estar'],
      amizade: ['amiga', 'amizade', 'social', 'conexão'],
    };

    const messageText = messages.map((m) => m.message.toLowerCase()).join(' ');
    const foundTopics = [];

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some((keyword) => messageText.includes(keyword))) {
        foundTopics.push(topic);
      }
    }

    return foundTopics.slice(0, 3); // Return top 3 topics
  }

  /**
   * Analyze mood trends
   */
  private analyzeMoodTrends(messages: any[]): string {
    const moods = messages.map((m) => m.context?.mood || 'neutral');
    const happyCount = moods.filter((m) => m === 'happy').length;
    const sadCount = moods.filter((m) => m === 'sad').length;
    const anxiousCount = moods.filter((m) => m === 'anxious').length;

    if (happyCount > sadCount && happyCount > anxiousCount) {
      return 'Vejo que você está em um momento positivo!';
    } else if (sadCount > happyCount) {
      return 'Notei que você está passando por alguns desafios. Estou aqui para te apoiar.';
    } else if (anxiousCount > happyCount) {
      return 'Vejo que você está um pouco ansiosa. Vamos trabalhar juntas para encontrar calma.';
    }

    return 'Estou acompanhando sua jornada e aqui para o que precisar.';
  }
}

export const nathIAEnhancedService = new NathIAEnhancedService();
