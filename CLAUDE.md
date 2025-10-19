# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript social platform application built with Vite, Supabase, and Tailwind CSS. The app is a mothers' community platform ("ClubNath") featuring posts, chat, daily quotes, and user profiles.

## Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (authentication, database, storage)
- **Icons**: lucide-react

### Application Structure

The app uses a **client-side routing pattern** without a traditional router library. Navigation is handled through state management in `App.tsx` with the current page stored in `currentPage` state and rendered via a switch statement.

**Pages**: `feed`, `chat`, `search`, `daily`, `profile`

### Context Architecture

Two primary contexts wrap the entire application:

1. **AuthContext** (`src/contexts/AuthContext.tsx`):
   - Manages user authentication state, session, and profile data
   - Provides `signUp`, `signIn`, `signOut`, and `refreshProfile` methods
   - Automatically fetches user profile from Supabase on auth state changes
   - Must be used within `ThemeProvider` wrapper

2. **ThemeContext** (`src/contexts/ThemeContext.tsx`):
   - Manages dark/light theme with localStorage persistence (key: `clubnath-theme`)
   - Applies theme via Tailwind's `dark:` class on `document.documentElement`

### Data Layer

**Supabase Client** (`src/lib/supabase.ts`):
- Configured with environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Type definitions for all database entities: `Profile`, `Post`, `Comment`, `ChatMessage`, `DailyQuote`, `SavedItem`

**Database Tables**:
- `profiles` - User profile information
- `posts` - User posts with categories: 'Look do dia', 'Desabafo', 'Fé', 'Dica de mãe'
- `comments` - Post comments
- `likes` - Post likes
- `nathy_badges` - Special badges awarded to posts
- `saved_items` - User-saved content (posts, quotes, verses)
- `chat_messages` - Chat messages
- `daily_quotes` - Daily motivational content

### Component Patterns

**Data Fetching Pattern** (see `FeedPage.tsx`):
- Components fetch data directly using Supabase client
- Use `useState` for local state and `useEffect` for initial data fetching
- Aggregate data from multiple tables (likes count, comments count, badges) using `Promise.all`
- Real-time features can be added via Supabase subscriptions

**Authentication Flow**:
- Unauthenticated users see `AuthPage`
- Loading state shows a spinner
- Authenticated users see the main app with navigation

## Key Implementation Details

### Post Categories and Colors
Posts have four categories with gradient colors defined in `FeedPage.tsx:88-96`:
- 'Look do dia': pink-to-rose gradient
- 'Desabafo': purple-to-indigo gradient
- 'Fé': blue-to-cyan gradient
- 'Dica de mãe': green-to-emerald gradient

### Special Features
- **Nathy Badges**: Special approval badges on posts (check `nathy_badges` table)
- **Saved Items**: Users can save posts, quotes, and verses for later
- **Dark Mode**: Full dark mode support via Tailwind's dark variant

## Environment Setup

Required environment variables (create `.env` file):
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## TypeScript Configuration

- Main app config: `tsconfig.app.json`
- Node config: `tsconfig.node.json`
- Type checking uses `--noEmit` flag to only validate types without compilation
