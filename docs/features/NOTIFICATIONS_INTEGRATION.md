# ClubNath Notifications - Integration Guide

Step-by-step guide to integrate the notification system with existing ClubNath features.

## Overview

This guide shows how to integrate notifications with:
- Comments on posts
- Likes on posts
- Nathy badges
- Daily quotes
- Robô Nath chat
- New posts in categories

## Integration Approaches

There are two main approaches:

1. **Database Triggers** (Recommended): Automatic, no code changes needed
2. **Client-Side Calls**: More control, requires code changes

## Approach 1: Database Triggers (Recommended)

### 1. Setup HTTP Extension

First, enable the HTTP extension in Supabase:

```sql
-- Enable HTTP extension for making API calls from database
CREATE EXTENSION IF NOT EXISTS http;
```

### 2. Configure Environment

Store Supabase URL and service role key:

```sql
-- Store configuration (run once)
ALTER DATABASE postgres SET app.settings.supabase_url TO 'https://your-project.supabase.co';
ALTER DATABASE postgres SET app.settings.service_role_key TO 'your-service-role-key';
```

### 3. Create Trigger Functions

#### A. New Comment Notification

```sql
-- Function to notify post author when someone comments
CREATE OR REPLACE FUNCTION notify_new_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_commenter_name text;
  v_post_caption text;
  v_post_category text;
BEGIN
  -- Get post details
  SELECT user_id, caption, category
  INTO v_post_author_id, v_post_caption, v_post_category
  FROM posts
  WHERE id = NEW.post_id;

  -- Don't notify if commenting on own post
  IF v_post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get commenter name
  SELECT full_name INTO v_commenter_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Send notification via Edge Function
  PERFORM http_post(
    current_setting('app.settings.supabase_url') || '/functions/v1/send-notification',
    jsonb_build_object(
      'user_id', v_post_author_id,
      'template_key', 'new_comment',
      'template_data', jsonb_build_object(
        'commenter_name', v_commenter_name,
        'comment_content', LEFT(NEW.content, 50),
        'post_id', NEW.post_id,
        'post_caption', LEFT(v_post_caption, 60),
        'post_category', v_post_category
      )
    ),
    'application/json',
    jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_comment_created ON comments;
CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_comment();
```

#### B. New Like Notification

```sql
-- Function to notify post author when someone likes
CREATE OR REPLACE FUNCTION notify_new_like()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_liker_name text;
  v_post_caption text;
  v_post_category text;
BEGIN
  -- Get post details
  SELECT user_id, caption, category
  INTO v_post_author_id, v_post_caption, v_post_category
  FROM posts
  WHERE id = NEW.post_id;

  -- Don't notify if liking own post
  IF v_post_author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Get liker name
  SELECT full_name INTO v_liker_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Send notification
  PERFORM http_post(
    current_setting('app.settings.supabase_url') || '/functions/v1/send-notification',
    jsonb_build_object(
      'user_id', v_post_author_id,
      'template_key', 'new_like',
      'template_data', jsonb_build_object(
        'liker_name', v_liker_name,
        'post_id', NEW.post_id,
        'post_caption', LEFT(v_post_caption, 60),
        'post_category', v_post_category
      )
    ),
    'application/json',
    jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_like_created ON likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_like();
```

#### C. Nathy Badge Notification

```sql
-- Function to notify when user receives Nathy badge
CREATE OR REPLACE FUNCTION notify_nathy_badge()
RETURNS TRIGGER AS $$
DECLARE
  v_post_author_id uuid;
  v_post_caption text;
BEGIN
  -- Get post details
  SELECT user_id, caption
  INTO v_post_author_id, v_post_caption
  FROM posts
  WHERE id = NEW.post_id;

  -- Send high-priority notification
  PERFORM http_post(
    current_setting('app.settings.supabase_url') || '/functions/v1/send-notification',
    jsonb_build_object(
      'user_id', v_post_author_id,
      'template_key', 'nathy_badge_received',
      'template_data', jsonb_build_object(
        'post_id', NEW.post_id,
        'post_caption', LEFT(v_post_caption, 60)
      ),
      'priority', 'high'
    ),
    'application/json',
    jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_nathy_badge_created ON nathy_badges;
CREATE TRIGGER on_nathy_badge_created
  AFTER INSERT ON nathy_badges
  FOR EACH ROW
  EXECUTE FUNCTION notify_nathy_badge();
```

#### D. New Post Notification (to followers of category)

