# Emotional Intelligence System - Integration Guide

This guide helps developers integrate the emotional intelligence system into ClubNath.

---

## Quick Start

### 1. Run Database Migration

```bash
# Apply the emotional intelligence migration
cd supabase
supabase db push

# Or manually run the SQL file
psql -d clubnath -f migrations/20251022_emotional_intelligence_system.sql
```

### 2. Install Dependencies

Already included in `package.json`, but if needed:

```bash
npm install @supabase/supabase-js
# No additional dependencies needed - pure TypeScript implementation
```

### 3. Import Types and Services

```typescript
// In your components
import type {
  DiaryEntry,
  EmotionalContext,
  HabitReminder,
  NotificationContent,
} from '../types/emotional-intelligence';

import {
  analyzeEmotionalContent,
  analyzeEmotionalPatterns,
} from '../services/emotionDetection.service';

import {
  optimizeNotificationTime,
  personalizeNotificationContent,
  adjustNotificationFrequency,
  assessSupportNeeds,
} from '../services/notificationOptimizer.service';
```

---

## Core Integration Points

### 1. Diary Feature

#### Create Diary Entry Component

```typescript
// src/components/DiaryEntryForm.tsx
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { analyzeEmotionalContent } from '../services/emotionDetection.service';
import type { EmotionCategory } from '../types/emotional-intelligence';

export function DiaryEntryForm({ userId }: { userId: string }) {
  const [content, setContent] = useState('');
  const [userEmotionTag, setUserEmotionTag] = useState<EmotionCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Analyze emotions
      const analysis = analyzeEmotionalContent(content, userEmotionTag);

      // 2. Create diary entry
      const { data, error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: userId,
          content,
          detected_emotions: analysis.allEmotions,
          primary_emotion: analysis.primaryEmotion,
          emotion_confidence: analysis.confidence,
          sentiment_score: analysis.sentimentScore,
          emojis: analysis.detectedEmojis,
          user_emotion_tag: userEmotionTag,
          mood_intensity: analysis.moodIntensity,
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Trigger pattern update (async, don't wait)
      updateEmotionalPatterns(userId);

      // 4. Reset form
      setContent('');
      setUserEmotionTag(null);

      alert('Entrada salva com sucesso!');
    } catch (error) {
      console.error('Error saving diary entry:', error);
      alert('Erro ao salvar entrada');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Como você está se sentindo hoje?
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva seus pensamentos e sentimentos..."
          className="w-full p-3 border rounded-lg"
          rows={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Como você descreveria sua emoção? (opcional)
        </label>
        <select
          value={userEmotionTag || ''}
          onChange={(e) => setUserEmotionTag(e.target.value as EmotionCategory || null)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">Deixar a IA detectar</option>
          <option value="joyful">Alegre</option>
          <option value="grateful">Grata</option>
          <option value="peaceful">Tranquila</option>
          <option value="stressed">Estressada</option>
          <option value="overwhelmed">Sobrecarregada</option>
          <option value="anxious">Ansiosa</option>
          <option value="sad">Triste</option>
          {/* Add more options */}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 text-white py-2 rounded-lg"
      >
        {isLoading ? 'Salvando...' : 'Salvar Entrada'}
      </button>
    </form>
  );
}

// Background job to update patterns
async function updateEmotionalPatterns(userId: string) {
  // Fetch recent entries
  const { data: entries } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  if (!entries || entries.length === 0) return;

  // Analyze patterns
  const patterns = analyzeEmotionalPatterns(entries);

  // Save or update weekly pattern
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - 7);

  await supabase
    .from('emotional_patterns')
    .upsert({
      user_id: userId,
      period_start: periodStart.toISOString(),
      period_end: new Date().toISOString(),
      period_type: 'weekly',
      dominant_emotions: patterns.dominantEmotions,
      average_sentiment: patterns.averageSentiment,
      mood_volatility: patterns.moodVolatility,
      morning_sentiment: patterns.morningSentiment,
      afternoon_sentiment: patterns.afternoonSentiment,
      evening_sentiment: patterns.eveningSentiment,
      stress_level: patterns.stressLevel,
      overwhelm_score: patterns.overwhelmScore,
      gratitude_count: patterns.gratitudeCount,
      joy_count: patterns.joyCount,
      entry_count: entries.length,
    });
}
```

