// =====================================================
// CLUBNATH SOS EMOCIONAL SERVICE
// Sistema de Suporte em Crise Emocional
// =====================================================

import { supabase } from '../lib/supabase';

export interface EmergencyResource {
  id: string;
  name: string;
  description: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  email?: string;
  category: 'crisis' | 'professional' | 'support_group' | 'emergency';
  is_24h: boolean;
  is_free: boolean;
  language: string;
  region: string;
  is_active: boolean;
  priority: number;
  created_at?: string;
  updated_at?: string;
}

export interface CopingTechnique {
  id: string;
  name: string;
  description: string;
  category: 'breathing' | 'grounding' | 'mindfulness' | 'physical' | 'cognitive' | 'spiritual';
  duration_minutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: {
    steps: string[];
  };
  audio_url?: string;
  is_active: boolean;
  created_at?: string;
}

export interface CrisisSession {
  id?: string;
  user_id: string;
  started_at?: string;
  ended_at?: string;
  crisis_level: 'low' | 'medium' | 'high' | 'critical';
  initial_mood?: string;
  final_mood?: string;
  techniques_used?: string[];
  resources_accessed?: string[];
  follow_up_needed?: boolean;
  follow_up_date?: string;
  notes?: string;
  is_resolved?: boolean;
  created_at?: string;
}

export interface TechniqueUsage {
  id?: string;
  user_id: string;
  technique_id: string;
  crisis_session_id: string;
  used_at?: string;
  effectiveness_rating?: number;
  notes?: string;
}

export interface UserEmergencyContact {
  id?: string;
  user_id: string;
  name: string;
  relationship?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  is_primary?: boolean;
  can_contact_during_crisis?: boolean;
  created_at?: string;
}

export interface CrisisAnalytics {
  id?: string;
  user_id: string;
  crisis_session_id: string;
  trigger_event?: string;
  time_of_day?: number;
  day_of_week?: number;
  duration_minutes?: number;
  techniques_effective?: string[];
  techniques_ineffective?: string[];
  resources_used?: string[];
  outcome?: 'resolved' | 'improved' | 'unchanged' | 'worsened';
  created_at?: string;
}

export interface CrisisStats {
  total_sessions: number;
  critical_sessions: number;
  resolved_sessions: number;
  avg_duration_minutes: number;
  most_used_techniques: Array<{
    name: string;
    usage_count: number;
    avg_effectiveness: number;
  }>;
  most_accessed_resources: Array<{
    name: string;
    access_count: number;
  }>;
}

class SosEmotionalService {
  private static instance: SosEmotionalService;

  private constructor() {}

  public static getInstance(): SosEmotionalService {
    if (!SosEmotionalService.instance) {
      SosEmotionalService.instance = new SosEmotionalService();
    }
    return SosEmotionalService.instance;
  }

  // =====================================================
  // EMERGENCY RESOURCES
  // =====================================================

  async getEmergencyResources(category?: string): Promise<EmergencyResource[]> {
    let query = supabase
      .from('emergency_resources')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar recursos de emergência:', error);
      return [];
    }

