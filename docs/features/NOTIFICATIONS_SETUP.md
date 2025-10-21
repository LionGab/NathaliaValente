# ClubNath Notifications System - Setup & Documentation

Complete guide for setting up and using the personalized notification system for ClubNath.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Edge Functions Deployment](#edge-functions-deployment)
6. [Push Notification Services](#push-notification-services)
7. [Integration Guide](#integration-guide)
8. [Usage Examples](#usage-examples)
9. [Testing](#testing)
10. [Rate Limiting & Security](#rate-limiting--security)
11. [Monitoring & Analytics](#monitoring--analytics)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The ClubNath notification system provides:

- **Personalized notifications** based on user activity and preferences
- **Multiple delivery methods**: Push notifications, in-app, email
- **Smart scheduling**: Quiet hours, optimal delivery times
- **Rate limiting**: Prevents notification fatigue
- **Template system**: Reusable notification templates with variable substitution
- **Analytics**: Track delivery and engagement metrics

### Notification Types

1. **Community Activity**: Comments, likes, badge awards
2. **Daily Encouragement**: Morning motivation, evening reflection
3. **Habit Reminders**: Journaling, self-care prompts
4. **New Content**: Posts in followed categories, trending content
5. **Chat Responses**: Robô Nath AI assistant notifications

---

## Architecture

```
┌─────────────────┐
│   Client App    │
│  (React/React   │
│    Native)      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│    Supabase Edge Functions          │
│  ┌──────────────────────────────┐   │
│  │  send-notification           │   │
│  │  - Validates request         │   │
│  │  - Checks preferences        │   │
│  │  - Applies rate limits       │   │
│  │  - Sends to push service     │   │
│  │  - Logs to history           │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  process-scheduled-          │   │
│  │  notifications               │   │
│  │  - Runs via cron (5 min)     │   │
│  │  - Processes due schedules   │   │
│  └──────────────────────────────┘   │
└─────────────┬───────────────────────┘
              │
              ▼
      ┌──────────────┐
      │  Push Service│
      │  - FCM       │
      │  - OneSignal │
      │  - Web Push  │
      └──────────────┘
```

### Database Schema

**Tables:**
- `notification_preferences`: User notification settings
- `notification_templates`: Reusable message templates
- `notification_history`: Log of all sent notifications
- `push_tokens`: Device tokens for push delivery
- `notification_schedule`: Scheduled/recurring notifications

---

## Database Setup

### 1. Run Migration

```bash
# Using Supabase CLI
supabase db push

# Or manually apply the migration
psql $DATABASE_URL -f supabase/migrations/20251021_notifications_system.sql
```

### 2. Verify Tables

Check that all tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'notification%';
```

Expected output:
- notification_preferences
- notification_templates
- notification_history
- push_tokens
- notification_schedule

### 3. Verify Default Templates

```sql
SELECT template_key, category, title_template
FROM notification_templates
WHERE is_active = true;
```

You should see 10 default templates.

---

## Environment Variables

### Required Variables

Add these to your Supabase project secrets:

```bash
# Supabase (automatically available in Edge Functions)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# For scheduled notifications cron job (optional security)
CRON_SECRET=your-random-secret-string
```

### Push Notification Service (Choose One or Multiple)

#### Option 1: Firebase Cloud Messaging (FCM)

```bash
FCM_SERVER_KEY=your-fcm-server-key
# Get from: Firebase Console > Project Settings > Cloud Messaging
```

#### Option 2: OneSignal (Recommended - Easiest)

```bash
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_API_KEY=your-onesignal-rest-api-key
# Get from: OneSignal Dashboard > Settings > Keys & IDs
```

#### Option 3: Web Push API

```bash
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
# Generate using: npx web-push generate-vapid-keys
```

### Setting Secrets in Supabase

```bash
# Using Supabase CLI
supabase secrets set ONESIGNAL_APP_ID=your-app-id
supabase secrets set ONESIGNAL_API_KEY=your-api-key

# Or via Supabase Dashboard:
# Project Settings > Edge Functions > Manage secrets
```

---

## Edge Functions Deployment

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Link to Your Project

```bash
supabase link --project-ref your-project-ref
```

### 3. Deploy Functions

```bash
# Deploy all functions
supabase functions deploy

# Or deploy individually
supabase functions deploy send-notification
supabase functions deploy process-scheduled-notifications
```

### 4. Verify Deployment

```bash
# List deployed functions
supabase functions list

# Test the function
curl -X POST \
  https://your-project.supabase.co/functions/v1/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "user_id": "test-user-id",
    "custom_title": "Test Notification",
    "custom_body": "This is a test!"
  }'
```

---

## Push Notification Services

### OneSignal Setup (Recommended)

OneSignal is the easiest option for cross-platform push notifications.

#### 1. Create OneSignal Account

1. Go to [OneSignal.com](https://onesignal.com)
2. Create a free account
3. Create a new app

#### 2. Configure Platforms

**For Web:**
1. Choose "Web Push"
2. Enter your site URL
3. Download OneSignal SDK files

**For iOS:**
1. Upload Apple Push Notification certificate (.p12)
2. Or use Token Authentication (recommended)

**For Android:**
1. Enter Firebase Server Key and Sender ID
2. Or use OneSignal's built-in FCM

#### 3. Get Credentials

From OneSignal Dashboard > Settings > Keys & IDs:
- App ID
- REST API Key

Add to Supabase secrets:
```bash
supabase secrets set ONESIGNAL_APP_ID=your-app-id
supabase secrets set ONESIGNAL_API_KEY=your-api-key
```

#### 4. Client Integration

**React Web:**
```typescript
import OneSignal from 'react-onesignal';

// Initialize OneSignal
OneSignal.init({
  appId: 'your-onesignal-app-id',
  allowLocalhostAsSecureOrigin: true, // For dev
});

// Set external user ID (your user's ID)
OneSignal.setExternalUserId(user.id);

// Get player ID and save to database
const playerId = await OneSignal.getPlayerId();
await supabase.from('push_tokens').upsert({
  user_id: user.id,
  token: playerId,
  platform: 'web',
  is_active: true,
});
```

**React Native:**
```typescript
import OneSignal from 'react-native-onesignal';

// Initialize
OneSignal.setAppId('your-onesignal-app-id');

// Set external user ID
OneSignal.setExternalUserId(user.id);

// Handle notification opened
OneSignal.setNotificationOpenedHandler((notification) => {
  console.log('Notification opened:', notification);
  // Navigate to deep link
});
```

### Firebase Cloud Messaging Setup

#### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project or select existing
3. Add your app (Web, iOS, Android)

#### 2. Get Server Key

1. Project Settings > Cloud Messaging
2. Copy "Server key"

```bash
supabase secrets set FCM_SERVER_KEY=your-server-key
```

#### 3. Client Integration

**Web:**
```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  projectId: "your-project-id",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();

  if (permission === 'granted') {
    const token = await getToken(messaging, {
      vapidKey: 'your-vapid-key'
    });

    // Save token to database
    await supabase.from('push_tokens').upsert({
      user_id: user.id,
      token,
      platform: 'web',
      is_active: true,
    });
  }
}

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log('Notification received:', payload);
});
```

---

## Integration Guide

### 1. Register Device Token

When user logs in or enables notifications:

```typescript
import { supabase } from './supabaseClient';

async function registerPushToken(
  token: string,
  platform: 'ios' | 'android' | 'web',
  deviceName?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase.from('push_tokens').upsert({
    user_id: user.id,
    token,
    platform,
    device_name: deviceName,
    is_active: true,
  });

  if (error) {
    console.error('Error registering push token:', error);
  }
}
```

### 2. Update Notification Preferences

User settings page:

```typescript
import type { NotificationPreferences } from '../types/notifications';

async function updatePreferences(
  preferences: Partial<NotificationPreferences>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from('notification_preferences')
    .update(preferences)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error updating preferences:', error);
  }
}

// Example: Disable community activity notifications
await updatePreferences({
  enable_community_activity: false
});

// Example: Set quiet hours
await updatePreferences({
  quiet_hours_start: '22:00:00',
  quiet_hours_end: '07:00:00'
});
```

### 3. Send Notifications from Your App

#### Via Edge Function (Recommended)

```typescript
async function sendNotification(
  userId: string,
  templateKey: string,
  templateData?: Record<string, any>
) {
  const { data, error } = await supabase.functions.invoke(
    'send-notification',
    {
      body: {
        user_id: userId,
        template_key: templateKey,
        template_data: templateData,
      },
    }
  );

  if (error) {
    console.error('Error sending notification:', error);
    return;
  }

  return data;
}

// Example: Notify user of new comment
await sendNotification(
  postAuthorId,
  'new_comment',
  {
    commenter_name: 'Maria Silva',
    comment_content: 'Que post inspirador!',
    post_id: '123',
  }
);
```

#### Via Database Trigger (Automatic)

Create triggers to automatically send notifications:

```sql
-- Trigger on new comment
CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_commenter_name text;
  v_post_caption text;
BEGIN
  -- Get post details
  SELECT user_id, caption
  INTO v_post_author_id, v_post_caption
  FROM posts WHERE id = NEW.post_id;

  -- Don't notify if commenting on own post
  IF v_post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get commenter name
  SELECT full_name INTO v_commenter_name
  FROM profiles WHERE id = NEW.user_id;

  -- Send notification via Edge Function
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/send-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'user_id', v_post_author_id,
      'template_key', 'new_comment',
      'template_data', jsonb_build_object(
        'commenter_name', v_commenter_name,
        'comment_content', LEFT(NEW.content, 50),
        'post_id', NEW.post_id,
        'post_caption', LEFT(v_post_caption, 60)
      )
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_comment();
```

### 4. Display In-App Notifications

Fetch user's unread notifications:

```typescript
async function getUnreadNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('notification_history')
    .select('*')
    .eq('user_id', user.id)
    .eq('delivery_method', 'in_app')
    .is('read_at', null)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data;
}

// Mark notification as read
async function markAsRead(notificationId: string) {
  await supabase
    .from('notification_history')
    .update({
      read_at: new Date().toISOString(),
      status: 'read'
    })
    .eq('id', notificationId);
}
```

### 5. Real-time Notifications

Subscribe to real-time updates:

```typescript
// Subscribe to new in-app notifications
const { data: { user } } = await supabase.auth.getUser();

const channel = supabase
  .channel('notifications')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notification_history',
      filter: `user_id=eq.${user?.id}`,
    },
    (payload) => {
      console.log('New notification:', payload.new);
      // Show toast/banner
      showNotificationBanner(payload.new);
    }
  )
  .subscribe();

