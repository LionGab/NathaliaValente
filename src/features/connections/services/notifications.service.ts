import { supabase } from '../../../lib/supabase';
import { trackEngagement } from '../../../lib/analytics';

export interface ConnectionNotification {
    id: string;
    user_id: string;
    type: 'connection_request' | 'connection_accepted' | 'new_match';
    title: string;
    message: string;
    data?: {
        from_user_id?: string;
        from_user_name?: string;
        from_user_avatar?: string;
        connection_id?: string;
    };
    is_read: boolean;
    created_at: string;
}

class ConnectionNotificationsService {
    /**
     * Send a connection request notification
     */
    async sendConnectionRequestNotification(
        toUserId: string,
        fromUserId: string,
        fromUserName: string,
        fromUserAvatar?: string
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('notifications')
                .insert({
                    user_id: toUserId,
                    type: 'connection_request',
                    title: 'Nova solicitação de conexão',
                    message: `${fromUserName} quer se conectar com você!`,
                    data: {
                        from_user_id: fromUserId,
                        from_user_name: fromUserName,
                        from_user_avatar: fromUserAvatar
                    },
                    is_read: false
                });

            if (error) {
                console.error('Error sending connection request notification:', error);
                return;
            }

            // Track engagement
            trackEngagement('notification_sent', 'connections', toUserId, 1);

            // Send push notification if available
            await this.sendPushNotification(toUserId, {
                title: 'Nova solicitação de conexão',
                body: `${fromUserName} quer se conectar com você!`,
                icon: fromUserAvatar || '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                data: {
                    type: 'connection_request',
                    from_user_id: fromUserId
                }
            });
        } catch (error) {
            console.error('Error sending connection request notification:', error);
        }
    }

    /**
     * Send a connection accepted notification
     */
    async sendConnectionAcceptedNotification(
        toUserId: string,
        fromUserId: string,
        fromUserName: string,
        connectionId: string
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('notifications')
                .insert({
                    user_id: toUserId,
                    type: 'connection_accepted',
                    title: 'Conexão aceita!',
                    message: `${fromUserName} aceitou sua solicitação de conexão. Vocês agora estão conectadas!`,
                    data: {
                        from_user_id: fromUserId,
                        from_user_name: fromUserName,
                        connection_id: connectionId
                    },
                    is_read: false
                });

            if (error) {
                console.error('Error sending connection accepted notification:', error);
                return;
            }

            // Track engagement
            trackEngagement('notification_sent', 'connections', toUserId, 1);

            // Send push notification
            await this.sendPushNotification(toUserId, {
                title: 'Conexão aceita!',
                body: `${fromUserName} aceitou sua solicitação de conexão.`,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                data: {
                    type: 'connection_accepted',
                    connection_id: connectionId
                }
            });
        } catch (error) {
            console.error('Error sending connection accepted notification:', error);
        }
    }

    /**
     * Send a new match notification
     */
    async sendNewMatchNotification(
        userId: string,
        matchUserName: string,
        compatibility: number
    ): Promise<void> {
        try {
            const { error } = await supabase
                .from('notifications')
                .insert({
                    user_id: userId,
                    type: 'new_match',
                    title: 'Nova conexão encontrada!',
                    message: `Encontramos ${matchUserName} com ${compatibility}% de compatibilidade!`,
                    data: {
                        from_user_name: matchUserName,
                        compatibility
                    },
                    is_read: false
                });

            if (error) {
                console.error('Error sending new match notification:', error);
                return;
            }

            // Track engagement
            trackEngagement('notification_sent', 'connections', userId, 1);

            // Send push notification
            await this.sendPushNotification(userId, {
                title: 'Nova conexão encontrada!',
                body: `Encontramos ${matchUserName} com ${compatibility}% de compatibilidade!`,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-192x192.png',
                data: {
                    type: 'new_match',
                    compatibility
                }
            });
        } catch (error) {
            console.error('Error sending new match notification:', error);
        }
    }

    /**
     * Get user notifications
     */
    async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<ConnectionNotification[]> {
        try {
            let query = supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .in('type', ['connection_request', 'connection_accepted', 'new_match'])
                .order('created_at', { ascending: false });

            if (unreadOnly) {
                query = query.eq('is_read', false);
            }

            const { data, error } = await query.limit(50);

            if (error) {
                console.error('Error fetching notifications:', error);
                return [];
            }

            return data as ConnectionNotification[];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    /**
     * Mark notification as read
     */
    async markNotificationAsRead(notificationId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) {
                console.error('Error marking notification as read:', error);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }

    /**
     * Mark all notifications as read
     */
    async markAllNotificationsAsRead(userId: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', userId)
                .in('type', ['connection_request', 'connection_accepted', 'new_match']);

            if (error) {
                console.error('Error marking all notifications as read:', error);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }

    /**
     * Send push notification using Web Push API
     */
    private async sendPushNotification(
        userId: string,
        notification: {
            title: string;
            body: string;
            icon?: string;
            badge?: string;
            data?: any;
        }
    ): Promise<void> {
        try {
            // Check if service worker and push manager are available
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                console.log('Push notifications not supported');
                return;
            }

            // Get user's push subscription
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                console.log('No push subscription found');
                return;
            }

            // Send push notification via Supabase Edge Function
            const { error } = await supabase.functions.invoke('send-push-notification', {
                body: {
                    subscription,
                    notification
                }
            });

            if (error) {
                console.error('Error sending push notification:', error);
            }
        } catch (error) {
            console.error('Error sending push notification:', error);
        }
    }

    /**
     * Request push notification permission
     */
    async requestNotificationPermission(): Promise<boolean> {
        try {
            if (!('Notification' in window)) {
                console.log('Notifications not supported');
                return false;
            }

            if (Notification.permission === 'granted') {
                return true;
            }

            if (Notification.permission === 'denied') {
                return false;
            }

            const permission = await Notification.requestPermission();
            return permission === 'granted';
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            return false;
        }
    }

    /**
     * Subscribe to push notifications
     */
    async subscribeToPushNotifications(userId: string): Promise<boolean> {
        try {
            const hasPermission = await this.requestNotificationPermission();
            if (!hasPermission) {
                return false;
            }

            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
            });

            // Save subscription to database
            const { error } = await supabase
                .from('push_subscriptions')
                .upsert({
                    user_id: userId,
                    subscription: subscription.toJSON(),
                    created_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error saving push subscription:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
            return false;
        }
    }
}

export const connectionNotificationsService = new ConnectionNotificationsService();