    return data || [];
  }

  async getCrisisResources(): Promise<EmergencyResource[]> {
    return this.getEmergencyResources('crisis');
  }

  async getProfessionalResources(): Promise<EmergencyResource[]> {
    return this.getEmergencyResources('professional');
  }

  async getSupportGroups(): Promise<EmergencyResource[]> {
    return this.getEmergencyResources('support_group');
  }

  // =====================================================
  // COPING TECHNIQUES
  // =====================================================

  async getCopingTechniques(category?: string): Promise<CopingTechnique[]> {
    let query = supabase
      .from('coping_techniques')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar técnicas de coping:', error);
      return [];
    }

    return data || [];
  }

  async getQuickTechniques(): Promise<CopingTechnique[]> {
    const { data, error } = await supabase
      .from('coping_techniques')
      .select('*')
      .eq('is_active', true)
      .eq('difficulty', 'easy')
      .lte('duration_minutes', 5)
      .order('duration_minutes', { ascending: true });

    if (error) {
      console.error('Erro ao buscar técnicas rápidas:', error);
      return [];
    }

    return data || [];
  }

  async getTechniqueById(techniqueId: string): Promise<CopingTechnique | null> {
    const { data, error } = await supabase
      .from('coping_techniques')
      .select('*')
      .eq('id', techniqueId)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Erro ao buscar técnica:', error);
      return null;
    }

    return data;
  }

  // =====================================================
  // CRISIS SESSIONS
  // =====================================================

  async startCrisisSession(
    userId: string,
    crisisLevel: 'low' | 'medium' | 'high' | 'critical',
    initialMood?: string
  ): Promise<CrisisSession | null> {
    const { data, error } = await supabase
      .from('crisis_sessions')
      .insert({
        user_id: userId,
        crisis_level: crisisLevel,
        initial_mood: initialMood,
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao iniciar sessão de crise:', error);
      return null;
    }

    return data;
  }

  async endCrisisSession(
    sessionId: string,
    finalMood?: string,
    isResolved?: boolean
  ): Promise<boolean> {
    const { error } = await supabase
      .from('crisis_sessions')
      .update({
        ended_at: new Date().toISOString(),
        final_mood: finalMood,
        is_resolved: isResolved
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Erro ao finalizar sessão de crise:', error);
      return false;
    }

    return true;
  }

  async getCrisisSessions(userId: string, limit: number = 10): Promise<CrisisSession[]> {
    const { data, error } = await supabase
      .from('crisis_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar sessões de crise:', error);
      return [];
    }

    return data || [];
  }

  async getActiveCrisisSession(userId: string): Promise<CrisisSession | null> {
    const { data, error } = await supabase
      .from('crisis_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('ended_at', null)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao buscar sessão ativa:', error);
      return null;
    }

    return data;
  }

  // =====================================================
  // TECHNIQUE USAGE
  // =====================================================

  async logTechniqueUsage(
    userId: string,
    techniqueId: string,
    crisisSessionId: string,
    effectivenessRating?: number,
    notes?: string
  ): Promise<string | null> {
    const { data, error } = await supabase
      .from('technique_usage')
      .insert({
        user_id: userId,
        technique_id: techniqueId,
        crisis_session_id: crisisSessionId,
        effectiveness_rating: effectivenessRating,
        notes: notes,
        used_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao registrar uso de técnica:', error);
      return null;
    }

    return data.id;
  }

  async getTechniqueUsageHistory(userId: string, limit: number = 20): Promise<TechniqueUsage[]> {
    const { data, error } = await supabase
      .from('technique_usage')
      .select(`
        *,
        technique:coping_techniques(name, category),
        crisis_session:crisis_sessions(crisis_level, started_at)
      `)
      .eq('user_id', userId)
      .order('used_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar histórico de uso:', error);
      return [];
    }

    return data || [];
  }

  // =====================================================
  // EMERGENCY CONTACTS
  // =====================================================

  async getUserEmergencyContacts(userId: string): Promise<UserEmergencyContact[]> {
    const { data, error } = await supabase
      .from('user_emergency_contacts')
      .select('*')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar contatos de emergência:', error);
      return [];
    }

    return data || [];
  }

  async addEmergencyContact(contact: Omit<UserEmergencyContact, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await supabase
      .from('user_emergency_contacts')
      .insert(contact)
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao adicionar contato de emergência:', error);
      return null;
    }

    return data.id;
  }

  async updateEmergencyContact(
    contactId: string,
    updates: Partial<UserEmergencyContact>
  ): Promise<boolean> {
    const { error } = await supabase
      .from('user_emergency_contacts')
      .update(updates)
      .eq('id', contactId);

    if (error) {
      console.error('Erro ao atualizar contato de emergência:', error);
      return false;
    }

    return true;
  }

  async deleteEmergencyContact(contactId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_emergency_contacts')
      .delete()
      .eq('id', contactId);

    if (error) {
      console.error('Erro ao deletar contato de emergência:', error);
      return false;
    }

    return true;
  }

  // =====================================================
  // ANALYTICS AND STATS
  // =====================================================

  async getCrisisStats(userId: string): Promise<CrisisStats> {
    // Buscar estatísticas básicas
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('crisis_sessions')
      .select('*')
      .eq('user_id', userId);

    if (sessionsError) {
      console.error('Erro ao buscar estatísticas de crise:', sessionsError);
      return {
        total_sessions: 0,
        critical_sessions: 0,
        resolved_sessions: 0,
        avg_duration_minutes: 0,
        most_used_techniques: [],
        most_accessed_resources: []
      };
    }

    const sessions = sessionsData || [];
    const totalSessions = sessions.length;
    const criticalSessions = sessions.filter(s => s.crisis_level === 'critical').length;
    const resolvedSessions = sessions.filter(s => s.is_resolved).length;

    // Calcular duração média
    const sessionsWithDuration = sessions.filter(s => s.ended_at && s.started_at);
    const avgDuration = sessionsWithDuration.length > 0
      ? sessionsWithDuration.reduce((acc, s) => {
          const duration = new Date(s.ended_at!).getTime() - new Date(s.started_at!).getTime();
          return acc + (duration / (1000 * 60)); // Converter para minutos
        }, 0) / sessionsWithDuration.length
      : 0;

    // Buscar técnicas mais usadas
    const { data: techniquesData } = await supabase
      .from('technique_usage')
      .select(`
        technique_id,
        effectiveness_rating,
        technique:coping_techniques(name)
      `)
      .eq('user_id', userId);

    const techniqueStats = new Map<string, { count: number; totalRating: number; ratings: number[] }>();
    techniquesData?.forEach(usage => {
      const techniqueName = usage.technique?.name || 'Técnica Desconhecida';
      if (!techniqueStats.has(techniqueName)) {
        techniqueStats.set(techniqueName, { count: 0, totalRating: 0, ratings: [] });
      }
      const stats = techniqueStats.get(techniqueName)!;
      stats.count++;
      if (usage.effectiveness_rating) {
        stats.totalRating += usage.effectiveness_rating;
        stats.ratings.push(usage.effectiveness_rating);
      }
    });

    const mostUsedTechniques = Array.from(techniqueStats.entries())
      .map(([name, stats]) => ({
        name,
        usage_count: stats.count,
        avg_effectiveness: stats.ratings.length > 0 ? stats.totalRating / stats.ratings.length : 0
      }))
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 5);

    // Buscar recursos mais acessados
    const resourceStats = new Map<string, number>();
    sessions.forEach(session => {
      session.resources_accessed?.forEach(resource => {
        resourceStats.set(resource, (resourceStats.get(resource) || 0) + 1);
      });
    });

    const mostAccessedResources = Array.from(resourceStats.entries())
      .map(([name, count]) => ({ name, access_count: count }))
      .sort((a, b) => b.access_count - a.access_count)
      .slice(0, 5);

    return {
      total_sessions: totalSessions,
      critical_sessions: criticalSessions,
      resolved_sessions: resolvedSessions,
      avg_duration_minutes: Math.round(avgDuration),
      most_used_techniques: mostUsedTechniques,
      most_accessed_resources: mostAccessedResources
    };
  }

  // =====================================================
  // CRISIS ANALYTICS
  // =====================================================

  async logCrisisAnalytics(analytics: Omit<CrisisAnalytics, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await supabase
      .from('crisis_analytics')
      .insert(analytics);

    if (error) {
      console.error('Erro ao registrar analytics de crise:', error);
      return false;
    }

    return true;
  }

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  async sendCrisisNotification(
    userId: string,
    crisisLevel: 'low' | 'medium' | 'high' | 'critical',
    sessionId: string
  ): Promise<void> {
    const { notificationsService } = await import('./notifications.service');
    
    const levelMessages = {
      low: 'Você está passando por um momento difícil. Que tal tentar uma técnica de relaxamento?',
      medium: 'Você está em uma crise emocional. Vamos trabalhar juntas para superar isso.',
      high: 'Você está em uma crise séria. Vamos usar todas as ferramentas disponíveis.',
      critical: 'Você está em uma crise crítica. Acesse os recursos de emergência imediatamente.'
    };

    await notificationsService.sendNotification('crisis_support', userId, {
      crisis_level: crisisLevel,
      session_id: sessionId,
      body: levelMessages[crisisLevel],
      priority: crisisLevel === 'critical' ? 'high' : 'normal'
    });
  }

  async sendFollowUpNotification(userId: string, sessionId: string): Promise<void> {
    const { notificationsService } = await import('./notifications.service');
    
    await notificationsService.sendNotification('crisis_followup', userId, {
      session_id: sessionId,
      body: 'Como você está se sentindo hoje? Precisa de mais apoio?'
    });
  }

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  getCrisisLevelColor(level: string): string {
    switch (level) {
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  }

  getCrisisLevelLabel(level: string): string {
    switch (level) {
      case 'low':
        return 'Baixo';
      case 'medium':
        return 'Médio';
      case 'high':
        return 'Alto';
      case 'critical':
        return 'Crítico';
      default:
        return 'Desconhecido';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'breathing':
        return '🫁';
      case 'grounding':
        return '🌱';
      case 'mindfulness':
        return '🧘';
      case 'physical':
        return '💪';
      case 'cognitive':
        return '🧠';
      case 'spiritual':
        return '🙏';
      default:
        return '💡';
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'breathing':
        return 'Respiração';
      case 'grounding':
        return 'Aterramento';
      case 'mindfulness':
        return 'Mindfulness';
      case 'physical':
        return 'Físico';
      case 'cognitive':
        return 'Cognitivo';
      case 'spiritual':
        return 'Espiritual';
      default:
        return 'Geral';
    }
  }
}

// Exportar instância singleton
export const sosEmotionalService = SosEmotionalService.getInstance();
export default sosEmotionalService;