// Cleanup
// channel.unsubscribe();
```

---

## Usage Examples

See `/supabase/functions/send-notification/examples.ts` for detailed examples including:

1. New comment notification
2. Morning encouragement
3. Habit reminders
4. Badge awards
5. New content alerts
6. Custom notifications
7. Recurring schedules

---

## Testing

### Test Individual Notification

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "user_id": "your-test-user-id",
    "template_key": "morning_encouragement",
    "template_data": {
      "quote_content": "Você está fazendo um ótimo trabalho!",
      "quote_author": "ClubNath"
    }
  }'
```

### Test Scheduled Notification

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/send-notification \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "user_id": "your-test-user-id",
    "template_key": "journal_reminder",
    "scheduled_for": "2025-10-22T08:00:00Z"
  }'
```

### Test Scheduled Processor

```bash
curl -X POST \
  https://your-project.supabase.co/functions/v1/process-scheduled-notifications \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: your-cron-secret"
```

---

## Rate Limiting & Security

### Rate Limiting

Automatic rate limiting per category:

```sql
-- Default limits (can be customized per user)
max_community_per_day = 10  -- Community activity notifications
max_content_per_day = 5     -- New content notifications
max_reminders_per_day = 3   -- Habit reminders
```

High-priority notifications bypass rate limits and quiet hours.

### Quiet Hours

Users can set quiet hours to avoid notifications during sleep:

```typescript
await updatePreferences({
  quiet_hours_start: '22:00:00', // 10 PM
  quiet_hours_end: '07:00:00'    // 7 AM
});
```

Notifications during quiet hours are automatically rescheduled unless marked high priority.

### Security Best Practices

1. **Never expose service role key** to clients
2. **Use RLS policies** on all notification tables
3. **Validate all inputs** in Edge Functions
4. **Use CRON_SECRET** for scheduled processor
5. **Rotate push tokens** periodically
6. **Monitor for abuse** via analytics

---

## Monitoring & Analytics

### View Notification Analytics

```sql
-- Overall delivery metrics
SELECT
  delivery_method,
  status,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE read_at IS NOT NULL) as read_count,
  ROUND(AVG(EXTRACT(EPOCH FROM (read_at - sent_at))) / 60, 2) as avg_time_to_read_minutes
