# ClubNath Notification System

A complete, production-ready personalized notification system for the ClubNath app using Supabase Edge Functions.

## Features

✅ **Multiple Delivery Methods**: Push notifications, in-app, email
✅ **Smart Scheduling**: Quiet hours, optimal delivery times
✅ **Rate Limiting**: Prevents notification fatigue
✅ **Template System**: Reusable templates with variable substitution
✅ **Personalization**: Based on user preferences and activity
✅ **Real-time**: Live notification updates via Supabase Realtime
✅ **Analytics**: Track delivery and engagement metrics
✅ **Security**: Row-level security, rate limits, quiet hours

## Quick Start

### 1. Deploy Database Schema

```bash
# Run the migration
supabase db push

# Or manually
psql $DATABASE_URL -f supabase/migrations/20251021_notifications_system.sql
```

### 2. Set Environment Variables

```bash
# Required
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# For push notifications (choose one)
# Option 1: OneSignal (easiest)
supabase secrets set ONESIGNAL_APP_ID=your-app-id
supabase secrets set ONESIGNAL_API_KEY=your-api-key

# Option 2: Firebase Cloud Messaging
supabase secrets set FCM_SERVER_KEY=your-server-key

# For scheduled notifications
supabase secrets set CRON_SECRET=your-random-secret
```

### 3. Deploy Edge Functions

```bash
supabase functions deploy send-notification
supabase functions deploy process-scheduled-notifications
```

### 4. Test It

```bash
# Make the test script executable
chmod +x supabase/functions/send-notification/test.sh

# Set test variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_ANON_KEY=your-anon-key
export TEST_USER_ID=your-test-user-id

# Run tests
./supabase/functions/send-notification/test.sh
```

## Usage

### Send a Notification

```typescript
import { supabase } from './supabaseClient';

// Using template
const { data } = await supabase.functions.invoke('send-notification', {
  body: {
    user_id: 'user-123',
    template_key: 'new_comment',
    template_data: {
      commenter_name: 'Maria',
      comment_content: 'Que lindo!',
      post_id: '456',
    },
  },
});

// Custom notification
const { data } = await supabase.functions.invoke('send-notification', {
  body: {
    user_id: 'user-123',
    custom_title: 'Olá!',
    custom_body: 'Você tem uma nova mensagem',
  },
});

// Scheduled notification
const { data } = await supabase.functions.invoke('send-notification', {
  body: {
    user_id: 'user-123',
    template_key: 'morning_encouragement',
    scheduled_for: '2025-10-22T08:00:00Z',
  },
});
```

### Client Integration

```typescript
import NotificationService from './services/notificationService';

// Register push token
await NotificationService.registerPushToken(token, 'web');

// Get unread notifications
const notifications = await NotificationService.getUnreadNotifications();

// Mark as read
await NotificationService.markAsRead(notificationId);

// Update preferences
await NotificationService.updatePreferences({
  enable_community_activity: true,
  quiet_hours_start: '22:00:00',
  quiet_hours_end: '07:00:00',
});

// Subscribe to real-time notifications
const unsubscribe = NotificationService.subscribeToNotifications(
  (notification) => {
    console.log('New notification:', notification);
  }
);
```

## Available Templates

| Template Key            | Category               | Description                      |
| ----------------------- | ---------------------- | -------------------------------- |
| `new_comment`           | community_activity     | Someone commented on your post   |
| `new_like`              | community_activity     | Someone liked your post          |
| `nathy_badge_received`  | badges                 | You received a Nathy badge       |
| `morning_encouragement` | daily_encouragement    | Morning motivational message     |
| `evening_reflection`    | daily_encouragement    | Evening reflection               |
| `journal_reminder`      | habit_reminders        | Reminder to journal emotions     |
| `self_care_reminder`    | habit_reminders        | Self-care reminder               |
| `new_post_in_category`  | new_content            | New post in followed category    |
| `trending_post`         | new_content            | Trending post in community       |
| `robo_nath_response`    | chat_responses         | AI assistant response            |

## API Reference

### Send Notification Request

```typescript
interface SendNotificationRequest {
  user_id: string; // Required
  template_key?: string; // Use template or custom fields
  template_data?: Record<string, any>; // Template variables
  custom_title?: string; // Custom notification title
  custom_body?: string; // Custom notification body
  custom_deep_link?: string; // Custom deep link
  delivery_method?: 'push' | 'email' | 'in_app' | 'all'; // Default: 'all'
  scheduled_for?: string; // ISO 8601 timestamp
  priority?: 'high' | 'normal' | 'low'; // Default: 'normal'
}
```

### Response

```typescript
interface SendNotificationResponse {
  success: boolean;
  notification_id?: string;
  scheduled_id?: string;
  message: string;
  sent_count?: number;
  skipped_reason?: string; // If not sent
}
```

