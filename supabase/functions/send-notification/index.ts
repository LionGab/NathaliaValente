import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.76.0';
import type {
  SendNotificationRequest,
  SendNotificationResponse,
  NotificationPreferences,
  NotificationTemplate,
  PushToken,
  NotificationPayload,
  FCMPayload,
} from '../shared/notification-types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Initialize Supabase client with service role
 */
function getSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Replace template variables with actual values
 */
function populateTemplate(template: string, data: Record<string, unknown>): string {
  let result = template;

  Object.keys(data).forEach((key) => {
    const value = data[key] ?? '';
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, String(value));
  });

  return result;
}

/**
 * Check if user is currently in quiet hours
 */
async function isInQuietHours(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_in_quiet_hours', {
    p_user_id: userId,
    p_check_time: new Date().toISOString(),
  });

  if (error) {
    console.error('Error checking quiet hours:', error);
    return false;
  }

  return data === true;
}

/**
 * Check if notification rate limit has been exceeded
 */
async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  category: string,
  maxPerDay: number
): Promise<boolean> {
  const { data, error } = await supabase.rpc('check_notification_rate_limit', {
    p_user_id: userId,
    p_category: category,
    p_max_per_day: maxPerDay,
  });

  if (error) {
    console.error('Error checking rate limit:', error);
    return true; // Allow by default if check fails
  }

  return data === true;
}

/**
 * Get user notification preferences
 */
async function getUserPreferences(
  supabase: SupabaseClient,
  userId: string
): Promise<NotificationPreferences | null> {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }

  return data;
}

/**
 * Get notification template
 */
async function getTemplate(
  supabase: SupabaseClient,
  templateKey: string
): Promise<NotificationTemplate | null> {
  const { data, error } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('template_key', templateKey)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching template:', error);
    return null;
  }

  return data;
}

/**
 * Get user's active push tokens
 */
async function getPushTokens(
  supabase: SupabaseClient,
  userId: string
): Promise<PushToken[]> {
  const { data, error } = await supabase
    .from('push_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching push tokens:', error);
    return [];
  }

  return data || [];
}

/**
 * Send push notification via Firebase Cloud Messaging
 */
async function sendFCMNotification(
  token: string,
  payload: NotificationPayload
): Promise<boolean> {
  const fcmServerKey = Deno.env.get('FCM_SERVER_KEY');

  if (!fcmServerKey) {
    console.warn('FCM_SERVER_KEY not configured, skipping FCM push');
    return false;
  }

  const fcmPayload: FCMPayload = {
    token,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data
      ? Object.fromEntries(
          Object.entries(payload.data).map(([k, v]) => [k, String(v)])
        )
      : undefined,
    android: {
      priority: payload.priority === 'high' ? 'high' : 'normal',
      ttl: payload.ttl || 86400,
      notification: {
        sound: 'default',
        color: '#FF69B4',
        icon: 'ic_notification',
      },
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title: payload.title,
            body: payload.body,
          },
          badge: payload.badge,
          sound: 'default',
        },
      },
    },
    webpush: {
      notification: {
        title: payload.title,
        body: payload.body,
        icon: '/logo-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
      },
    },
  };

  try {
    const response = await fetch('https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fcmServerKey}`,
      },
      body: JSON.stringify({ message: fcmPayload }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('FCM error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending FCM notification:', error);
    return false;
  }
}

/**
 * Send push notification via OneSignal
 */