FROM notification_history
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY delivery_method, status;

-- Per-user engagement
SELECT
  user_id,
  COUNT(*) as notifications_sent,
  COUNT(*) FILTER (WHERE read_at IS NOT NULL) as notifications_read,
  ROUND(
    COUNT(*) FILTER (WHERE read_at IS NOT NULL)::numeric /
    COUNT(*)::numeric * 100,
    2
  ) as read_rate_percent
FROM notification_history
WHERE sent_at > NOW() - INTERVAL '30 days'
GROUP BY user_id
ORDER BY notifications_sent DESC
LIMIT 20;

-- Template effectiveness
SELECT
  template_key,
  COUNT(*) as sent,
  COUNT(*) FILTER (WHERE status = 'sent') as delivered,
  COUNT(*) FILTER (WHERE read_at IS NOT NULL) as read,
  ROUND(
    COUNT(*) FILTER (WHERE read_at IS NOT NULL)::numeric /
    COUNT(*) FILTER (WHERE status = 'sent')::numeric * 100,
    2
  ) as engagement_rate
FROM notification_history
WHERE created_at > NOW() - INTERVAL '7 days'
  AND template_key IS NOT NULL
GROUP BY template_key
ORDER BY engagement_rate DESC;
```

### Monitoring Dashboard

Use the `notification_analytics` view:

```sql
SELECT * FROM notification_analytics
WHERE notification_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY notification_date DESC, count DESC;
```

---

## Troubleshooting

### Notifications Not Being Sent

1. **Check user preferences**:
   ```sql
   SELECT * FROM notification_preferences
   WHERE user_id = 'problematic-user-id';
   ```

2. **Check push tokens**:
   ```sql
   SELECT * FROM push_tokens
   WHERE user_id = 'problematic-user-id'
     AND is_active = true;
   ```

3. **Check notification history**:
   ```sql
   SELECT * FROM notification_history
   WHERE user_id = 'problematic-user-id'
   ORDER BY created_at DESC
   LIMIT 10;
   ```

4. **Check Edge Function logs**:
   ```bash
   supabase functions logs send-notification
   ```

### Rate Limit Issues

Check current rate limits:

```sql
SELECT
  user_id,
  rate_limit_key,
  COUNT(*) as count_today