---

### 2. Habit Reminder System

#### Create Habit Reminder Component

```typescript
// src/components/HabitReminderForm.tsx
export function HabitReminderForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [adjustForEmotions, setAdjustForEmotions] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from('habit_reminders')
      .insert({
        user_id: userId,
        title,
        scheduled_time: scheduledTime,
        frequency: 'daily',
        adjust_for_emotions: adjustForEmotions,
      });

    if (error) {
      console.error('Error creating habit:', error);
      return;
    }

    alert('Hábito criado com sucesso!');
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex: Beber 2L de água"
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="time"
        value={scheduledTime}
        onChange={(e) => setScheduledTime(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={adjustForEmotions}
          onChange={(e) => setAdjustForEmotions(e.target.checked)}
        />
        <span>Ajustar horário baseado nas minhas emoções</span>
      </label>

      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
        Criar Hábito
      </button>
    </form>
  );
}
```

---

### 3. Notification Scheduler (Backend/Edge Function)

Create a Supabase Edge Function for scheduled notifications:

```typescript
// supabase/functions/process-notifications/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  optimizeNotificationTime,
  personalizeNotificationContent,
} from './notificationOptimizer.service.ts'; // Copy from src/services

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Get all active reminders due in next hour
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const { data: reminders } = await supabase
    .from('habit_reminders')
    .select('*')
    .eq('is_active', true)
    .gte('next_scheduled_at', now.toISOString())
    .lte('next_scheduled_at', oneHourLater.toISOString());

  if (!reminders) {
    return new Response('No reminders to process', { status: 200 });
  }

  // Process each reminder
  for (const reminder of reminders) {
    try {
      // Get user's emotional context
      const { data: contextData } = await supabase
        .rpc('get_user_emotional_context', {
          p_user_id: reminder.user_id,
          p_days: 7,
        });

      if (!contextData || !reminder.adjust_for_emotions) {
        // Send without adjustment
        await sendNotification(reminder, reminder.title);
        continue;
      }

      const emotionalContext = contextData;

      // Optimize timing
      const optimized = optimizeNotificationTime(reminder, emotionalContext);

      if (!optimized.shouldSend) {
        // Skip this notification
        await logSkippedNotification(reminder, optimized.adjustment);
        continue;
      }

      // Personalize content
      const content = personalizeNotificationContent(reminder, emotionalContext);

      // Send notification
      await sendNotification(reminder, content.message, content.tone);

      // Log notification
      await supabase.from('notification_history').insert({
        user_id: reminder.user_id,
        habit_reminder_id: reminder.id,
        title: content.title,
        message: content.message,
        notification_type: 'habit',
        user_emotional_state: emotionalContext.currentState,
        adjustment_applied: optimized.adjustment,
        scheduled_for: reminder.next_scheduled_at,
        sent_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error processing reminder:', error);
    }
  }

  return new Response('Notifications processed', { status: 200 });
});

async function sendNotification(
  reminder: any,
  message: string,
  tone?: string
) {
  // Implement your notification sending logic
  // Could be: Push notifications, Email, SMS, etc.
  console.log(`Sending to ${reminder.user_id}: ${message}`);
}

async function logSkippedNotification(reminder: any, reason: string) {
  // Log that notification was skipped
  console.log(`Skipped reminder ${reminder.id}: ${reason}`);
}
```

**Schedule this function to run every hour:**

```bash
# Using cron or cloud scheduler
0 * * * * curl -X POST https://your-project.supabase.co/functions/v1/process-notifications
```

---

### 4. Emotional Insights Dashboard