### Skip Reasons

- `USER_NOT_FOUND`: User preferences not found
- `TEMPLATE_NOT_FOUND`: Template doesn't exist
- `USER_PREFERENCES_DISABLED`: User disabled this category
- `QUIET_HOURS`: User in quiet hours (notification scheduled)
- `RATE_LIMIT_EXCEEDED`: Too many notifications in this category
- `NO_DELIVERY_METHODS`: No active delivery methods
- `NO_PUSH_TOKENS`: No push tokens registered

## Database Schema

### Tables

- **notification_preferences**: User notification settings
- **notification_templates**: Reusable message templates
- **notification_history**: Log of all sent notifications
- **push_tokens**: Device tokens for push delivery
- **notification_schedule**: Scheduled/recurring notifications

### Key Functions

- `is_in_quiet_hours(user_id, check_time)`: Check if user is in quiet hours
- `check_notification_rate_limit(user_id, category, max_per_day)`: Check rate limits

## Notification Categories

Users can control each category independently:

- **Community Activity** (`enable_community_activity`): Comments, likes
- **New Content** (`enable_new_content`): Posts in followed categories
- **Daily Encouragement** (`enable_daily_encouragement`): Motivational messages
- **Habit Reminders** (`enable_habit_reminders`): Journal, self-care reminders
- **Chat Responses** (`enable_chat_responses`): Robô Nath notifications
- **Badges** (`enable_badges`): Achievement notifications

## Rate Limiting

Default limits per category per day:

- Community Activity: 10 notifications
- New Content: 5 notifications
- Habit Reminders: 3 notifications

Users can adjust these in their preferences.

## Quiet Hours

Users can set a time range when they don't want to receive notifications (except high-priority).

Notifications during quiet hours are automatically rescheduled to after the quiet period.

## Push Notification Services

### OneSignal (Recommended)

Easiest setup, works across web, iOS, and Android.

1. Create OneSignal account
2. Get App ID and REST API Key
3. Set secrets: `ONESIGNAL_APP_ID`, `ONESIGNAL_API_KEY`
4. Integrate OneSignal SDK in your app

### Firebase Cloud Messaging

More control, requires more setup.

1. Create Firebase project
2. Get Server Key
3. Set secret: `FCM_SERVER_KEY`
4. Integrate Firebase SDK

### Web Push API

For web-only apps.

1. Generate VAPID keys: `npx web-push generate-vapid-keys`
2. Set secrets: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
3. Implement service worker

## Scheduled Notifications

Set up a cron job to run every 5 minutes:

```bash
# Using GitHub Actions, Vercel Cron, or similar
curl -X POST \
  https://your-project.supabase.co/functions/v1/process-scheduled-notifications \
  -H "x-cron-secret: your-secret"
```

Or use Supabase pg_cron (see setup documentation).

## Analytics

### View notification metrics

```sql
-- Delivery and read rates
SELECT
  delivery_method,
  status,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE read_at IS NOT NULL) as read_count
FROM notification_history
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY delivery_method, status;

-- Template effectiveness
SELECT
  template_key,
  COUNT(*) as sent,
  COUNT(*) FILTER (WHERE read_at IS NOT NULL) as read,
  ROUND(
    COUNT(*) FILTER (WHERE read_at IS NOT NULL)::numeric /
    COUNT(*)::numeric * 100, 2
  ) as engagement_rate
FROM notification_history
WHERE template_key IS NOT NULL
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY template_key
ORDER BY engagement_rate DESC;
```

## Troubleshooting

### Notifications not sending?

1. Check user preferences: `SELECT * FROM notification_preferences WHERE user_id = 'user-id';`
2. Check push tokens: `SELECT * FROM push_tokens WHERE user_id = 'user-id' AND is_active = true;`
3. Check function logs: `supabase functions logs send-notification`
4. Verify secrets are set: `supabase secrets list`

### Template variables not working?

Ensure keys match exactly (case-sensitive):

```typescript
// Template: "{{user_name}} curtiu"
// ✅ Correct:
{ user_name: "Maria" }

// ❌ Wrong:
{ userName: "Maria" }
```

## Security

- ✅ Row-level security on all tables
- ✅ Users can only access their own data
- ✅ Rate limiting per category
- ✅ Quiet hours respected
- ✅ Service role key never exposed to clients
- ✅ CRON_SECRET for scheduled processor

## Components

The package includes React components:

- `NotificationCenter`: Display in-app notifications
- `NotificationSettings`: Manage user preferences

## Support

For detailed documentation, see `/docs/NOTIFICATIONS_SETUP.md`

## License

Part of ClubNath application.