```sql
-- Function to notify users following a category about new posts
CREATE OR REPLACE FUNCTION notify_new_post()
RETURNS TRIGGER AS $$
DECLARE
  v_author_name text;
  v_follower_id uuid;
BEGIN
  -- Get author name
  SELECT full_name INTO v_author_name
  FROM profiles
  WHERE id = NEW.user_id;

  -- Notify all users who follow this category
  FOR v_follower_id IN
    SELECT user_id
    FROM notification_preferences
    WHERE enable_new_content = true
      AND followed_categories @> ARRAY[NEW.category]
      AND user_id != NEW.user_id  -- Don't notify the author
  LOOP
    PERFORM http_post(
      current_setting('app.settings.supabase_url') || '/functions/v1/send-notification',
      jsonb_build_object(
        'user_id', v_follower_id,
        'template_key', 'new_post_in_category',
        'template_data', jsonb_build_object(
          'category_name', NEW.category,
          'author_name', v_author_name,
          'post_caption', LEFT(NEW.caption, 80),
          'post_id', NEW.id
        ),
        'priority', 'low'
      ),
      'application/json',
      jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      )
    );
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_post_created ON posts;
CREATE TRIGGER on_post_created
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_post();
```

### 4. Install All Triggers

Run this SQL script to install all triggers at once:

```sql
-- Install all notification triggers
\i supabase/migrations/20251021_notification_triggers.sql
```

## Approach 2: Client-Side Calls

If you prefer more control, call the notification service from your app code.

### 1. Setup Notification Service

```typescript
// src/services/notificationService.ts is already created
import NotificationService from './services/notificationService';
```

### 2. Send Notifications from Client Code

#### A. When User Comments

```typescript
// In your comment creation handler
async function handleCreateComment(postId: string, content: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Create comment
  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    return;
  }

  // Get post details for notification
  const { data: post } = await supabase
    .from('posts')
    .select('user_id, caption, category')
    .eq('id', postId)
    .single();

  if (!post) return;

  // Don't notify if commenting on own post
  if (post.user_id === user.id) return;

  // Get commenter name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  // Send notification
  await NotificationService.sendNotification({
    user_id: post.user_id,
    template_key: 'new_comment',
    template_data: {
      commenter_name: profile?.full_name || 'Alguém',
      comment_content: content.substring(0, 50),
      post_id: postId,
      post_caption: post.caption.substring(0, 60),
      post_category: post.category,
    },
  });
}
```

#### B. When User Likes

```typescript
// In your like handler
async function handleToggleLike(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single();

  if (existingLike) {
    // Unlike
    await supabase.from('likes').delete().eq('id', existingLike.id);
  } else {
    // Like
    await supabase.from('likes').insert({
      post_id: postId,
      user_id: user.id,
    });

    // Get post details
    const { data: post } = await supabase
      .from('posts')
      .select('user_id, caption, category')
      .eq('id', postId)
      .single();

    if (!post || post.user_id === user.id) return;

    // Get liker name
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    // Send notification
    await NotificationService.sendNotification({
      user_id: post.user_id,
      template_key: 'new_like',
      template_data: {
        liker_name: profile?.full_name || 'Alguém',
        post_id: postId,
        post_caption: post.caption.substring(0, 60),
        post_category: post.category,
      },
    });
  }
}
```

#### C. When Nathy Badge is Awarded

```typescript
// In your badge creation handler
async function awardNathyBadge(postId: string) {
  // Create badge
  const { data: badge, error } = await supabase
    .from('nathy_badges')
    .insert({ post_id: postId })
    .select()
    .single();

  if (error) {
    console.error('Error creating badge:', error);
    return;
  }

  // Get post details
  const { data: post } = await supabase
    .from('posts')
    .select('user_id, caption')
    .eq('id', postId)
    .single();

  if (!post) return;

  // Send high-priority notification
  await NotificationService.sendNotification({
    user_id: post.user_id,
    template_key: 'nathy_badge_received',
    template_data: {
      post_id: postId,
      post_caption: post.caption.substring(0, 60),
    },
    priority: 'high',
  });
}
```

## Daily Notifications

Set up daily encouragement notifications using a scheduled cron job.

### 1. Create Cron Job Script

```typescript
// scripts/send-daily-encouragement.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendDailyEncouragement() {
  // Get all users with daily encouragement enabled
  const { data: users } = await supabase
    .from('notification_preferences')
    .select('user_id, preferred_time_morning')
    .eq('enable_daily_encouragement', true);

  if (!users) return;

  // Get today's quote
  const { data: quote } = await supabase
    .from('daily_quotes')
    .select('content, author')
    .eq('date', new Date().toISOString().split('T')[0])
    .single();

  // Send to each user
  for (const user of users) {
    await supabase.functions.invoke('send-notification', {
      body: {
        user_id: user.user_id,
        template_key: 'morning_encouragement',
        template_data: {
          quote_content: quote?.content || 'Você está fazendo um ótimo trabalho! ❤️',
          quote_author: quote?.author || 'ClubNath',
        },
        scheduled_for: calculateScheduleTime(user.preferred_time_morning),
      },
    });
  }
}

function calculateScheduleTime(preferredTime: string): string {
  const today = new Date();
  const [hours, minutes] = preferredTime.split(':');
  today.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return today.toISOString();
}

sendDailyEncouragement();
```

