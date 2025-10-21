/**
 * ClubNath Notification System - Usage Examples
 *
 * This file contains practical examples of how to send personalized notifications
 * for different scenarios in the ClubNath app.
 */

import type { SendNotificationRequest } from '../shared/notification-types.ts';

// ============================================================================
// Example 1: New Comment Notification
// ============================================================================

/**
 * Send notification when someone comments on a user's post
 */
export async function notifyNewComment(
  postAuthorId: string,
  commenterName: string,
  commentContent: string,
  postId: string,
  postCaption: string
) {
  const request: SendNotificationRequest = {
    user_id: postAuthorId,
    template_key: 'new_comment',
    template_data: {
      commenter_name: commenterName,
      comment_content:
        commentContent.length > 50
          ? commentContent.substring(0, 50) + '...'
          : commentContent,
      post_id: postId,
      post_caption: postCaption,
    },
    priority: 'normal',
  };

  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/send-notification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
      body: JSON.stringify(request),
    }
  );

  return await response.json();
}

// ============================================================================
// Example 2: Morning Encouragement
// ============================================================================

/**
 * Send personalized morning encouragement based on user's recent activity
 */
export async function sendMorningEncouragement(
  userId: string,
  userName: string,
  recentPostCategory?: string
) {
  // Fetch user's recent posts to personalize message
  let quoteContent = 'Você é mais forte do que imagina, mãe. Cada dia é uma vitória de amor.';
  let quoteAuthor = 'ClubNath';

  // Personalize based on recent activity
  if (recentPostCategory === 'Desabafo') {
    quoteContent = `${userName}, sua coragem em compartilhar suas emoções inspira outras mães. Continue sendo autêntica!`;
  } else if (recentPostCategory === 'Fé') {
    quoteContent = 'Sua fé move montanhas. Continue confiando e compartilhando sua luz!';
  }

  const request: SendNotificationRequest = {
    user_id: userId,
    template_key: 'morning_encouragement',
    template_data: {
      quote_content: quoteContent,
      quote_author: quoteAuthor,
    },
    scheduled_for: calculateMorningTime(userId), // Schedule for user's preferred morning time
  };

  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/send-notification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
      body: JSON.stringify(request),
    }
  );

  return await response.json();
}

// ============================================================================
// Example 3: Habit Reminder (Journaling)
// ============================================================================

/**
 * Send reminder to journal emotions
 */
export async function sendJournalReminder(userId: string, userName: string) {
  const request: SendNotificationRequest = {
    user_id: userId,
    template_key: 'journal_reminder',
    delivery_method: 'push', // Only push, not email
  };

  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/send-notification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
      body: JSON.stringify(request),
    }
  );

  return await response.json();
}

// ============================================================================
// Example 4: Nathy Badge Received
// ============================================================================

/**
 * Notify user when they receive a Nathy badge
 */
export async function notifyNathyBadge(
  userId: string,
  postId: string,
  postCaption: string
) {
  const request: SendNotificationRequest = {
    user_id: userId,
    template_key: 'nathy_badge_received',
    template_data: {
      post_id: postId,
      post_caption:
        postCaption.length > 60 ? postCaption.substring(0, 60) + '...' : postCaption,
    },
    priority: 'high', // High priority for special achievements
  };

  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/send-notification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
      body: JSON.stringify(request),
    }
  );

  return await response.json();
}

// ============================================================================
// Example 5: New Post in Followed Category
// ============================================================================

/**
 * Notify users when there's a new post in categories they follow
 */
export async function notifyNewPostInCategory(
  userId: string,
  category: string,
  authorName: string,
  postCaption: string,
  postId: string
) {
  const request: SendNotificationRequest = {
    user_id: userId,
    template_key: 'new_post_in_category',
    template_data: {
      category_name: category,
      author_name: authorName,
      post_caption:
        postCaption.length > 80 ? postCaption.substring(0, 80) + '...' : postCaption,
      post_id: postId,
    },
    priority: 'low', // Low priority for content discovery
  };

  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/send-notification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
      body: JSON.stringify(request),
    }
  );

  return await response.json();
}

// ============================================================================
// Example 6: Custom Notification (No Template)
// ============================================================================

/**
 * Send a custom notification without using a template
 */