async function sendOneSignalNotification(
  userId: string,
  payload: NotificationPayload
): Promise<boolean> {
  const oneSignalAppId = Deno.env.get('ONESIGNAL_APP_ID');
  const oneSignalApiKey = Deno.env.get('ONESIGNAL_API_KEY');

  if (!oneSignalAppId || !oneSignalApiKey) {
    console.warn('OneSignal not configured, skipping OneSignal push');
    return false;
  }

  const oneSignalPayload = {
    app_id: oneSignalAppId,
    include_external_user_ids: [userId],
    headings: {
      en: payload.title,
      'pt-BR': payload.title,
    },
    contents: {
      en: payload.body,
      'pt-BR': payload.body,
    },
    data: payload.data,
    priority: payload.priority === 'high' ? 10 : 5,
    ttl: payload.ttl || 86400,
    android_channel_id: 'clubnath-notifications',
    ios_badgeType: 'Increase',
    ios_badgeCount: 1,
  };

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${oneSignalApiKey}`,
      },
      body: JSON.stringify(oneSignalPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OneSignal error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending OneSignal notification:', error);
    return false;
  }
}

/**
 * Send push notification via Web Push API
 */
async function sendWebPushNotification(
  token: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _payload: NotificationPayload
): Promise<boolean> {
  const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
  const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn('Web Push not configured, skipping Web Push');
    return false;
  }

  // Web Push implementation would go here
  // For now, we'll use a placeholder
  console.log('Web Push would be sent to:', token);
  return true;
}

/**
 * Send push notification to all user's devices
 */
async function sendPushNotifications(
  supabase: SupabaseClient,
  userId: string,
  payload: NotificationPayload
): Promise<number> {
  const tokens = await getPushTokens(supabase, userId);

  if (tokens.length === 0) {
    console.warn('No push tokens found for user:', userId);
    return 0;
  }

  let sentCount = 0;
  const oneSignalAppId = Deno.env.get('ONESIGNAL_APP_ID');

  // If OneSignal is configured, use it (simplest option)
  if (oneSignalAppId) {
    const success = await sendOneSignalNotification(userId, payload);
    return success ? 1 : 0;
  }

  // Otherwise, send to each token via FCM or Web Push
  for (const tokenData of tokens) {
    let success = false;

    if (tokenData.platform === 'web') {
      success = await sendWebPushNotification(tokenData.token, payload);
    } else {
      success = await sendFCMNotification(tokenData.token, payload);
    }

    if (success) {
      sentCount++;

      // Update last_used_at
      await supabase
        .from('push_tokens')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', tokenData.id);
    } else {
      // If token is invalid, mark as inactive
      await supabase
        .from('push_tokens')
        .update({ is_active: false })
        .eq('id', tokenData.id);
    }
  }

  return sentCount;
}

/**
 * Log notification to history
 */
async function logNotificationHistory(
  supabase: SupabaseClient,
  userId: string,
  templateKey: string | null,
  title: string,
  body: string,
  deepLink: string | null,
  deliveryMethod: string,
  status: string,
  data: Record<string, unknown> | null,
  rateLimitKey: string | null,
  errorMessage: string | null = null
): Promise<string> {
  const { data: historyData, error } = await supabase
    .from('notification_history')
    .insert({
      user_id: userId,
      template_key: templateKey,
      title,
      body,
      deep_link: deepLink,
      delivery_method: deliveryMethod,
      status,
      data,
      rate_limit_key: rateLimitKey,
      error_message: errorMessage,
      sent_at: status === 'sent' ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error logging notification history:', error);
    throw error;
  }

  return historyData.id;
}

/**
 * Main notification sending logic
 */
async function sendNotification(
  request: SendNotificationRequest
): Promise<SendNotificationResponse> {
  const supabase = getSupabaseClient();

  try {
    // 1. Get user preferences
    const preferences = await getUserPreferences(supabase, request.user_id);

    if (!preferences) {
      return {
        success: false,
        message: 'User preferences not found',
        skipped_reason: 'USER_NOT_FOUND',
      };
    }

    // 2. Get template (if template_key provided)
    let template: NotificationTemplate | null = null;
    let title = request.custom_title || '';
    let body = request.custom_body || '';
    let deepLink = request.custom_deep_link || null;
    let category = '';
    let priority = request.priority || 'normal';

    if (request.template_key) {
      template = await getTemplate(supabase, request.template_key);

      if (!template) {
        return {
          success: false,
          message: 'Template not found',
          skipped_reason: 'TEMPLATE_NOT_FOUND',
        };
      }

      // Populate template with data
      title = populateTemplate(template.title_template, request.template_data || {});
      body = populateTemplate(template.body_template, request.template_data || {});
      deepLink = template.deep_link_pattern
        ? populateTemplate(template.deep_link_pattern, request.template_data || {})
        : null;
      category = template.category;
      priority = template.priority;
    }

    // 3. Check if scheduled
    if (request.scheduled_for) {
      const { data: scheduleData, error } = await supabase
        .from('notification_schedule')
        .insert({
          user_id: request.user_id,
          template_key: request.template_key,
          scheduled_for: request.scheduled_for,
          template_data: request.template_data || {},
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        scheduled_id: scheduleData.id,
        message: 'Notification scheduled successfully',
      };
    }

    // 4. Check user preferences for this category
    if (category) {
      const categoryPreferenceKey = `enable_${category}` as keyof NotificationPreferences;
      if (
        categoryPreferenceKey in preferences &&
        !preferences[categoryPreferenceKey]
      ) {
        return {
          success: false,
          message: 'User has disabled this notification category',
          skipped_reason: 'USER_PREFERENCES_DISABLED',
        };
      }
    }

    // 5. Check quiet hours
    const inQuietHours = await isInQuietHours(supabase, request.user_id);
    if (inQuietHours && priority !== 'high') {
      // Schedule for after quiet hours instead
      const now = new Date();
      const quietEnd = preferences.quiet_hours_end || '07:00:00';
      const [hours, minutes] = quietEnd.split(':').map(Number);

      const scheduledTime = new Date(now);
      scheduledTime.setHours(hours, minutes, 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const { data: scheduleData, error } = await supabase
        .from('notification_schedule')
        .insert({
          user_id: request.user_id,
          template_key: request.template_key,
          scheduled_for: scheduledTime.toISOString(),
          template_data: request.template_data || {},
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        scheduled_id: scheduleData.id,
        message: 'User in quiet hours, notification scheduled for later',
        skipped_reason: 'QUIET_HOURS',
      };
    }

    // 6. Check rate limits
    if (category) {
      const maxPerDayKey = `max_${category === 'community_activity' ? 'community' : category === 'new_content' ? 'content' : 'reminders'}_per_day` as keyof NotificationPreferences;
      const maxPerDay =
        maxPerDayKey in preferences
          ? (preferences[maxPerDayKey] as number)
          : 10;

      const canSend = await checkRateLimit(
        supabase,
        request.user_id,
        category,
        maxPerDay
      );

      if (!canSend && priority !== 'high') {
        return {
          success: false,
          message: 'Rate limit exceeded for this category',
          skipped_reason: 'RATE_LIMIT_EXCEEDED',
        };
      }
    }

    // 7. Prepare notification payload
    const payload: NotificationPayload = {
      title,
      body,
      data: {
        deep_link: deepLink || undefined,
        category: category || undefined,
        ...(request.template_data || {}),
      },
      priority,
      ttl: template?.ttl_seconds || 86400,
    };

    // 8. Send notifications based on delivery method
    const deliveryMethod = request.delivery_method || 'all';
    let sentCount = 0;
    let notificationId: string | null = null;
    const rateLimitKey = category
      ? `${request.user_id}:${category}:${new Date().toISOString().split('T')[0]}`
      : null;

    if (
      (deliveryMethod === 'push' || deliveryMethod === 'all') &&
      preferences.enable_push
    ) {
      const pushSent = await sendPushNotifications(
        supabase,
        request.user_id,
        payload
      );
      sentCount += pushSent;

      if (pushSent > 0) {
        notificationId = await logNotificationHistory(
          supabase,
          request.user_id,
          request.template_key || null,
          title,
          body,
          deepLink,
          'push',
          'sent',
          request.template_data || null,
          rateLimitKey
        );
      }
    }

    // In-app notification (always store)
    if (
      (deliveryMethod === 'in_app' || deliveryMethod === 'all') &&
      preferences.enable_in_app
    ) {
      const inAppId = await logNotificationHistory(
        supabase,
        request.user_id,
        request.template_key || null,
        title,
        body,
        deepLink,
        'in_app',
        'sent',
        request.template_data || null,
        rateLimitKey
      );

      if (!notificationId) {
        notificationId = inAppId;
      }
      sentCount++;
    }

    // Email notification (placeholder for future implementation)
    if (
      (deliveryMethod === 'email' || deliveryMethod === 'all') &&
      preferences.enable_email
    ) {
      // Email sending would be implemented here
      console.log('Email notification would be sent');
    }

    if (sentCount === 0) {
      return {
        success: false,
        message: 'No notifications sent - no active delivery methods',
        skipped_reason: 'NO_DELIVERY_METHODS',
      };
    }

    return {
      success: true,
      notification_id: notificationId || undefined,
      message: `Notification sent successfully via ${sentCount} method(s)`,
      sent_count: sentCount,
    };
  } catch (error) {
    console.error('Error sending notification:', error);

    return {
      success: false,
      message: error.message || 'Unknown error occurred',
      skipped_reason: 'ERROR',
    };
  }
}

// ============================================================================
// EDGE FUNCTION HANDLER
// ============================================================================

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const request: SendNotificationRequest = await req.json();

    // Validate request
    if (!request.user_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'user_id is required',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    if (!request.template_key && !request.custom_title) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Either template_key or custom_title is required',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Send notification
    const result = await sendNotification(request);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error('Error in send-notification function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
