# Emotional Intelligence System - Example Scenarios

This document provides concrete examples of how the emotional intelligence system works in practice, including input/output examples and testing scenarios.

---

## Table of Contents

1. [Emotion Detection Examples](#emotion-detection-examples)
2. [Notification Timing Examples](#notification-timing-examples)
3. [Content Personalization Examples](#content-personalization-examples)
4. [Frequency Adjustment Examples](#frequency-adjustment-examples)
5. [Support Escalation Examples](#support-escalation-examples)
6. [End-to-End User Journey](#end-to-end-user-journey)
7. [Testing Scenarios](#testing-scenarios)

---

## Emotion Detection Examples

### Example 1: Joyful Entry

**Input:**
```json
{
  "content": "Hoje foi um dia incrível! Consegui levar a Maria no parque e ela ficou tão feliz brincando. Me sinto muito grata por esses momentos. 😊🌟",
  "user_emotion_tag": null
}
```

**Output:**
```json
{
  "primaryEmotion": "joyful",
  "confidence": 0.82,
  "allEmotions": [
    {
      "emotion": "joyful",
      "confidence": 0.75,
      "source": "keyword",
      "matches": ["incrível", "feliz"]
    },
    {
      "emotion": "joyful",
      "confidence": 0.70,
      "source": "emoji",
      "matches": ["😊", "🌟"]
    },
    {
      "emotion": "grateful",
      "confidence": 0.65,
      "source": "keyword",
      "matches": ["grata"]
    }
  ],
  "sentimentScore": 0.85,
  "detectedEmojis": ["😊", "🌟"],
  "moodIntensity": 4
}
```

---

### Example 2: Overwhelmed Entry

**Input:**
```json
{
  "content": "Não estou aguentando. Bebê chorando, casa bagunçada, trabalho atrasado. É muita coisa ao mesmo tempo. Me sinto sobrecarregada demais. 😭😫",
  "user_emotion_tag": null
}
```

**Output:**
```json
{
  "primaryEmotion": "overwhelmed",
  "confidence": 0.88,
  "allEmotions": [
    {
      "emotion": "overwhelmed",
      "confidence": 0.88,
      "source": "keyword",
      "matches": ["não aguentando", "muita coisa", "sobrecarregada", "demais"]
    },
    {
      "emotion": "overwhelmed",
      "confidence": 0.75,
      "source": "emoji",
      "matches": ["😭", "😫"]
    },
    {
      "emotion": "stressed",
      "confidence": 0.65,
      "source": "keyword",
      "matches": ["atrasado"]
    }
  ],
  "sentimentScore": -0.82,
  "detectedEmojis": ["😭", "😫"],
  "moodIntensity": 5
}
```

---

### Example 3: Mixed Emotions

**Input:**
```json
{
  "content": "Hoje foi difícil, mas consegui terminar aquele projeto. Estou cansada mas também orgulhosa de mim. 💪😌",
  "user_emotion_tag": null
}
```

**Output:**
```json
{
  "primaryEmotion": "proud",
  "confidence": 0.72,
  "allEmotions": [
    {
      "emotion": "proud",
      "confidence": 0.72,
      "source": "keyword",
      "matches": ["consegui", "orgulhosa"]
    },
    {
      "emotion": "proud",
      "confidence": 0.65,
      "source": "emoji",
      "matches": ["💪"]
    },
    {
      "emotion": "exhausted",
      "confidence": 0.60,
      "source": "keyword",
      "matches": ["cansada"]
    },
    {
      "emotion": "peaceful",
      "confidence": 0.55,
      "source": "emoji",
      "matches": ["😌"]
    }
  ],
  "sentimentScore": 0.35,
  "detectedEmojis": ["💪", "😌"],
  "moodIntensity": 3
}
```

---

## Notification Timing Examples

### Scenario 1: Morning Stress Pattern

**User's Emotional Pattern:**
```json
{
  "morning_sentiment": -0.45,
  "afternoon_sentiment": 0.25,
  "evening_sentiment": 0.10,
  "stress_level": 3,
  "avoid_morning_notifications": true
}
```

**Original Reminder:**
```json
{
  "title": "Momento de meditação",
  "scheduled_time": "08:00",
  "adjust_for_emotions": true
}
```

**Optimized Schedule:**
```json
{
  "originalTime": "08:00",
  "optimizedTime": "14:00",
  "adjustment": "Moved to afternoon due to morning stress pattern",
  "confidence": 0.78,
  "shouldSend": true
}
```

**Explanation:** The system detected that the user consistently feels stressed in the mornings, so it moved the meditation reminder to 2 PM when their sentiment is typically more positive.

---

### Scenario 2: High Current Stress

**Current Emotional State:**
```json
{
  "primary_emotion": "overwhelmed",
  "sentiment_score": -0.75,
  "stress_level": 5,
  "lastEntryDate": "2025-10-21T10:30:00Z"
}
```

**Original Reminder:**
```json
{
  "title": "Leitura de 15 minutos",
  "scheduled_time": "11:00",
  "adjust_for_emotions": true
}
```

**Optimized Schedule:**
```json
{
  "originalTime": "11:00",
  "optimizedTime": "13:00",
  "adjustment": "Delayed 2h due to high current stress",
  "confidence": 0.85,
  "shouldSend": true
}
```

**Explanation:** User just recorded an overwhelmed diary entry. The system delays the notification by 2 hours to give them space to recover.

---

### Scenario 3: Skip on Negative Mood

**Current Emotional State:**
```json
{
  "primary_emotion": "sad",
  "sentiment_score": -0.68,
  "stress_level": 4
}
```

**Original Reminder:**
```json
{
  "title": "Exercício físico 30 min",
  "scheduled_time": "18:00",
  "skip_on_negative_mood": true,
  "adjust_for_emotions": true
}
```

**Optimized Schedule:**
```json
{
  "originalTime": "18:00",
  "optimizedTime": "18:00",
  "adjustment": "Skipped due to negative mood and user preference",
  "confidence": 0.90,
  "shouldSend": false
}
```

**Explanation:** User specifically set this reminder to skip when they're feeling down. The system respects this preference.

---

## Content Personalization Examples

### Scenario 1: Stressed State

**Input:**
```json
{
  "reminder": {
    "title": "Beber 2L de água",
    "description": "Hidratação é importante"
  },
  "emotional_state": {
    "primary_emotion": "stressed",
    "sentiment_score": -0.50,
    "stress_level": 4
  }
}
```

**Output:**
```json
{
  "title": "Beber 2L de água",
  "message": "Sem pressão, mas quando puder: beber 2l de água. Você está fazendo o seu melhor.",
  "tone": "gentle",
  "includeSupport": true,
  "supportMessage": "Se precisar conversar, estamos aqui. Ver recursos →"
}
```

---

### Scenario 2: Joyful State

**Input:**
```json
{
  "reminder": {
    "title": "Ler um capítulo do livro"
  },
  "emotional_state": {
    "primary_emotion": "joyful",
    "sentiment_score": 0.75,
    "stress_level": 1
  }
}
```

**Output:**
```json
{
  "title": "Ler um capítulo do livro",
  "message": "Você está radiante! Hora de ler um capítulo do livro!",
  "tone": "enthusiastic",
  "includeSupport": false
}
```

---

### Scenario 3: Overwhelmed State

**Input:**
```json
{
  "reminder": {
    "title": "Organizar a casa por 15 min"
  },
  "emotional_state": {
    "primary_emotion": "overwhelmed",
    "sentiment_score": -0.80,
    "stress_level": 5
  }
}
```

**Output:**
```json
{
  "title": "Organizar a casa por 15 min",
  "message": "Eu sei que está muito. Mas talvez organizar a casa por 15 min possa ajudar um pouco.",
  "tone": "gentle",
  "includeSupport": true,
  "supportMessage": "Se precisar conversar, estamos aqui. Ver recursos →",
  "offerToSkip": true
}
```

---

### Scenario 4: Anxious State

**Input:**
```json
{
  "reminder": {
    "title": "Meditação de 5 minutos"
  },
  "emotional_state": {
    "primary_emotion": "anxious",
    "sentiment_score": -0.40,
    "stress_level": 3
  }
}
```

**Output:**
```json
{
  "title": "Meditação de 5 minutos",
  "message": "Um momento de calma: meditação de 5 minutos. Isso pode ajudar.",
  "tone": "calming",
  "includeBreathingExercise": true
}
```

---

## Frequency Adjustment Examples

### Scenario 1: High Overwhelm Score

**Input:**
```json
{
  "baselineFrequency": 4,
  "emotionalPattern": {
    "overwhelm_score": 0.75,
    "stress_level": 4,
    "mood_volatility": 0.60,
    "average_sentiment": -0.45
  },
  "recentEngagement": 0.65
}
```

**Output:**
```json
{
  "original": 4,
  "adjusted": 2,
  "reason": "Reduced by 50% to ease overwhelm",
  "temporary": true,
  "reviewDate": "2025-10-28T00:00:00Z"
}
```

**Explanation:** User showing high overwhelm. Reduce from 4 to 2 notifications per day to avoid adding pressure.

---

### Scenario 2: Low Engagement

**Input:**
```json
{
  "baselineFrequency": 3,
  "emotionalPattern": {
    "overwhelm_score": 0.30,
    "stress_level": 2,
    "mood_volatility": 0.40,
    "average_sentiment": 0.20
  },
  "recentEngagement": 0.15
}
```

**Output:**
```json
{
  "original": 3,
  "adjusted": 2,
  "reason": "Reduced due to low engagement (< 30%)",
  "temporary": true,
  "reviewDate": "2025-10-28T00:00:00Z"
}
```

**Explanation:** User only engaging with 15% of notifications. Reduce frequency to avoid notification fatigue.

---

### Scenario 3: Positive Period

**Input:**
```json
{
  "baselineFrequency": 3,
  "emotionalPattern": {
    "overwhelm_score": 0.10,
    "stress_level": 1,
    "mood_volatility": 0.25,
    "average_sentiment": 0.68
  },
  "recentEngagement": 0.80
}
```

**Output:**
```json
{
  "original": 3,
  "adjusted": 3,
  "reason": "Maintaining frequency during positive period",
  "temporary": true,
  "reviewDate": "2025-10-28T00:00:00Z"
}
```

**Explanation:** User in a good place emotionally and engaging well. Keep current frequency.

---

## Support Escalation Examples

### Level 1: Gentle Suggestion

**Recent Diary Entries:**
- Day 1-7: Consistent "stressed" and "anxious" emotions
- Average sentiment: -0.35
- No concerning keywords

**Output:**
```json
{
  "level": "gentle_suggestion",
  "reasons": ["Noticed you have been having a tough week"],
  "suggestedResources": [
    {
      "title": "Meditação Guiada para Mães",
      "resource_type": "meditation"
    },
    {
      "title": "Saúde Mental Materna - Artigos",
      "resource_type": "article"
    }
  ],
  "urgency": "low",
  "message": "Percebemos que você tem passado por momentos difíceis. Lembre-se: pedir ajuda é sinal de força, não fraqueza. Temos alguns recursos que podem ajudar."
}
```

---

### Level 2: Supportive Check-in

**Recent Diary Entries:**
- Day 1-14: Mix of "sad", "overwhelmed", "anxious"
- Average sentiment: -0.62
- Streak of 14 negative days

**Output:**
```json
{
  "level": "supportive_checkin",
  "reasons": ["You have been struggling for a while"],
  "suggestedResources": [
    {
      "title": "Mapa da Saúde Mental",
      "resource_type": "therapist_finder"
    },
    {
      "title": "Saúde Mental Materna - Artigos",
      "resource_type": "article"
    },
    {
      "title": "CVV - Centro de Valorização da Vida",
      "resource_type": "hotline"
    }
  ],
  "urgency": "medium",
  "message": "Você tem enfrentado muita coisa ultimamente. Conversar com alguém pode fazer diferença. Que tal conhecer alguns recursos de apoio?"
}
```

---

### Level 3: Direct Offer

**Recent Diary Entries:**
- Day 1-10: Very negative emotions ("sad", "lonely", "overwhelmed")
- Average sentiment: -0.85
- Contains: "não aguento mais", "sem esperança"

**Output:**
```json
{
  "level": "direct_offer",
  "reasons": ["Detected signs of significant distress"],
  "suggestedResources": [
    {
      "title": "CVV - Centro de Valorização da Vida",
      "resource_type": "hotline",
      "phone_number": "188"
    },
    {
      "title": "Mapa da Saúde Mental",
      "resource_type": "therapist_finder"
    }
  ],
  "urgency": "high",
  "prioritize": true,
  "message": "Notamos que você está passando por um momento muito difícil. Você não precisa enfrentar isso sozinha. Profissionais treinados podem ajudar. Gostaria de ver opções de suporte?"
}
```

---

## End-to-End User Journey

### Day 1: Overwhelmed Mother

**Morning - Diary Entry (8:00 AM):**
```
"Acordei exausta. A bebê não dormiu a noite toda. Tenho reunião às 9h e não sei como vou dar conta. Me sinto sobrecarregada. 😫"
```

**Detected Emotion:**
- Primary: `overwhelmed`
- Sentiment: -0.75
- Stress: 5/5

**Scheduled Habit (9:00 AM): "5 minutos de alongamento"**

**AI Decision:**
- ❌ Skip this notification (high stress, too soon)
- Delay to afternoon

**Afternoon - Adjusted Notification (14:00):**
```
Title: "5 minutos de alongamento"
Message: "Eu sei que está muito. Mas talvez 5 minutos de alongamento possa ajudar um pouco."
Tone: Gentle
Include: [Skip button] [Support resources link]
```

**User Action:** Dismissed notification (okay - system learns)

---

### Day 5: Pattern Recognition

**Pattern Detected:**
- 5/5 days: Negative emotions in morning
- Morning sentiment: -0.52
- Best time: Afternoon (sentiment: 0.15)

**System Action:**
- Auto-adjust all morning notifications → afternoon
- Reduce daily notifications from 4 → 3
- Update user preferences: `avoid_morning_notifications = true`

---

### Day 7: Supportive Check-in

**7-day Streak of Negative Emotions Detected**

**Support Assessment:**
- Level: `gentle_suggestion`
- Suggested: Meditation resources, articles

**Special Notification:**
```
Title: "Como você está?"
Message: "Percebemos que você tem passado por momentos difíceis. Lembre-se: pedir ajuda é sinal de força, não fraqueza. Temos alguns recursos que podem ajudar."
[Ver recursos de apoio] [Não, obrigada]
```

---

### Day 14: Positive Turn

**Diary Entry:**
```
"Hoje foi melhor! Consegui descansar um pouco e brincar com a bebê. Me sinto grata. 🙏💕"
```

**Detected Emotion:**
- Primary: `grateful`
- Sentiment: +0.70
- Stress: 2/5

**Scheduled Habit (14:00): "Ler 20 páginas"**

**AI Decision:**
- ✅ Send as scheduled
- Use positive tone

**Notification:**
```
Title: "Ler 20 páginas"
Message: "Continue cultivando o bem: ler 20 páginas"
Tone: Warm
```

**User Action:** Completed habit ✓

**System Learning:**
- Positive reinforcement
- Maintain afternoon timing
- Consider gradually increasing frequency

---

## Testing Scenarios

### A/B Test Framework

#### Test 1: Timing Optimization Impact

**Control Group:**
- Standard fixed-time notifications
- No emotional adjustment

**Test Group:**
- AI-adjusted timing based on emotions

**Metrics:**
- Notification engagement rate
- Habit completion rate
- User-reported stress (weekly survey)

**Expected Result:** Test group shows 15-25% higher engagement

---

#### Test 2: Content Personalization Impact

**Control Group:**
- Generic motivational messages
- Same tone for all users

**Test Group:**
- Emotion-based personalized content
- Dynamic tone adjustment

**Metrics:**
- Notification engagement
- User satisfaction rating
- Opt-out rate

**Expected Result:** Test group shows higher satisfaction, lower opt-out

---

### Edge Cases to Test

1. **New User (No Emotional Data)**
   - Fallback: Use default balanced tone
   - Gradual learning as data accumulates

2. **Privacy-Conscious User**
   - Encryption enabled
   - AI analysis disabled
   - Should still function with reduced features

3. **Highly Volatile Moods**
   - Rapid emotion changes day-to-day
   - System should detect volatility and reduce adjustments

4. **Long Positive Streak**
   - User consistently positive for 30+ days
   - System should maintain support, not withdraw

5. **Crisis Detection False Positive**
   - User uses concerning keywords in neutral context
   - Need human review before escalation

---

### Testing Checklist

- [ ] Emotion detection accuracy (manual validation on 100 entries)
- [ ] Timing adjustments don't create notification spam
- [ ] Support escalation triggers at appropriate thresholds
- [ ] Privacy settings properly enforced
- [ ] Encryption/decryption works correctly
- [ ] RLS policies prevent data leaks
- [ ] Performance: Emotion analysis < 100ms
- [ ] Database queries optimized (< 50ms for pattern retrieval)
- [ ] Notification generation < 200ms
- [ ] User can export all emotional data
- [ ] User can delete all emotional data (hard delete)
- [ ] Fallback behavior when AI fails

---

## Success Stories (Hypothetical)

### Maria's Story

**Before:**
- Getting notifications at 7 AM when rushing to work
- Felt guilty ignoring habit reminders
- Stress level: 8/10

**After (2 weeks):**
- Notifications moved to 2 PM (calmer time)
- Gentle, permission-giving messages
- Completed 60% more habits
- Stress level: 5/10

**Quote:** "It's like the app actually understands what I'm going through. It doesn't push when I can't handle it."

---

### Ana's Story

**Before:**
- Suffering from postpartum depression
- Isolated, not seeking help
- Using app irregularly

**After (3 weeks):**
- System detected prolonged negative pattern
- Received gentle resource suggestions
- Connected with therapist through app resources
- Now using app daily for emotional tracking

**Quote:** "The app noticed I needed help before I was ready to admit it. It gave me the push I needed, but gently."

---

## Conclusion

These examples demonstrate how the emotional intelligence system:

1. **Detects emotions accurately** from Portuguese diary entries
2. **Adjusts timing** to respect user's emotional rhythms
3. **Personalizes content** with appropriate tone and support
4. **Reduces frequency** to avoid overwhelming stressed users
5. **Escalates support** when users may need professional help

All while maintaining **privacy, user control, and ethical AI practices**.
