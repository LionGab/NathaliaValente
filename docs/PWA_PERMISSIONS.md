# PWA Permissions Documentation

## Overview

This document describes the PWA (Progressive Web App) permissions configured for the Nossa Maternidade application.

## Configured Permissions

### 1. Notifications

**Permission:** `notifications`
**Usage:** Enables push notifications for:

- New community posts and activity
- Daily encouragement messages
- Chat responses from Nathia AI
- Habit reminders
- Badge achievements

**Implementation:**

- Requested via `Notification.requestPermission()` in `src/services/notificationService.ts`
- Managed through user preferences in notification settings

### 2. Clipboard Read

**Permission:** `clipboard-read`
**Usage:** Allows the app to read from the system clipboard for:

- Pasting text in chat conversations
- Importing content into posts
- Sharing functionality

**Implementation:**

- Used via `navigator.clipboard.readText()` where needed
- Subject to browser security policies

### 3. Clipboard Write

**Permission:** `clipboard-write`
**Usage:** Enables copying content to the clipboard:

- Sharing Bible verses (`src/components/DailyVerseCard.tsx`)
- Copying chat messages (`src/components/ChatPage.tsx`)
- Copying study content (`src/components/bible-studies/BibleStudyCard.tsx`)

**Implementation:**

- Used via `navigator.clipboard.writeText()` in multiple components
- Provides user feedback on successful copy

### 4. Storage

**Permission:** `storage`
**Usage:** Enables persistent storage for:

- Offline content caching
- Service Worker cache
- User preferences
- Downloaded content

**Implementation:**

- Managed via Workbox service worker (`vite.config.ts`)
- Caches API responses, images, fonts, and static assets
- Configured with different strategies (NetworkFirst, CacheFirst, StaleWhileRevalidate)

### 5. Background Sync

**Permission:** `background-sync`
**Usage:** Enables background synchronization for:

- Sending messages when connection is restored
- Uploading posts created while offline
- Syncing user actions performed offline

**Implementation:**

- Configured in service worker via Workbox
- Ensures data consistency across online/offline transitions

### 6. Periodic Background Sync

**Permission:** `periodic-background-sync`
**Usage:** Enables periodic background updates for:

- Checking for new content
- Updating cached data
- Refreshing notification badges

**Implementation:**

- Configured in service worker
- Runs at browser-determined intervals when app is not active

## Permissions Policy Headers

The following Permissions-Policy headers are configured in `netlify.toml`:

```
Permissions-Policy = "notifications=*, clipboard-read=*, clipboard-write=*, storage=*"
```

This allows these permissions for the app and its embedded content.

## Configuration Files

### 1. public/manifest.json

Contains the PWA manifest with permissions array for the installed app.

### 2. vite.config.ts

Configures the PWA plugin with manifest settings including permissions.

### 3. netlify.toml

Configures HTTP headers including Permissions-Policy for the deployed app.

## User Privacy

All permissions are:

- Requested with user consent
- Can be revoked at any time through browser settings
- Subject to browser security policies
- Only used for their stated purposes

## Browser Compatibility

These permissions are supported in modern browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (with some limitations)
- ✅ Opera

Note: Actual permission behavior may vary by browser and operating system.

## Future Considerations

Additional permissions that may be added in the future:

- `geolocation` - For location-based features
- `camera` - For profile photos and content uploads
- `microphone` - For voice messages or audio content

These will be added only when the features require them and with proper user consent flows.
