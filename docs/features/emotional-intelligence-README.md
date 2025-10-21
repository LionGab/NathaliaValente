# Emotional Intelligence System for ClubNath

> **Empathetic, privacy-first AI that personalizes habit notifications based on mothers' emotional states**

---

## Overview

ClubNath's Emotional Intelligence System uses diary entries to understand how mothers are feeling and adjusts habit reminders accordingly. When a mother is overwhelmed, we reduce notifications and use gentler language. When she's thriving, we provide encouraging support.

**Core Philosophy:** Support mothers' mental wellbeing, never exploit their emotions.

---

## Features

### 1. Emotion Detection
- Analyzes diary entries in Portuguese (Brazilian)
- Detects 14 emotional states (joyful, stressed, overwhelmed, etc.)
- Uses keywords, emojis, and user tags
- Confidence scoring (how sure we are)

### 2. Timing Optimization
- Avoids sending notifications during stressful times
- Learns user's best time of day
- Respects blackout periods
- Delays notifications during crisis moments

### 3. Content Personalization
- Gentle tone when user is stressed
- Motivational tone when user is thriving
- Offers support resources when needed
- Permission to skip habits on bad days

### 4. Frequency Adjustment
- Reduces notifications when user is overwhelmed
- Maintains support during positive periods
- Adapts to user engagement patterns

### 5. Support Escalation
- Detects sustained negative emotions
- Offers mental health resources
- Never diagnoses, always supportive
- Escalates to human review when needed

---

## Quick Start

### For Users

1. **Enable the feature** (opt-in)
2. **Write in your diary** about your day
3. **Tag your emotions** (optional - AI will detect them)
4. **Let the AI adjust** your notifications automatically
5. **See insights** about your emotional patterns

### For Developers

1. **Run database migration**
   ```bash
   cd supabase
   psql -d clubnath -f migrations/20251022_emotional_intelligence_system.sql
   ```

2. **Import services**
   ```typescript
   import { analyzeEmotionalContent } from './services/emotionDetection.service';
   import { optimizeNotificationTime } from './services/notificationOptimizer.service';
   ```

3. **Integrate diary feature** (see integration guide)

4. **Set up notification scheduler** (Edge Function)

5. **Add privacy settings** to user profile

---

## Documentation

### Main Documents

1. **[Technical Proposal](./emotional-intelligence-proposal.md)**
   - Full system architecture
   - Database schema
   - Algorithms (pseudocode and TypeScript)
   - Implementation approach
   - Rollout plan

2. **[Example Scenarios](./emotional-intelligence-examples.md)**
   - Input/output examples
   - Real-world use cases
   - Testing scenarios
   - Success stories

3. **[Privacy & Ethics Guide](./emotional-intelligence-privacy-ethics.md)**
   - Privacy-first principles
   - User control and transparency
   - Ethical AI guidelines
   - Compliance (LGPD, GDPR)

4. **[Integration Guide](./emotional-intelligence-integration.md)**
   - Step-by-step integration
   - Code examples
   - API usage
   - Testing guide

### Code Files

1. **Types** - `/src/types/emotional-intelligence.ts`
   - TypeScript interfaces
   - Emotion categories
   - Data structures

2. **Emotion Detection** - `/src/services/emotionDetection.service.ts`
   - Keyword analysis
   - Emoji detection
   - Sentiment scoring
   - Pattern analysis

3. **Notification Optimizer** - `/src/services/notificationOptimizer.service.ts`
   - Timing optimization
   - Content personalization
   - Frequency adjustment
   - Support escalation

4. **Database Migration** - `/supabase/migrations/20251022_emotional_intelligence_system.sql`
   - All tables
   - RLS policies
   - Helper functions
   - Seed data

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    User Interface                    │
├─────────────────────────────────────────────────────┤
│  Diary Entry  │  Insights  │  Settings  │  Habits   │
└────────┬─────────────┬──────────┬─────────────┬─────┘
         │             │          │             │
         ▼             ▼          ▼             ▼
┌─────────────────────────────────────────────────────┐
│                  Services Layer                      │
├──────────────────┬──────────────────┬───────────────┤
│ Emotion Detection│ Pattern Analysis │ Notification  │
│                  │                  │ Optimizer     │
└────────┬─────────┴──────────┬───────┴───────┬───────┘
         │                    │               │
         ▼                    ▼               ▼
