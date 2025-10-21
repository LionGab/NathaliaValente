# Emotional Intelligence System for ClubNath
## Technical Proposal

### Executive Summary

This proposal outlines a privacy-first, empathetic emotional intelligence system that adjusts habit notifications based on mothers' emotional states recorded in their diary entries. The system prioritizes user wellbeing over engagement metrics, using a hybrid approach of rule-based algorithms and sentiment analysis.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [Emotion Detection Algorithm](#emotion-detection-algorithm)
4. [Notification Adjustment Rules](#notification-adjustment-rules)
5. [Implementation Details](#implementation-details)
6. [Privacy & Ethics](#privacy--ethics)
7. [Rollout Plan](#rollout-plan)
8. [Success Metrics](#success-metrics)

---

## System Architecture

### High-Level Overview

```
┌─────────────────┐
│  Diary Entry    │
│  (User Input)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Emotion Detection       │
│ - Keyword Analysis      │
│ - Emoji Detection       │
│ - Sentiment Scoring     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Emotional Profile       │
│ - Current State         │
│ - Pattern Analysis      │
│ - Trend Detection       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Notification Engine     │
│ - Timing Optimization   │
│ - Content Selection     │
│ - Frequency Adjustment  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Personalized            │
│ Notifications           │
└─────────────────────────┘
```

### Core Components

1. **Diary Module**: Capture emotional entries
2. **Emotion Analyzer**: Extract emotional signals
3. **Pattern Engine**: Identify emotional trends
4. **Notification Optimizer**: Adjust timing and content
5. **Support Escalation**: Detect when professional help may be needed

---

## Database Schema

### New Tables

#### 1. diary_entries

Stores user diary entries with emotional data.

```sql
CREATE TABLE diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  -- Encrypted content for privacy
  content_encrypted text,
  -- Detected emotions (stored as JSONB for flexibility)
  detected_emotions jsonb DEFAULT '[]'::jsonb,
  -- Primary emotion detected
  primary_emotion text,
  -- Confidence score (0-1)
  emotion_confidence decimal(3,2),
  -- Sentiment score (-1 to 1: negative to positive)
  sentiment_score decimal(3,2),
  -- Extracted emoji (for quick analysis)
  emojis text[],
  -- Manual emotion tag by user (optional)
  user_emotion_tag text,
  -- Mood intensity (1-5)
  mood_intensity integer CHECK (mood_intensity >= 1 AND mood_intensity <= 5),
  -- Timestamp
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Soft delete for privacy
  deleted_at timestamptz
);

-- Indexes
CREATE INDEX idx_diary_entries_user_id ON diary_entries(user_id);
CREATE INDEX idx_diary_entries_created_at ON diary_entries(created_at DESC);
CREATE INDEX idx_diary_entries_primary_emotion ON diary_entries(primary_emotion);
CREATE INDEX idx_diary_entries_user_created ON diary_entries(user_id, created_at DESC);

-- RLS Policies
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own diary entries"
  ON diary_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can create diary entries"
  ON diary_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own diary entries"
  ON diary_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can soft delete own diary entries"
  ON diary_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

#### 2. emotional_patterns

Aggregated emotional patterns over time.

```sql
CREATE TABLE emotional_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Time period for this pattern
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  period_type text NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  -- Emotional statistics
  dominant_emotions jsonb DEFAULT '[]'::jsonb,
  average_sentiment decimal(3,2),
  mood_volatility decimal(3,2), -- How much mood varies
  -- Time-based patterns
  morning_sentiment decimal(3,2),
  afternoon_sentiment decimal(3,2),
  evening_sentiment decimal(3,2),
  -- Stress indicators
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 5),
  overwhelm_score decimal(3,2),
  -- Positive indicators
  gratitude_count integer DEFAULT 0,
  joy_count integer DEFAULT 0,
  -- Entry count in this period
  entry_count integer DEFAULT 0,
  -- Computed at
  computed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_emotional_patterns_user_id ON emotional_patterns(user_id);
CREATE INDEX idx_emotional_patterns_period ON emotional_patterns(user_id, period_start DESC);
CREATE UNIQUE INDEX idx_emotional_patterns_unique ON emotional_patterns(user_id, period_start, period_type);

-- RLS Policies
ALTER TABLE emotional_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own emotional patterns"
  ON emotional_patterns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

#### 3. notification_preferences

User-specific notification preferences based on emotional patterns.

```sql
CREATE TABLE notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Enable/disable emotional intelligence
  ai_adjustment_enabled boolean DEFAULT true,
  -- Preferred notification times (hours in UTC)
  preferred_times integer[] DEFAULT ARRAY[9, 14, 19], -- 9am, 2pm, 7pm
  -- Blackout periods (user never wants notifications)
  blackout_start time,
  blackout_end time,
  -- Frequency preferences
  max_daily_notifications integer DEFAULT 3,
  min_notification_interval_hours integer DEFAULT 4,
  -- Content preferences
  preferred_tone text DEFAULT 'balanced' CHECK (preferred_tone IN ('gentle', 'balanced', 'motivational')),
  enable_support_resources boolean DEFAULT true,
  -- Privacy settings
  store_diary_content boolean DEFAULT true,
  encryption_enabled boolean DEFAULT true,
  -- Auto-computed emotional preferences
  avoid_morning_notifications boolean DEFAULT false,
  reduce_frequency_on_stress boolean DEFAULT true,
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint
CREATE UNIQUE INDEX idx_notification_preferences_user ON notification_preferences(user_id);

-- RLS Policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

#### 4. habit_reminders

Habit tracking with emotional intelligence integration.

```sql
CREATE TABLE habit_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  -- Schedule
  scheduled_time time NOT NULL,
  frequency text DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  days_of_week integer[], -- 0-6 (Sunday-Saturday)
  -- Emotional intelligence adjustments
  adjust_for_emotions boolean DEFAULT true,
  skip_on_negative_mood boolean DEFAULT false,
  -- Status
  is_active boolean DEFAULT true,
  last_sent_at timestamptz,
  next_scheduled_at timestamptz,
  -- Engagement metrics
  completed_count integer DEFAULT 0,
  skipped_count integer DEFAULT 0,
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_habit_reminders_user_id ON habit_reminders(user_id);
CREATE INDEX idx_habit_reminders_next_scheduled ON habit_reminders(next_scheduled_at) WHERE is_active = true;

-- RLS Policies
ALTER TABLE habit_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own habit reminders"
  ON habit_reminders FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

#### 5. notification_history

Track sent notifications for analysis and optimization.

```sql
CREATE TABLE notification_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_reminder_id uuid REFERENCES habit_reminders(id) ON DELETE SET NULL,
  -- Notification content
  title text NOT NULL,
  message text NOT NULL,
  notification_type text NOT NULL CHECK (notification_type IN ('habit', 'support', 'quote', 'check_in')),
  -- Emotional context at send time
  user_emotional_state jsonb,
  adjustment_applied text, -- What adjustment was made based on emotions
  -- Engagement
  delivered boolean DEFAULT false,
  opened boolean DEFAULT false,
  action_taken boolean DEFAULT false,
  dismissed boolean DEFAULT false,
  -- Timestamps
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  opened_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX idx_notification_history_sent_at ON notification_history(sent_at DESC);

-- RLS Policies
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notification history"
  ON notification_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

#### 6. support_resources

Mental health and support resources that can be suggested.

```sql
CREATE TABLE support_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('article', 'hotline', 'therapist_finder', 'meditation', 'exercise')),
  url text,
  phone_number text,
  -- Trigger conditions
  trigger_emotions text[], -- Which emotions trigger this resource
  trigger_stress_level integer, -- Minimum stress level to suggest
  locale text DEFAULT 'pt-BR',
  -- Status
  is_active boolean DEFAULT true,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_support_resources_active ON support_resources(is_active, priority DESC);
CREATE INDEX idx_support_resources_type ON support_resources(resource_type);

-- RLS Policies
ALTER TABLE support_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Support resources are viewable by everyone"
  ON support_resources FOR SELECT
  TO authenticated
  USING (is_active = true);
```

---

## Emotion Detection Algorithm

### Emotion Categories

Based on research in maternal mental health, we identify these key emotional states:

1. **Positive Emotions**
   - `joyful`: High energy, happiness
   - `grateful`: Appreciation, thankfulness
   - `peaceful`: Calm, serene
   - `proud`: Accomplishment, satisfaction
   - `hopeful`: Optimistic, forward-looking

2. **Negative Emotions**
   - `stressed`: Pressure, tension
   - `overwhelmed`: Too much to handle
   - `anxious`: Worry, nervousness
   - `sad`: Down, melancholic
   - `frustrated`: Irritation, anger
   - `exhausted`: Physical/emotional fatigue
   - `lonely`: Isolated, disconnected
   - `guilty`: Self-blame, inadequacy

3. **Neutral/Mixed**
   - `neutral`: Balanced, normal
   - `reflective`: Thoughtful, contemplative
   - `uncertain`: Confused, undecided

### Detection Methods

#### 1. Keyword-Based Detection

Portuguese keywords mapped to emotions (culturally appropriate for Brazilian mothers):

```typescript
const EMOTION_KEYWORDS = {
  joyful: ['feliz', 'alegre', 'contente', 'animada', 'radiante', 'sorrindo', 'rindo'],
  grateful: ['grata', 'agradecida', 'abençoada', 'sortuda', 'privilegiada', 'obrigada'],
  peaceful: ['calma', 'tranquila', 'serena', 'paz', 'relaxada', 'descansada'],
  proud: ['orgulhosa', 'realizada', 'conquista', 'sucesso', 'consegui'],
  hopeful: ['esperança', 'otimista', 'confiante', 'esperançosa', 'vai dar certo'],

  stressed: ['estressada', 'pressionada', 'tensão', 'exausta', 'cansada'],
  overwhelmed: ['sobrecarregada', 'não aguento', 'muito', 'demais', 'sufocada'],
  anxious: ['ansiosa', 'preocupada', 'nervosa', 'medo', 'insegura'],
  sad: ['triste', 'down', 'pra baixo', 'deprimida', 'melancólica', 'chorando'],
  frustrated: ['frustrada', 'irritada', 'raiva', 'brava', 'chateada'],
  exhausted: ['exausta', 'cansada', 'sem energia', 'esgotada', 'acabada'],
  lonely: ['sozinha', 'isolada', 'solitária', 'abandonada', 'sem apoio'],
  guilty: ['culpada', 'culpa', 'mãe ruim', 'não sou boa', 'falhei']
};
```

#### 2. Emoji Analysis

```typescript
const EMOJI_EMOTIONS = {
  joyful: ['😊', '😄', '🥰', '😍', '🤗', '🎉', '✨', '💖'],
  grateful: ['🙏', '💝', '🌟', '🌈'],
  peaceful: ['😌', '🧘‍♀️', '🌸', '🕊️', '☮️'],
  sad: ['😢', '😭', '😔', '💔', '😞'],
  stressed: ['😫', '😩', '😰', '🤯'],
  overwhelmed: ['😵', '🥴', '😖'],
  anxious: ['😟', '😨', '😰', '😱'],
  frustrated: ['😤', '😠', '😡', '🤬'],
  exhausted: ['😴', '😪', '🥱', '😵‍💫']
};
```

#### 3. Sentiment Scoring

Using a weighted sentiment analysis:

- Positive keywords: +1 to +3 (based on intensity)
- Negative keywords: -1 to -3
- Emoji weight: 0.5x keyword weight
- Context modifiers (negations, intensifiers)

### Implementation Pseudocode

```typescript
function analyzeEmotionalContent(entry: DiaryEntry): EmotionalAnalysis {
  const emotions: EmotionScore[] = [];
  const words = tokenize(entry.content.toLowerCase());
  const emojis = extractEmojis(entry.content);

  // 1. Keyword Analysis
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    const matches = keywords.filter(keyword =>
      words.some(word => word.includes(keyword))
    );

    if (matches.length > 0) {
      emotions.push({
        emotion,
        confidence: calculateConfidence(matches.length, words.length),
        source: 'keyword',
        matches
      });
    }
  }

  // 2. Emoji Analysis
  for (const [emotion, emojiList] of Object.entries(EMOJI_EMOTIONS)) {
    const matches = emojis.filter(emoji => emojiList.includes(emoji));

    if (matches.length > 0) {
      emotions.push({
        emotion,
        confidence: calculateConfidence(matches.length * 0.5, emojis.length),
        source: 'emoji',
        matches
      });
    }
  }

  // 3. Aggregate scores
  const aggregated = aggregateEmotionScores(emotions);

  // 4. Calculate sentiment
  const sentiment = calculateSentiment(aggregated);

  // 5. Determine primary emotion
  const primary = aggregated.sort((a, b) => b.confidence - a.confidence)[0];

  return {
    primaryEmotion: primary?.emotion || 'neutral',
    confidence: primary?.confidence || 0.5,
    allEmotions: aggregated,
    sentimentScore: sentiment,
    detectedEmojis: emojis
  };
}

function calculateConfidence(matches: number, total: number): number {
  // Confidence based on match density and absolute count
  const density = matches / Math.max(total, 1);
  const countFactor = Math.min(matches / 3, 1); // Cap at 3 matches
  return Math.min((density * 0.6 + countFactor * 0.4), 1);
}

function calculateSentiment(emotions: EmotionScore[]): number {
  const positiveEmotions = ['joyful', 'grateful', 'peaceful', 'proud', 'hopeful'];
  const negativeEmotions = ['stressed', 'overwhelmed', 'anxious', 'sad',
                            'frustrated', 'exhausted', 'lonely', 'guilty'];

  let score = 0;
  for (const { emotion, confidence } of emotions) {
    if (positiveEmotions.includes(emotion)) {
      score += confidence;
    } else if (negativeEmotions.includes(emotion)) {
      score -= confidence;
    }
  }

  // Normalize to -1 to 1
  return Math.max(-1, Math.min(1, score / emotions.length));
}
```

---

## Notification Adjustment Rules

### 1. Timing Optimization Algorithm

```typescript
function optimizeNotificationTime(
  user: User,
  reminder: HabitReminder,
  emotionalContext: EmotionalContext
): OptimizedSchedule {
  const preferences = emotionalContext.preferences;
  const patterns = emotionalContext.patterns;

  // Base scheduled time
  let scheduledTime = reminder.scheduled_time;
  let adjustmentReason = '';

  // Rule 1: Avoid morning notifications if user shows morning stress pattern
  if (patterns.morning_sentiment < -0.3 && preferences.avoid_morning_notifications) {
    if (scheduledTime.hour < 12) {
      scheduledTime = shiftToAfternoon(scheduledTime);
      adjustmentReason = 'Moved to afternoon due to morning stress pattern';
    }
  }

  // Rule 2: Delay notifications during high stress periods
  const currentStressLevel = emotionalContext.currentState.stress_level;
  if (currentStressLevel >= 4) {
    scheduledTime = delayBy(scheduledTime, 2); // Delay by 2 hours
    adjustmentReason = 'Delayed due to high current stress level';
  }

  // Rule 3: Respect blackout periods
  if (isInBlackoutPeriod(scheduledTime, preferences)) {
    scheduledTime = moveToNextAvailableSlot(scheduledTime, preferences);
    adjustmentReason = 'Moved to next available time slot';
  }

  // Rule 4: Optimize for user's best time based on historical sentiment
  const bestTimeOfDay = findBestTimeOfDay(patterns);
  if (bestTimeOfDay && Math.abs(scheduledTime.hour - bestTimeOfDay) > 3) {
    scheduledTime = adjustToTime(scheduledTime, bestTimeOfDay);
    adjustmentReason = 'Optimized to your typical positive time of day';
  }

  // Rule 5: Ensure minimum interval between notifications
  const lastNotification = getLastNotificationTime(user);
  if (lastNotification) {
    const hoursSince = hoursBetween(lastNotification, scheduledTime);
    if (hoursSince < preferences.min_notification_interval_hours) {
      scheduledTime = addHours(lastNotification, preferences.min_notification_interval_hours);
      adjustmentReason = 'Spaced out to avoid notification fatigue';
    }
  }

  return {
    originalTime: reminder.scheduled_time,
    optimizedTime: scheduledTime,
    adjustment: adjustmentReason,
    confidence: calculateAdjustmentConfidence(emotionalContext)
  };
}
```

### 2. Content Personalization Algorithm

```typescript
function personalizeNotificationContent(
  reminder: HabitReminder,
  emotionalState: EmotionalState
): NotificationContent {
  const { primary_emotion, sentiment_score, stress_level } = emotionalState;

  // Content templates based on emotional state
  const contentStrategies = {
    // High stress/overwhelm: Gentle, permission-giving
    stressed: {
      tone: 'gentle',
      templates: [
        'Sem pressão, mas quando puder: {habit_title}. Você está fazendo o seu melhor.',
        'Um lembrete gentil: {habit_title}. Vá no seu ritmo, mãe.',
        'Que tal {habit_title}? Mas só se você estiver pronta. Tudo bem ir devagar.'
      ],
      includeSupport: true
    },

    overwhelmed: {
      tone: 'gentle',
      templates: [
        'Eu sei que está muito. Mas talvez {habit_title} possa ajudar um pouco.',
        'Respira fundo. Quando puder: {habit_title}. Sem culpa se não der hoje.',
        'Você não precisa fazer tudo. Mas {habit_title} pode ser um momento seu.'
      ],
      includeSupport: true,
      offerToSkip: true
    },

    anxious: {
      tone: 'calming',
      templates: [
        'Um momento de calma: {habit_title}. Isso pode ajudar.',
        '{habit_title} - às vezes pequenos rituais trazem paz.',
        'Lembrete tranquilo: {habit_title}. Você está segura, você está bem.'
      ],
      includeBreathingExercise: true
    },

    sad: {
      tone: 'warm',
      templates: [
        'Você merece cuidado. Que tal {habit_title}?',
        'Um pequeno passo: {habit_title}. Você não está sozinha.',
        '{habit_title} - porque você importa, mãe.'
      ],
      includeSupport: true
    },

    // Neutral/positive: Motivational, encouraging
    joyful: {
      tone: 'enthusiastic',
      templates: [
        'Você está radiante! Hora de {habit_title}!',
        'Mantém essa energia! {habit_title} agora?',
        'Que dia bom! Vamos com {habit_title}?'
      ]
    },

    grateful: {
      tone: 'warm',
      templates: [
        'Gratidão em ação: {habit_title}',
        'Continue cultivando o bem: {habit_title}',
        'Mais um momento especial: {habit_title}'
      ]
    },

    neutral: {
      tone: 'balanced',
      templates: [
        'Lembrete: {habit_title}',
        'Hora de {habit_title}',
        '{habit_title} - você consegue!'
      ]
    }
  };

  // Select strategy based on emotion
  const strategy = contentStrategies[primary_emotion] || contentStrategies.neutral;

  // Select template based on stress level
  const template = strategy.templates[Math.min(stress_level - 1, strategy.templates.length - 1)];

  // Build notification
  const notification: NotificationContent = {
    title: reminder.title,
    message: template.replace('{habit_title}', reminder.title),
    tone: strategy.tone,
    includeSupport: strategy.includeSupport && stress_level >= 3,
    offerToSkip: strategy.offerToSkip,
    includeBreathingExercise: strategy.includeBreathingExercise
  };

  // Add support resources if needed
  if (notification.includeSupport) {
    notification.supportMessage = 'Se precisar conversar, estamos aqui. Ver recursos →';
  }

  return notification;
}
```

### 3. Frequency Adjustment Algorithm

```typescript
function adjustNotificationFrequency(
  user: User,
  emotionalPatterns: EmotionalPattern
): FrequencyAdjustment {
  const baseline = user.notification_preferences.max_daily_notifications;
  let adjusted = baseline;
  let reason = '';

  // Rule 1: Reduce frequency during overwhelm periods
  if (emotionalPatterns.overwhelm_score > 0.6) {
    adjusted = Math.max(1, Math.floor(baseline * 0.5));
    reason = 'Reduced notifications to ease overwhelm';
  }

  // Rule 2: Reduce during high stress
  else if (emotionalPatterns.stress_level >= 4) {
    adjusted = Math.max(1, Math.floor(baseline * 0.7));
    reason = 'Reduced notifications during high stress period';
  }

  // Rule 3: Reduce during high mood volatility
  else if (emotionalPatterns.mood_volatility > 0.7) {
    adjusted = Math.max(2, Math.floor(baseline * 0.8));
    reason = 'Reduced notifications during emotionally volatile period';
  }

  // Rule 4: Maintain or slightly increase during positive periods
  else if (emotionalPatterns.average_sentiment > 0.5) {
    adjusted = Math.min(baseline + 1, 5);
    reason = 'Maintaining consistent support during positive period';
  }

  // Rule 5: Check engagement - reduce if notifications are being ignored
  const recentEngagement = calculateRecentEngagement(user, days = 7);
  if (recentEngagement < 0.3) { // Less than 30% engagement
    adjusted = Math.max(1, adjusted - 1);
    reason += ' | Reduced due to low engagement';
  }

  return {
    original: baseline,
    adjusted,
    reason,
    temporary: true, // Review weekly
    reviewDate: addDays(new Date(), 7)
  };
}
```

### 4. Support Escalation Algorithm

```typescript
function assessSupportNeeds(
  user: User,
  emotionalHistory: DiaryEntry[]
): SupportAssessment {
  const recentEntries = emotionalHistory.slice(0, 14); // Last 14 entries
  const assessment: SupportAssessment = {
    level: 'none',
    reasons: [],
    suggestedResources: [],
    urgency: 'low'
  };

  // Red flags - sustained negative emotions
  const negativeEmotions = ['sad', 'anxious', 'overwhelmed', 'guilty', 'lonely'];
  const negativeStreak = calculateConsecutiveStreak(recentEntries, negativeEmotions);

  // Level 1: Gentle resource suggestion (7+ days of negative emotions)
  if (negativeStreak >= 7) {
    assessment.level = 'gentle_suggestion';
    assessment.reasons.push('Noticed you\'ve been having a tough week');
    assessment.suggestedResources = getResourcesByType(['article', 'meditation']);
    assessment.urgency = 'low';
  }

  // Level 2: Supportive check-in (14+ days or very low sentiment)
  const avgSentiment = average(recentEntries.map(e => e.sentiment_score));
  if (negativeStreak >= 14 || avgSentiment < -0.6) {
    assessment.level = 'supportive_checkin';
    assessment.reasons.push('You\'ve been struggling for a while');
    assessment.suggestedResources = getResourcesByType(['therapist_finder', 'article', 'hotline']);
    assessment.urgency = 'medium';
  }

  // Level 3: Direct resource offer (concerning patterns)
  const concerningKeywords = ['não aguento', 'desistir', 'sem esperança', 'não consigo'];
  const hasConcerningContent = recentEntries.some(entry =>
    concerningKeywords.some(keyword => entry.content.toLowerCase().includes(keyword))
  );

  if (hasConcerningContent || avgSentiment < -0.8) {
    assessment.level = 'direct_offer';
    assessment.reasons.push('Detected signs of significant distress');
    assessment.suggestedResources = getResourcesByType(['hotline', 'therapist_finder']);
    assessment.urgency = 'high';
    assessment.prioritize = true;
  }

  // NEVER diagnose - always frame as support, not treatment
  assessment.message = generateSupportMessage(assessment.level);

  return assessment;
}

function generateSupportMessage(level: SupportLevel): string {
  const messages = {
    gentle_suggestion:
      'Percebemos que você tem passado por momentos difíceis. ' +
      'Lembre-se: pedir ajuda é sinal de força, não fraqueza. ' +
      'Temos alguns recursos que podem ajudar.',

    supportive_checkin:
      'Você tem enfrentado muita coisa ultimamente. ' +
      'Conversar com alguém pode fazer diferença. ' +
      'Que tal conhecer alguns recursos de apoio?',

    direct_offer:
      'Notamos que você está passando por um momento muito difícil. ' +
      'Você não precisa enfrentar isso sozinha. ' +
      'Profissionais treinados podem ajudar. ' +
      'Gostaria de ver opções de suporte?'
  };

  return messages[level] || '';
}
```

---

## Implementation Details

### TypeScript Interfaces

See the separate TypeScript files for complete type definitions.

### Integration Points

1. **Diary Entry Creation**
   - User writes diary entry → Emotion analysis runs → Pattern updated
   - Integration: `DiaryService.createEntry()` → `EmotionAnalyzer.analyze()` → `PatternEngine.update()`

2. **Notification Scheduling**
   - Cron job checks upcoming notifications → Retrieves emotional context → Adjusts timing/content
   - Integration: `NotificationScheduler.process()` → `EmotionService.getContext()` → `NotificationOptimizer.adjust()`

3. **User Dashboard**
   - Display emotional trends and insights
   - Integration: `ProfilePage` → `EmotionalInsights` component

4. **Privacy Controls**
   - User can disable features, delete data, export data
   - Integration: Settings page with granular controls

### Privacy & Ethics

#### Core Principles

1. **Privacy-First Design**
   - All diary content encrypted at rest
   - User can disable AI analysis
   - Easy data deletion
   - No sharing of emotional data

2. **Transparency**
   - Clear explanation of how emotions are detected
   - Show what data is used
   - Explain each adjustment made

3. **User Control**
   - Opt-in, not opt-out
   - Granular settings
   - Manual override always available

4. **Non-Diagnostic**
   - Never claim to diagnose mental health conditions
   - Frame as "support" not "treatment"
   - Professional resources always available

5. **Ethical AI**
   - Prioritize wellbeing over engagement
   - No dark patterns
   - Reduce notifications during distress, don't increase

#### Data Handling

```typescript
// Encryption utilities
async function encryptContent(content: string): Promise<string> {
  // Use Web Crypto API or similar
  // Encrypt with user-specific key derived from auth
}

async function decryptContent(encrypted: string): Promise<string> {
  // Decrypt only when needed
  // Never log decrypted content
}

// Anonymization for analytics
function anonymizeForAnalytics(data: EmotionalPattern): AnalyticsData {
  return {
    // Only aggregated, anonymized data
    avgSentiment: data.average_sentiment,
    stressLevel: data.stress_level,
    // NO user_id, NO content, NO identifying info
  };
}
```

---

## Rollout Plan

### Phase 1: Foundation (Weeks 1-2)
- Implement database schema
- Create diary entry UI
- Basic emotion detection (keywords only)
- Manual emotion tagging

### Phase 2: Pattern Recognition (Weeks 3-4)
- Implement pattern analysis
- Build emotional insights dashboard
- Add emoji detection
- Test with beta users

### Phase 3: Notification Integration (Weeks 5-6)
- Timing optimization algorithm
- Content personalization
- Frequency adjustment
- A/B testing framework

### Phase 4: Support Systems (Weeks 7-8)
- Support escalation logic
- Resource database
- Safety nets and fallbacks
- Crisis resource integration

### Phase 5: Polish & Launch (Weeks 9-10)
- Privacy controls
- User education
- Documentation
- Gradual rollout to 10% → 50% → 100%

---

## Success Metrics

### User Wellbeing (Primary)
- User-reported stress levels (monthly survey)
- Positive emotion ratio in diary entries
- Support resource engagement (quality over quantity)
- Feature satisfaction ratings

### System Performance (Secondary)
- Emotion detection accuracy (manual validation sample)
- Notification engagement rate
- User retention with feature vs without
- Opt-in rate for AI adjustments

### Safety Metrics (Critical)
- False negative rate for support escalation (review sample)
- User reports of inappropriate messaging
- Privacy incident count (target: 0)

### Anti-Metrics (What We DON'T Optimize)
- Total notification count (lower may be better)
- Time in app (quality over quantity)
- Viral sharing (privacy over growth)

---

## Conclusion

This emotional intelligence system is designed to genuinely support mothers' wellbeing through empathetic, privacy-first algorithms. The hybrid approach of rule-based logic and sentiment analysis ensures reliable performance without requiring complex ML infrastructure initially.

The system can evolve over time:
- Start with rule-based algorithms (Phase 1-3)
- Collect anonymized data for patterns
- Optionally introduce ML models later (if proven beneficial)
- Always maintain user control and transparency

**Key Success Factor**: Frame everything through the lens of "How does this help the mother feel supported?" rather than "How does this increase engagement?"