### 2. Schedule with GitHub Actions

```yaml
# .github/workflows/daily-encouragement.yml
name: Send Daily Encouragement

on:
  schedule:
    - cron: '0 6 * * *' # 6 AM UTC daily

jobs:
  send:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run send-daily-encouragement
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## Frontend Integration

### 1. Add NotificationCenter Component

```typescript
// In your main App.tsx or Layout component
import NotificationCenter from './components/NotificationCenter';

function App() {
  return (
    <div className="app">
      <header>
        <nav>
          {/* Your navigation */}
          <NotificationCenter />
        </nav>
      </header>
      {/* Rest of app */}
    </div>
  );
}
```

### 2. Add NotificationSettings Page

```typescript
// In your settings/preferences page
import NotificationSettings from './components/NotificationSettings';

function SettingsPage() {
  return (
    <div className="settings">
      <h1>Configurações</h1>
      {/* Other settings sections */}
      <NotificationSettings />
    </div>
  );
}
```

### 3. Register Push Token on Login

```typescript
// In your auth/login handler
import NotificationService from './services/notificationService';
import OneSignal from 'react-onesignal';

async function handleLogin() {
  // ... your login logic

  // Request notification permission
  const hasPermission = await NotificationService.requestPermission();

  if (hasPermission) {
    // Initialize OneSignal (if using OneSignal)
    await OneSignal.init({
      appId: 'your-onesignal-app-id',
    });

    // Set external user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await OneSignal.setExternalUserId(user.id);

      // Get player ID and save to database
      const playerId = await OneSignal.getPlayerId();
      if (playerId) {
        await NotificationService.registerPushToken(
          playerId,
          'web',
          navigator.userAgent
        );
      }
    }
  }
}
```

### 4. Unregister Token on Logout

```typescript
// In your logout handler
async function handleLogout() {
  // Get current tokens
  const tokens = await NotificationService.getActivePushTokens();

  // Deactivate all tokens
  for (const token of tokens) {
    await NotificationService.removePushToken(token.token);
  }

  // Then proceed with logout
  await supabase.auth.signOut();
}
```

## Testing

### 1. Test Individual Features

```bash
# Test new comment notification
curl -X POST https://your-project.supabase.co/functions/v1/send-notification \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-id",
    "template_key": "new_comment",
    "template_data": {
      "commenter_name": "Maria",
      "comment_content": "Que post lindo!",
      "post_id": "123"
    }
  }'
```

### 2. Test in App

1. Create a comment on another user's post
2. Check notification appears in NotificationCenter
3. Check push notification on device
4. Verify notification logged in database

### 3. Monitor Logs

```bash
# Watch Edge Function logs
supabase functions logs send-notification --tail

# Check for errors
supabase functions logs send-notification --level error
```

## Best Practices

1. **Use Database Triggers** for automated notifications (comments, likes)
2. **Use Client Calls** when you need to add custom logic
3. **Always check** if recipient wants this notification category
4. **Respect quiet hours** unless it's urgent (high priority)
5. **Rate limit** to avoid overwhelming users
6. **Test thoroughly** before deploying to production
7. **Monitor analytics** to optimize engagement

## Troubleshooting

### Notifications not being sent?

1. Check user has `enable_push` or `enable_in_app` enabled
2. Verify push tokens are registered and active
3. Check function logs for errors
4. Ensure environment variables are set correctly

### Database triggers not firing?

1. Verify HTTP extension is enabled: `SELECT * FROM pg_extension WHERE extname = 'http';`
2. Check trigger exists: `SELECT * FROM pg_trigger WHERE tgname LIKE 'on_%';`
3. Test function manually: `SELECT notify_new_comment();`

### High rate of failed notifications?

1. Check if users have disabled categories
2. Verify rate limits aren't too restrictive
3. Check push token validity

## Next Steps

1. ✅ Choose integration approach (triggers or client-side)
2. ✅ Implement notification calls for each feature
3. ✅ Add NotificationCenter to your UI
4. ✅ Add NotificationSettings to preferences
5. ✅ Set up push notification service (OneSignal/FCM)
6. ✅ Test thoroughly
7. ✅ Monitor and optimize

For more details, see:
- [Setup Documentation](./NOTIFICATIONS_SETUP.md)
- [API Reference](../supabase/functions/send-notification/README.md)
