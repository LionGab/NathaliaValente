# Nossa Maternidade - Maternal Wellness App

## Overview

Nossa Maternidade is a complete maternal wellness application built with React, TypeScript, and Tailwind CSS. It features AI-powered sentiment analysis, personalized daily routines, self-care activities, and educational content for mothers.

## Features

### 1. AI Sentiment Analysis

- 5 empathetic questions about well-being
- Analyzes emotional state (calm, tired, anxious, happy, stressed)
- Personalizes content based on responses
- Ready for Gemini API 2.5 Flash integration

### 2. Minimalist Login

- Elegant centered design
- Soft lilac gradient background
- Email/password authentication
- Password reset flow

### 3. Personalized Dashboard

- Dynamic time-based greeting
- AI-powered daily suggestions
- Routine tracking with progress
- Quick navigation cards

### 4. Exclusive Content (Exclusivo Nath)

- Videos, stories, posts, insights
- Filter by pregnancy stage
- Interactive feedback system
- Social engagement features

### 5. Weekly Routine

- Visual weekly calendar
- 4 categories:
  - 🍽️ Alimentação (Feeding)
  - 🌙 Descanso (Rest)
  - 👶 Brincadeiras (Play)
  - 💜 Autocuidado (Self-care)
- Task completion tracking
- AI reminder suggestions

### 6. Self-Care Activities

- 10 activities (5-10 minutes each)
- Favorite/schedule functionality
- Beautiful animations
- Encouragement messaging

### 7. Themed Suggestions

**Activities:**

- Sensory activities for babies (6-12 months)
- Step-by-step instructions
- Materials list
- Developmental benefits

**Recipes:**

- Simple baby-friendly recipes
- Ingredient lists
- Preparation steps
- Age recommendations

**Sleep Stories:**

- Calming bedtime stories
- Audio playback support
- Duration indicators

**Tantrum Tips:**

- Situation-specific advice
- Empathetic responses
- Prevention strategies
- Action steps

## Tech Stack

- **Framework:** React 18 + TypeScript 5.5
- **Styling:** Tailwind CSS (existing color scheme)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Build Tool:** Vite
- **Type Safety:** Full TypeScript coverage

## File Structure

```
src/features/nossa-maternidade/
├── components/
│   ├── AIInteractionFlow.tsx       # AI sentiment analysis
│   ├── Dashboard.tsx               # Main dashboard
│   ├── ExclusivoNath.tsx          # Exclusive content
│   ├── LoginScreen.tsx            # Login page
│   ├── SelfCareScreen.tsx         # Self-care activities
│   ├── ThemedSuggestions.tsx      # Activities, recipes, stories
│   └── WeeklyRoutine.tsx          # Weekly schedule
├── screens/
│   └── NossaMaternidadeScreen.tsx # Main app container
├── types/
│   └── index.ts                   # TypeScript definitions
└── index.ts                       # Feature exports
```

## Usage

### Import the main screen:

```typescript
import { NossaMaternidadeScreen } from '@/features/nossa-maternidade';

function App() {
  return <NossaMaternidadeScreen />;
}
```

### Or use individual components:

```typescript
import {
  Dashboard,
  SelfCareScreen,
  WeeklyRoutine
} from '@/features/nossa-maternidade';

function MyApp() {
  return (
    <div>
      <Dashboard
        user={currentUser}
        sentimentAnalysis={analysis}
        onNavigate={handleNav}
      />
    </div>
  );
}
```

## Color Scheme

The app uses the existing maternal color palette:

- **Primary (Pink):** `#ec4899` - Nurturing and warm
- **Secondary (Lavender):** `#a855f7` - Calming and gentle
- **Accent (Blue):** `#3b82f6` - Trust and serenity
- **Neutral (Warm Gray):** `#78716c` - Grounding

## Design Principles

1. **Mobile-First:** Optimized for mobile devices
2. **Empathetic UX:** Supportive, understanding language
3. **Soft Aesthetics:** Rounded corners, gentle shadows
4. **Smooth Animations:** Delightful micro-interactions
5. **Accessible:** Semantic HTML, proper contrast
6. **PWA-Ready:** Works offline, installable

## Integration Points

### Gemini API (Future)

The `AIInteractionFlow` component is ready for Gemini API integration:

```typescript
// In AIInteractionFlow.tsx, replace analyzeAnswers() with:
const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
  method: 'POST',
  body: JSON.stringify({ answers: allAnswers }),
  headers: { 'Content-Type': 'application/json' },
});
const analysis = await response.json();
```

### Supabase (Future)

Ready for data persistence:

```typescript
// Save sentiment analysis
await supabase.from('sentiment_analyses').insert({
  user_id: userId,
  emotional_state: analysis.emotionalState,
  needs_support: analysis.needsSupport,
  answers: analysis.answers,
});
```

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npm run typecheck
```

## Screenshots

[Screenshots will be added after UI testing]

## Contributing

When adding new features:

1. Follow existing component patterns
2. Use TypeScript for type safety
3. Maintain the empathetic tone
4. Keep mobile-first approach
5. Add proper TypeScript types

## License

Part of the NathaliaValente/ClubNath VIP project.