FROM notification_history
WHERE created_at >= CURRENT_DATE
  AND status = 'sent'
GROUP BY user_id, rate_limit_key
HAVING COUNT(*) >= 5;
```

### Invalid Push Tokens

Clean up inactive tokens:

```sql
-- Disable tokens not used in 30 days
UPDATE push_tokens
SET is_active = false
WHERE last_used_at < NOW() - INTERVAL '30 days'
  AND is_active = true;
```

### Template Variables Not Replacing

Ensure template data keys match template placeholders:

```typescript
// Template: "{{user_name}} curtiu seu post"
// Correct:
{ user_name: "Maria" }

// Wrong:
{ userName: "Maria" } // Camel case won't work
```

---

## Cron Setup for Scheduled Notifications

Set up a cron job to run every 5 minutes:

### Using Supabase Cron (Database)

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule cron job
SELECT cron.schedule(
  'process-scheduled-notifications',
  '*/5 * * * *', -- Every 5 minutes
  $$
    SELECT net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/process-scheduled-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', current_setting('app.settings.cron_secret')
      ),
      body := '{}'::jsonb
    );
  $$
);
```

### Using External Cron (e.g., GitHub Actions)

`.github/workflows/scheduled-notifications.yml`:

```yaml
name: Process Scheduled Notifications

on:
  schedule:
    - cron: '*/5 * * * *' # Every 5 minutes

jobs:
  process:
    runs-on: ubuntu-latest
    steps:
      - name: Call Edge Function
        run: |
          curl -X POST \
            ${{ secrets.SUPABASE_URL }}/functions/v1/process-scheduled-notifications \
            -H "Content-Type: application/json" \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}"
```

---

## Next Steps

1. ✅ Run database migration
2. ✅ Set up environment variables
3. ✅ Deploy Edge Functions
4. ✅ Configure push notification service (OneSignal/FCM)
5. ✅ Integrate client-side (register tokens)
6. ✅ Test with sample notifications
7. ✅ Set up cron for scheduled notifications
8. ✅ Monitor analytics and adjust

For questions or issues, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [OneSignal Documentation](https://documentation.onesignal.com)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