export async function sendCustomNotification(
  userId: string,
  title: string,
  body: string,
  deepLink?: string
) {
  const request: SendNotificationRequest = {
    user_id: userId,
    custom_title: title,
    custom_body: body,
    custom_deep_link: deepLink,
    priority: 'normal',
  };

  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/send-notification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
      body: JSON.stringify(request),
    }
  );

  return await response.json();
}

// ============================================================================
// Example 7: Recurring Daily Encouragement
// ============================================================================

/**
 * Schedule recurring daily encouragement for a user
 */
export async function scheduleRecurringEncouragement(userId: string) {
  const request: SendNotificationRequest = {
    user_id: userId,
    template_key: 'morning_encouragement',
    template_data: {
      quote_content: 'Você está fazendo um trabalho incrível, mãe! ❤️',
      quote_author: 'ClubNath',
    },
    scheduled_for: calculateMorningTime(userId),
    // Note: recurrence is handled by the schedule table
  };

  const response = await fetch(
    'https://your-project.supabase.co/functions/v1/send-notification',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer YOUR_SUPABASE_ANON_KEY',
      },
      body: JSON.stringify(request),
    }
  );

  return await response.json();
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate user's preferred morning time
 */
function calculateMorningTime(userId: string): string {
  // This would fetch user's preferred_time_morning from notification_preferences
  // For now, return tomorrow at 8 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);
  return tomorrow.toISOString();
}

// ============================================================================
// Integration Examples with ClubNath App Events
// ============================================================================

/**
 * Example: Trigger notifications from Supabase Database Triggers
 *
 * You can create database triggers to automatically send notifications:
 *
 * 1. When a new comment is created:
 *
 * CREATE OR REPLACE FUNCTION notify_new_comment()
 * RETURNS TRIGGER AS $$
 * DECLARE
 *   v_post_author_id uuid;
 *   v_commenter_name text;
 * BEGIN
 *   -- Get post author
 *   SELECT user_id INTO v_post_author_id
 *   FROM posts WHERE id = NEW.post_id;
 *
 *   -- Don't notify if commenting on own post
 *   IF v_post_author_id = NEW.user_id THEN
 *     RETURN NEW;
 *   END IF;
 *
 *   -- Get commenter name
 *   SELECT full_name INTO v_commenter_name
 *   FROM profiles WHERE id = NEW.user_id;
 *
 *   -- Call Edge Function via HTTP
 *   PERFORM net.http_post(
 *     url := 'https://your-project.supabase.co/functions/v1/send-notification',
 *     headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
 *     body := jsonb_build_object(
 *       'user_id', v_post_author_id,
 *       'template_key', 'new_comment',
 *       'template_data', jsonb_build_object(
 *         'commenter_name', v_commenter_name,
 *         'comment_content', NEW.content,
 *         'post_id', NEW.post_id
 *       )
 *     )
 *   );
 *
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql SECURITY DEFINER;
 *
 * CREATE TRIGGER on_comment_created
 *   AFTER INSERT ON comments
 *   FOR EACH ROW
 *   EXECUTE FUNCTION notify_new_comment();
 */

/**
 * Example: Client-side integration (React/TypeScript)
 *
 * import { supabase } from './supabaseClient';
 *
 * // Register push token when user logs in
 * async function registerPushToken(token: string, platform: 'ios' | 'android' | 'web') {
 *   const { data: { user } } = await supabase.auth.getUser();
 *
 *   if (!user) return;
 *
 *   await supabase.from('push_tokens').upsert({
 *     user_id: user.id,
 *     token,
 *     platform,
 *     is_active: true,
 *   });
 * }
 *
 * // Update notification preferences
 * async function updateNotificationPreferences(preferences: Partial<NotificationPreferences>) {
 *   const { data: { user } } = await supabase.auth.getUser();
 *
 *   if (!user) return;
 *
 *   await supabase
 *     .from('notification_preferences')
 *     .update(preferences)
 *     .eq('user_id', user.id);
 * }
 *
 * // Mark notification as read
 * async function markNotificationRead(notificationId: string) {
 *   await supabase
 *     .from('notification_history')
 *     .update({ read_at: new Date().toISOString(), status: 'read' })
 *     .eq('id', notificationId);
 * }
 */
