// =====================================================
// CLUBNATH NOTIFICATIONS SERVICE
// Sistema de Notificações Push Inteligentes
// =====================================================

import { supabase } from '../lib/supabase';

export interface NotificationPreferences {
  id?: string;
  user_id: string;
  daily_quotes: boolean;
  feed_highlights: boolean;
  social_interactions: boolean;
  engagement_reminders: boolean;
  premium_offers: boolean;
  prayer_notifications: boolean;
  journal_reminders: boolean;
  sos_followup: boolean;
  quiet_hours_start: string; // "22:00"
  quiet_hours_end: string;   // "07:00"
  timezone: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'daily_quote' | 'feed_highlight' | 'social' | 'engagement' | 'premium' | 'prayer' | 'journal' | 'sos';
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  scheduled_time?: string; // HH:MM format
  priority: 'low' | 'normal' | 'high';
  requires_interaction?: boolean;
}

export interface NotificationLog {
  id?: string;
  user_id: string;
  notification_type: string;
  title: string;
  body: string;
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
}

class NotificationsService {
  private static instance: NotificationsService;
  private serviceWorker: ServiceWorker | null = null;
  private vapidKey: string | null = null;

  private constructor() {
    this.initializeServiceWorker();
  }

  public static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.serviceWorker = registration.active;
        console.log('Service Worker registrado:', registration);
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }

  // =====================================================
  // PERMISSÕES E CONFIGURAÇÃO
  // =====================================================

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador não suporta notificações');
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      await this.subscribeToPush();
    }

    return permission;
  }

  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push messaging não é suportado');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.vapidKey
      });

      // Salvar subscription no Supabase
      await this.saveSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Erro ao subscrever push:', error);
      return null;
    }
  }

  private async saveSubscription(subscription: PushSubscription) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        subscription: subscription.toJSON(),
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao salvar subscription:', error);
    }
  }

  // =====================================================
  // PREFERÊNCIAS DO USUÁRIO
  // =====================================================

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | null> {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar preferências:', error);
      return null;
    }

    return data || this.getDefaultPreferences(userId);
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao atualizar preferências:', error);
      return false;
    }

    return true;
  }

  private getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      user_id: userId,
      daily_quotes: true,
      feed_highlights: true,
      social_interactions: true,
      engagement_reminders: true,
      premium_offers: false,
      prayer_notifications: true,
      journal_reminders: true,
      sos_followup: true,
      quiet_hours_start: '22:00',
      quiet_hours_end: '07:00',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  // =====================================================
  // TEMPLATES DE NOTIFICAÇÃO
  // =====================================================

  private getNotificationTemplates(): Record<string, NotificationTemplate> {
    return {
      daily_quote: {
        id: 'daily_quote',
        type: 'daily_quote',
        title: '💜 Frase do Dia - Nossa Maternidade',
        body: 'Sua dose diária de inspiração está pronta!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        scheduled_time: '08:00',
        priority: 'normal'
      },
      feed_highlight: {
        id: 'feed_highlight',
        type: 'feed_highlight',
        title: '✨ Destaque do Feed',
        body: 'Veja o que está rolando na Nossa Maternidade hoje!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        scheduled_time: '20:00',
        priority: 'normal'
      },
      social_interaction: {
        id: 'social_interaction',
        type: 'social',
        title: '💬 Nova Interação',
        body: 'Alguém interagiu com seu post!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        priority: 'normal'
      },
      engagement_reminder: {
        id: 'engagement_reminder',
        type: 'engagement',
        title: '💜 Sentimos sua falta!',
        body: 'Veja o que rolou na Nossa Maternidade enquanto você estava fora',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        priority: 'low'
      },
      prayer_notification: {
        id: 'prayer_notification',
        type: 'prayer',
        title: '🙏 Nova Oração',
        body: 'Uma mãe precisa de suas orações',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        priority: 'normal'
      },
      journal_reminder: {
        id: 'journal_reminder',
        type: 'journal',
        title: '📝 Hora do Journaling',
        body: 'Que tal refletir sobre seu dia?',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        priority: 'normal'
      },
      sos_followup: {
        id: 'sos_followup',
        type: 'sos',
        title: '💜 Como você está hoje?',
        body: 'Esperamos que esteja se sentindo melhor',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        priority: 'high',
        requires_interaction: true
      }
    };
  }

  // =====================================================
  // ENVIO DE NOTIFICAÇÕES
  // =====================================================

  async sendNotification(templateId: string, userId: string, customData?: Record<string, any>): Promise<boolean> {
    const templates = this.getNotificationTemplates();
    const template = templates[templateId];

    if (!template) {
      console.error('Template não encontrado:', templateId);
      return false;
    }

    // Verificar preferências do usuário
    const preferences = await this.getNotificationPreferences(userId);
    if (!preferences || !this.isNotificationEnabled(template.type, preferences)) {
      return false;
    }

    // Verificar horário silencioso
    if (this.isQuietHours(preferences)) {
      return false;
    }

    // Enviar notificação
    const notificationData = {
      ...template,
      ...customData,
      user_id: userId
    };

    try {
      // Notificação local
      await this.sendLocalNotification(notificationData);

      // Log da notificação
      await this.logNotification(userId, templateId, template.title, template.body);

      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  }

  private async sendLocalNotification(data: any) {
    if (this.serviceWorker) {
      this.serviceWorker.postMessage({
        type: 'SEND_NOTIFICATION',
        data
      });
    } else {
      // Fallback para notificação direta
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.body,
          icon: data.icon,
          badge: data.badge,
          tag: data.id,
          data: data.data
        });
      }
    }
  }

  private isNotificationEnabled(type: string, preferences: NotificationPreferences): boolean {
    switch (type) {
      case 'daily_quote': return preferences.daily_quotes;
      case 'feed_highlight': return preferences.feed_highlights;
      case 'social': return preferences.social_interactions;
      case 'engagement': return preferences.engagement_reminders;
      case 'premium': return preferences.premium_offers;
      case 'prayer': return preferences.prayer_notifications;
      case 'journal': return preferences.journal_reminders;
      case 'sos': return preferences.sos_followup;
      default: return false;
    }
  }

  private isQuietHours(preferences: NotificationPreferences): boolean {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
    const start = preferences.quiet_hours_start;
    const end = preferences.quiet_hours_end;

    // Se start > end, significa que cruza meia-noite
    if (start > end) {
      return currentTime >= start || currentTime <= end;
    } else {
      return currentTime >= start && currentTime <= end;
    }
  }

  // =====================================================
  // LOGS E ANALYTICS
  // =====================================================

  private async logNotification(
    userId: string,
    type: string,
    title: string,
    body: string
  ): Promise<void> {
    const { error } = await supabase
      .from('notification_logs')
      .insert({
        user_id: userId,
        notification_type: type,
        title,
        body,
        sent_at: new Date().toISOString(),
        status: 'sent'
      });

    if (error) {
      console.error('Erro ao logar notificação:', error);
    }
  }

  async markNotificationOpened(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notification_logs')
      .update({
        opened_at: new Date().toISOString(),
        status: 'opened'
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao marcar notificação como aberta:', error);
    }
  }

  async markNotificationClicked(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notification_logs')
      .update({
        clicked_at: new Date().toISOString(),
        status: 'clicked'
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Erro ao marcar notificação como clicada:', error);
    }
  }

  // =====================================================
  // NOTIFICAÇÕES PROGRAMADAS
  // =====================================================

  async scheduleDailyNotifications(userId: string): Promise<void> {
    const preferences = await this.getNotificationPreferences(userId);
    if (!preferences) return;

    // Agendar notificação da frase do dia
    if (preferences.daily_quotes) {
      await this.scheduleNotification(userId, 'daily_quote', '08:00');
    }

    // Agendar destaque do feed
    if (preferences.feed_highlights) {
      await this.scheduleNotification(userId, 'feed_highlight', '20:00');
    }

    // Agendar lembrete de journaling
    if (preferences.journal_reminders) {
      await this.scheduleNotification(userId, 'journal_reminder', '21:00');
    }
  }

  private async scheduleNotification(userId: string, templateId: string, time: string): Promise<void> {
    // Implementar agendamento usando setTimeout ou biblioteca de cron
    // Por enquanto, vamos usar uma abordagem simples
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Se o horário já passou hoje, agendar para amanhã
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    setTimeout(async () => {
      await this.sendNotification(templateId, userId);
      // Reagendar para o próximo dia
      this.scheduleNotification(userId, templateId, time);
    }, delay);
  }

  // =====================================================
  // NOTIFICAÇÕES INTELIGENTES
  // =====================================================

  async sendEngagementReminder(userId: string): Promise<void> {
    // Verificar última atividade do usuário
    const { data: lastActivity } = await supabase
      .from('user_activity')
      .select('last_active_at')
      .eq('user_id', userId)
      .single();

    if (!lastActivity) return;

    const lastActive = new Date(lastActivity.last_active_at);
    const daysSinceLastActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));

    // Enviar lembrete se não ativo há mais de 2 dias
    if (daysSinceLastActive >= 2) {
      await this.sendNotification('engagement_reminder', userId, {
        days_inactive: daysSinceLastActive
      });
    }
  }

  async sendSocialNotification(userId: string, interactionType: string, data: any): Promise<void> {
    const templates = this.getNotificationTemplates();
    const template = templates.social_interaction;

    const customBody = this.getSocialNotificationBody(interactionType, data);

    await this.sendNotification('social_interaction', userId, {
      body: customBody,
      data: {
        interaction_type: interactionType,
        ...data
      }
    });
  }

  private getSocialNotificationBody(type: string, data: any): string {
    switch (type) {
      case 'like':
        return `${data.user_name} curtiu seu post! 💜`;
      case 'comment':
        return `${data.user_name} comentou no seu post! 💬`;
      case 'prayer_amen':
        return `${data.count} mães disseram Amém na sua oração! 🙏`;
      case 'follow':
        return `${data.user_name} começou a te seguir! ✨`;
      default:
        return 'Nova interação na Nossa Maternidade! 💜';
    }
  }
}

// Exportar instância singleton
export const notificationsService = NotificationsService.getInstance();
export default notificationsService;