```typescript
// src/components/EmotionalInsightsDashboard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { EmotionalPattern } from '../types/emotional-intelligence';

export function EmotionalInsightsDashboard({ userId }: { userId: string }) {
  const [pattern, setPattern] = useState<EmotionalPattern | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmotionalPattern();
  }, [userId]);

  const loadEmotionalPattern = async () => {
    const { data } = await supabase
      .from('emotional_patterns')
      .select('*')
      .eq('user_id', userId)
      .eq('period_type', 'weekly')
      .order('period_start', { ascending: false })
      .limit(1)
      .single();

    setPattern(data);
    setLoading(false);
  };

  if (loading) return <div>Carregando insights...</div>;
  if (!pattern) return <div>Nenhum dado emocional ainda. Comece escrevendo no seu diário!</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Seus Insights Emocionais</h2>

      {/* Sentiment Trend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Tendência Emocional</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            {pattern.average_sentiment > 0.3 ? '😊' :
             pattern.average_sentiment < -0.3 ? '😔' : '😐'}
          </div>
          <div>
            <p className="text-2xl font-bold">
              {(pattern.average_sentiment * 100).toFixed(0)}%
            </p>
            <p className="text-sm text-gray-600">
              {pattern.average_sentiment > 0 ? 'Positivo' : 'Negativo'}
            </p>
          </div>
        </div>
      </div>

      {/* Time of Day Insights */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Seu Melhor Momento do Dia</h3>
        <div className="space-y-2">
          <TimeBar label="Manhã" sentiment={pattern.morning_sentiment} />
          <TimeBar label="Tarde" sentiment={pattern.afternoon_sentiment} />
          <TimeBar label="Noite" sentiment={pattern.evening_sentiment} />
        </div>
      </div>

      {/* Stress Level */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Nível de Estresse</h3>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`w-8 h-8 rounded ${
                level <= pattern.stress_level ? 'bg-red-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {pattern.stress_level <= 2 ? 'Baixo' :
           pattern.stress_level <= 3 ? 'Moderado' : 'Alto'}
        </p>
      </div>

      {/* Positive Moments */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Momentos Positivos</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl">🙏</p>
            <p className="text-xl font-bold">{pattern.gratitude_count}</p>
            <p className="text-sm text-gray-600">Momentos de gratidão</p>
          </div>
          <div>
            <p className="text-3xl">😊</p>
            <p className="text-xl font-bold">{pattern.joy_count}</p>
            <p className="text-sm text-gray-600">Momentos de alegria</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeBar({ label, sentiment }: { label: string; sentiment: number }) {
  const percentage = ((sentiment + 1) / 2) * 100; // Convert -1:1 to 0:100

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{sentiment > 0 ? '😊' : sentiment < 0 ? '😔' : '😐'}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            sentiment > 0 ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

---

### 5. Privacy Settings Component

```typescript
// src/components/PrivacySettings.tsx
export function PrivacySettings({ userId }: { userId: string }) {
  const [settings, setSettings] = useState({
    ai_adjustment_enabled: true,
    store_diary_content: true,
    encryption_enabled: true,
    enable_support_resources: true,
  });

  useEffect(() => {
    loadSettings();
  }, [userId]);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setSettings({
        ai_adjustment_enabled: data.ai_adjustment_enabled,
        store_diary_content: data.store_diary_content,
        encryption_enabled: data.encryption_enabled,
        enable_support_resources: data.enable_support_resources,
      });
    }
  };

  const updateSettings = async (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));

    await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        [key]: value,
        updated_at: new Date().toISOString(),
      });
  };

  const exportData = async () => {
    // Fetch all user data
    const { data: diary } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId);

    const { data: patterns } = await supabase
      .from('emotional_patterns')
      .select('*')
      .eq('user_id', userId);

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      diary_entries: diary,
      emotional_patterns: patterns,
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotional-data-${new Date().toISOString()}.json`;
    a.click();
  };

  const deleteAllData = async () => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;

    await supabase.rpc('delete_all_emotional_data', { p_user_id: userId });
    alert('Todos os dados emocionais foram deletados.');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configurações de Privacidade</h2>

      <div className="space-y-4">
        <ToggleSetting
          label="Ajustes de IA ativados"
          description="Permitir que a IA ajuste notificações baseado nas suas emoções"
          checked={settings.ai_adjustment_enabled}
          onChange={(v) => updateSettings('ai_adjustment_enabled', v)}
        />

        <ToggleSetting
          label="Armazenar conteúdo do diário"
          description="Manter o texto completo do diário (necessário para análise de IA)"
          checked={settings.store_diary_content}
          onChange={(v) => updateSettings('store_diary_content', v)}
        />

        <ToggleSetting
          label="Criptografia ativada"
          description="Criptografar o conteúdo do seu diário"
          checked={settings.encryption_enabled}
          onChange={(v) => updateSettings('encryption_enabled', v)}
        />

        <ToggleSetting
          label="Recursos de apoio"
          description="Mostrar recursos de saúde mental quando necessário"
          checked={settings.enable_support_resources}
          onChange={(v) => updateSettings('enable_support_resources', v)}
        />
      </div>

      <div className="border-t pt-4 space-y-2">
        <button
          onClick={exportData}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Exportar Meus Dados
        </button>

        <button
          onClick={deleteAllData}
          className="w-full bg-red-600 text-white py-2 rounded"
        >
          Deletar Todos os Dados Emocionais
        </button>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1"
      />
    </div>
  );
}
```

---

## Testing

### Unit Tests

```typescript
// src/services/__tests__/emotionDetection.test.ts
import { describe, it, expect } from 'vitest';
import { analyzeEmotionalContent } from '../emotionDetection.service';