┌─────────────────────────────────────────────────────┐
│                   Database (Supabase)                │
├──────────────────┬──────────────────┬───────────────┤
│ diary_entries    │ emotional_patterns│ notifications │
│ (encrypted)      │ (aggregated)     │ (history)     │
└──────────────────┴──────────────────┴───────────────┘
```

---

## Privacy First

### User Control
- ✅ Opt-in (not opt-out)
- ✅ Granular privacy settings
- ✅ Export all data (JSON)
- ✅ Delete all data (hard delete)
- ✅ Disable AI anytime

### Data Protection
- ✅ Encryption at rest (AES-256)
- ✅ Row-level security (RLS)
- ✅ No admin access to diary content
- ✅ Anonymized analytics only
- ✅ LGPD/GDPR compliant

### Transparency
- ✅ Clear explanations
- ✅ Show AI decisions
- ✅ No hidden collection
- ✅ Plain language privacy policy

---

## Example Usage

### User writes diary entry
```
"Hoje foi muito difícil. Bebê chorando o dia todo,
trabalho atrasado. Me sinto sobrecarregada. 😫😭"
```

### System detects emotion
```json
{
  "primaryEmotion": "overwhelmed",
  "confidence": 0.88,
  "sentimentScore": -0.82,
  "stressLevel": 5
}
```

### Habit reminder scheduled (9 AM: "Meditação 10 min")

### AI adjusts
- **Timing:** Delay to 2 PM (avoid morning stress)
- **Content:** "Eu sei que está muito. Mas talvez meditação de 10 min possa ajudar um pouco."
- **Tone:** Gentle (not pushy)
- **Add:** [Skip this today] button

### User sees gentle, timely notification
- More likely to engage (or skip without guilt)
- Feels supported, not pressured

---

## Algorithms at a Glance

### Emotion Detection
1. Tokenize text → Extract keywords
2. Match against emotion keyword dictionary
3. Extract emojis → Match against emoji emotions
4. Aggregate scores → Determine primary emotion
5. Calculate sentiment (-1 to 1)

### Timing Optimization
1. Check current emotional state
2. Check historical patterns (best time of day)
3. Apply rules:
   - Avoid morning if morning_sentiment < -0.3
   - Delay if current stress >= 4
   - Respect blackout periods
4. Return optimized time + reason

### Content Personalization
1. Map emotion → content strategy
2. Select tone (gentle, balanced, enthusiastic, etc.)
3. Choose template appropriate for stress level
4. Add support resources if stress >= 3
5. Offer skip button if overwhelmed

### Frequency Adjustment
1. Calculate overwhelm_score
2. If overwhelm > 0.6 → reduce by 50%
3. If stress >= 4 → reduce by 30%
4. If engagement < 30% → reduce further
5. Review weekly, adjust as needed

### Support Escalation
1. Detect negative emotion streak
2. Calculate average sentiment
3. Check for concerning keywords
4. Level 1 (7 days): Gentle suggestion
5. Level 2 (14 days): Supportive check-in
6. Level 3 (Concerning): Direct offer + human review

---

## Success Metrics

### Primary (User Wellbeing)
- User-reported stress levels ↓
- Positive emotion ratio ↑
- Feature satisfaction ratings
- Support resource engagement (quality)

### Secondary (System Performance)
- Notification engagement rate
- Habit completion rate
- Emotion detection accuracy
- User retention with feature vs without

### Safety Metrics
- Support escalation accuracy
- Privacy incidents (target: 0)
- User reports of inappropriate messaging

### Anti-Metrics (What We DON'T Optimize)
- ❌ Total notification count
- ❌ Time in app
- ❌ Viral sharing

---

## Rollout Plan

### Phase 1: Foundation (Weeks 1-2)
- Database schema
- Diary entry UI
- Basic emotion detection

### Phase 2: Patterns (Weeks 3-4)
- Pattern analysis
- Insights dashboard
- Emoji detection

### Phase 3: Notifications (Weeks 5-6)
- Timing optimization
- Content personalization
- Frequency adjustment

### Phase 4: Support (Weeks 7-8)
- Support escalation
- Resource database
- Safety nets

### Phase 5: Launch (Weeks 9-10)
- Privacy controls
- User education
- Gradual rollout (10% → 50% → 100%)

---

## Tech Stack

- **Frontend:** React + TypeScript
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **AI:** Rule-based algorithms (no ML initially)
- **Encryption:** Web Crypto API (AES-256)
- **Privacy:** Row-Level Security (RLS)
- **Scheduling:** Cron + Edge Functions

---

## Team

- **AI/ML Lead:** Algorithm design, emotion detection
- **Backend Engineer:** Database, Edge Functions, APIs
- **Frontend Engineer:** UI/UX, React components
- **Mental Health Advisor:** Ethical guidelines, content review
- **Privacy/Legal:** LGPD compliance, privacy policy

---

## FAQ

### Is my diary content shared with anyone?
No. Your diary is private. Only you can see it. We analyze emotions locally, but never share the content.

### Can I disable the AI features?
Yes. You have full control. You can disable AI adjustments, stop storing content, or delete everything anytime.

### Does the AI diagnose mental health conditions?
No. We never diagnose. We detect emotions to personalize support, and suggest professional resources when helpful.

### What if I'm in crisis?
If the system detects sustained distress, it will offer mental health resources (CVV hotline, therapist finder). You're never alone.

### Is my data encrypted?
Yes. All diary content can be encrypted with AES-256. You control this in privacy settings.

### Can I export my data?
Yes. One-click export of all your emotional data in JSON format.

### Can I delete my data?
Yes. One-click hard delete. Data is permanently removed, not just hidden.

---

## Contributing

We welcome contributions! Please read:
1. [Code of Conduct](../CODE_OF_CONDUCT.md)
2. [Contributing Guide](../CONTRIBUTING.md)
3. [Privacy Guidelines](./emotional-intelligence-privacy-ethics.md)

**Key Principle:** Always ask "How does this help mothers?" before adding a feature.

---

## License

MIT License - See [LICENSE](../LICENSE) for details

---

## Support

- **Technical Issues:** dev@clubnath.com
- **Privacy Questions:** privacy@clubnath.com
- **Mental Health Resources:** [CVV 188](tel:188)

---

## Acknowledgments

- Emotional keyword research: Brazilian Portuguese maternal mental health literature
- Ethical AI guidelines: OECD AI Principles
- Privacy framework: LGPD best practices
- User testing: ClubNath community beta testers

---

## Version

**v1.0.0** - Initial release (October 2025)

---

**Remember:** We're building technology to serve mothers, not to exploit them. Privacy, empathy, and wellbeing come first. Always.

---

## Next Steps

1. **Read the [Technical Proposal](./emotional-intelligence-proposal.md)** for full details
2. **Review [Example Scenarios](./emotional-intelligence-examples.md)** to understand behavior
3. **Check [Privacy & Ethics Guide](./emotional-intelligence-privacy-ethics.md)** for guidelines
4. **Follow [Integration Guide](./emotional-intelligence-integration.md)** to implement

Let's build something genuinely helpful. ❤️