describe('Emotion Detection', () => {
  it('should detect joyful emotion', () => {
    const result = analyzeEmotionalContent('Hoje foi um dia incrível! Estou muito feliz! 😊');

    expect(result.primaryEmotion).toBe('joyful');
    expect(result.sentimentScore).toBeGreaterThan(0.5);
  });

  it('should detect overwhelmed emotion', () => {
    const result = analyzeEmotionalContent('Não aguento mais. Muita coisa ao mesmo tempo. 😫');

    expect(result.primaryEmotion).toBe('overwhelmed');
    expect(result.sentimentScore).toBeLessThan(-0.5);
  });

  it('should handle user emotion tag with higher priority', () => {
    const result = analyzeEmotionalContent('Hoje foi normal.', 'joyful');

    expect(result.allEmotions).toContainEqual(
      expect.objectContaining({
        emotion: 'joyful',
        source: 'user_tag',
      })
    );
  });
});
```

---

## Deployment Checklist

- [ ] Database migration applied
- [ ] Edge function deployed
- [ ] Cron job scheduled (hourly notification processing)
- [ ] Privacy policy updated
- [ ] User onboarding flow created
- [ ] Analytics tracking configured (anonymized)
- [ ] Error monitoring set up
- [ ] Beta testing with 10-20 users
- [ ] Accessibility tested
- [ ] Performance tested (emotion analysis < 100ms)
- [ ] Security audit completed

---

## Monitoring

### Key Metrics to Track

```typescript
interface SystemMetrics {
  // Performance
  emotionDetectionTime: number; // ms
  notificationProcessingTime: number; // ms

  // Accuracy
  userManualCorrections: number; // When user changes AI-detected emotion
  supportEscalationAccuracy: number; // True positives vs false positives

  // Engagement
  notificationOpenRate: number;
  habitCompletionRate: number;
  diaryEntryFrequency: number;

  // Privacy
  optOutRate: number; // Users disabling AI
  dataExportRequests: number;
  dataDeletionRequests: number;
}
```

---

## Support

For questions or issues:
- Email: dev@clubnath.com
- GitHub: github.com/clubnath/emotional-intelligence
- Docs: docs.clubnath.com/emotional-intelligence

---

Happy coding! Remember: We're building tools to support mothers, not to exploit them. Keep empathy at the core of everything.
