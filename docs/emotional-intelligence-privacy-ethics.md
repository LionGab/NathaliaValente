# Emotional Intelligence System - Privacy & Ethics Guide

## Introduction

The emotional intelligence system handles sensitive emotional and mental health data. This guide outlines our privacy-first approach and ethical principles.

---

## Core Principles

### 1. Privacy by Design

**Data Minimization**
- Collect only what's needed for the feature
- Emotion scores stored, not always full text
- Aggregated patterns, not individual entries
- Auto-delete old data (user configurable)

**Encryption at Rest**
```typescript
// Example: Diary content encryption
interface DiaryEntry {
  content: string;              // Plain text (optional, user choice)
  content_encrypted?: string;   // AES-256 encrypted version
}

// User can choose:
// 1. Store plain text for full AI analysis
// 2. Store encrypted only, limited AI features
// 3. Don't store content at all, only emotions
```

**Encryption in Transit**
- All API calls over HTTPS
- TLS 1.3 minimum
- Certificate pinning on mobile apps

---

### 2. User Control

**Granular Settings**

Users must have full control over:

```typescript
interface PrivacySettings {
  // What to collect
  store_diary_content: boolean;        // Default: true
  encryption_enabled: boolean;          // Default: true
  enable_ai_analysis: boolean;          // Default: true

  // What to share
  share_anonymized_insights: boolean;   // Default: false
  contribute_to_research: boolean;      // Default: false (explicit opt-in)

  // Retention
  auto_delete_after_days: number;       // Default: 365 (1 year)
  delete_on_account_deletion: boolean;  // Default: true (hard delete)
}
```

**Easy Data Export**

Users can export all their data in JSON format:

```json
{
  "export_date": "2025-10-21",
  "user_id": "uuid",
  "diary_entries": [...],
  "emotional_patterns": [...],
  "notification_history": [...],
  "preferences": {...}
}
```

**Right to Delete**

- One-click deletion of all emotional data
- Hard delete (not soft delete)
- Cannot be recovered after deletion
- Confirmation dialog to prevent accidents

```sql
-- Hard delete function
CREATE OR REPLACE FUNCTION delete_all_emotional_data(p_user_id uuid)
RETURNS void AS $$
BEGIN
  DELETE FROM diary_entries WHERE user_id = p_user_id;
  DELETE FROM emotional_patterns WHERE user_id = p_user_id;
  DELETE FROM notification_history WHERE user_id = p_user_id;
  DELETE FROM notification_preferences WHERE user_id = p_user_id;
  DELETE FROM habit_reminders WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 3. Transparency

**Clear Explanations**

Every feature must explain:
1. What data is collected
2. How it's used
3. Who can see it (only you)
4. How to disable it

**Example: First-time Diary Screen**

```
📝 Seu Diário Emocional

Como funciona:
✓ Você escreve seus pensamentos e sentimentos
✓ Nossa IA analisa as emoções (tristeza, alegria, estresse, etc.)
✓ Usamos isso para personalizar suas notificações
✓ SOMENTE VOCÊ pode ver seu diário
✓ Você pode desativar a IA ou deletar tudo a qualquer momento

[Aceito] [Configurar privacidade primeiro]
```

**Show AI Decisions**

When AI adjusts a notification, show why:

```
🔔 Lembrete ajustado

Original: 8:00 AM
Novo horário: 2:00 PM

Por quê?
Percebemos que você geralmente se sente mais estressada
de manhã, então movemos para a tarde.

Não gostou? [Reverter] [Desativar ajustes automáticos]
```

---

### 4. Ethical AI

**Non-Diagnostic**

❌ NEVER say: "Você está deprimida"
✅ ALWAYS say: "Percebemos que você tem se sentido para baixo"

❌ NEVER: Diagnose mental health conditions
✅ ALWAYS: Suggest professional resources

**Wellbeing Over Engagement**

```typescript
// WRONG: Optimize for app usage
function optimizeForEngagement() {
  if (userIsStressed) {
    sendMoreNotifications(); // More stress = more engagement
  }
}

// RIGHT: Optimize for user wellbeing
function optimizeForWellbeing() {
  if (userIsStressed) {
    reduceNotifications(); // Less stress = healthier user
  }
}
```

**No Dark Patterns**

❌ NEVER:
- Make privacy settings hard to find
- Use confusing language
- Default to "share everything"
- Guilt users into keeping features on

✅ ALWAYS:
- Privacy settings in main menu
- Plain language explanations
- Opt-in for sharing, not opt-out
- Respect user choices without nagging

---

### 5. Safety Nets

**Crisis Detection Protocol**

If system detects severe distress:

1. **Never** just send an automated message
2. **Flag** for human review (if user consented)
3. **Provide** crisis resources immediately
4. **Follow up** gently, don't be intrusive

```typescript
interface CrisisProtocol {
  triggers: {
    keywords: string[];        // "não quero viver", "acabar com tudo"
    sentimentThreshold: -0.9;  // Extremely negative
    durationDays: 14;          // Sustained crisis
  };

  response: {
    immediate: {
      action: 'show_crisis_resources';
      resources: ['CVV - 188', 'Emergency contacts'];
      tone: 'direct_but_caring';
    };

    followUp: {
      humanReview: true;  // If user opted in to support
      timeline: '24 hours';
      approach: 'gentle_check_in';
    };
  };
}
```

**Human in the Loop**

For sensitive decisions:
- Support escalation → Review queue for support team
- Crisis detection → Alert trained counselor
- Resource suggestions → Curated by professionals

**Safeguard Against Bias**

```typescript
// Regular audits for bias
interface BiasAudit {
  checkFor: [
    'Cultural bias in keyword detection',
    'Gender bias in support suggestions',
    'Socioeconomic bias in resource access',
    'Age bias in tone selection'
  ];

  mitigations: [
    'Diverse keyword sets (Brazilian Portuguese)',
    'Multiple tone options (not just "motherly")',
    'Free resources prioritized',
    'User preference overrides AI'
  ];
}
```

---

## Data Handling Best Practices

### Storage

```typescript
// Secure storage architecture
interface DataStorage {
  location: 'Supabase (AWS, encrypted at rest)';
  backup: 'Daily encrypted backups';
  retention: 'User-configurable (default: 1 year)';
  deletion: 'Hard delete on user request';

  access: {
    user: 'Full access to own data';
    admins: 'No access to diary content';
    support: 'Only with explicit user permission';
    ai: 'Only if user enabled AI features';
  };
}
```

### Database Row-Level Security (RLS)

```sql
-- Users can ONLY see their own emotional data
CREATE POLICY "Users can view own diary entries"
  ON diary_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Admins CANNOT access user emotional data
-- No policy = no access
```

### API Security

```typescript
// API endpoint example
async function getUserEmotionalContext(userId: string) {
  // 1. Verify authentication
  const user = await getAuthenticatedUser();
  if (!user) throw new UnauthorizedException();

  // 2. Verify authorization (can only access own data)
  if (user.id !== userId) throw new ForbiddenException();

  // 3. Check privacy settings
  const settings = await getPrivacySettings(userId);
  if (!settings.enable_ai_analysis) {
    return { message: 'AI analysis disabled by user' };
  }

  // 4. Return data (already encrypted at rest)
  return await getEmotionalContext(userId);
}
```

---

## Anonymization for Analytics

**What We CAN Track (Anonymized):**

```typescript
interface AnonymizedAnalytics {
  // System performance
  emotionDetectionAccuracy: number;
  averageProcessingTime: number;

  // Aggregate insights (no user ID)
  mostCommonEmotions: EmotionCategory[];
  averageSentimentTrend: number[];

  // Feature usage (anonymous)
  percentUsersWithAiEnabled: number;
  averageNotificationEngagement: number;
}
```

**What We CANNOT Track:**

❌ Individual diary contents
❌ Specific user emotions
❌ Personal patterns
❌ Anything that can identify a user

---

## Compliance

### LGPD (Brazil)

- ✅ Data minimization
- ✅ Explicit consent
- ✅ Right to access
- ✅ Right to deletion
- ✅ Right to portability
- ✅ Privacy by design

### GDPR (If expanding to EU)

- ✅ Lawful basis: Consent
- ✅ Data protection officer
- ✅ Privacy impact assessment
- ✅ Breach notification protocol

### HIPAA (Not applicable, but best practices)

- ✅ No PHI collected
- ✅ No diagnosis provided
- ✅ Encrypted storage and transmission
- ✅ Access controls

---

## Red Lines (Never Cross)

### 1. Never Sell User Data

**Absolutely forbidden:**
- Selling emotional data to advertisers
- Sharing with third parties without explicit consent
- Using for purposes other than stated

### 2. Never Manipulate Emotions

**Forbidden:**
- Intentionally make users feel worse to drive engagement
- Use emotional data for advertising targeting
- Exploit vulnerable states

### 3. Never Claim Medical Authority

**Forbidden:**
- Diagnose mental health conditions
- Replace professional treatment
- Claim to cure or treat disorders

### 4. Never Hide or Obscure

**Forbidden:**
- Hidden data collection
- Confusing privacy settings
- Burying important info in long terms

---

## Incident Response Plan

### Data Breach Protocol

1. **Detect** (automated monitoring)
2. **Contain** (isolate affected systems)
3. **Assess** (what data was exposed?)
4. **Notify** (users within 72 hours)
5. **Remediate** (fix vulnerability)
6. **Review** (prevent future breaches)

### User Notification Template

```
⚠️ Aviso de Segurança

Detectamos um acesso não autorizado aos nossos sistemas em [DATA].

O que aconteceu:
[Explicação clara]

Dados afetados:
[Lista específica]

O que fizemos:
[Ações tomadas]

O que você deve fazer:
[Passos recomendados]

Contato para dúvidas:
seguranca@clubnath.com
```

---

## Ethical Review Board

Before launching:

1. **Internal Review**
   - Engineering team
   - Legal counsel
   - Mental health advisor

2. **External Review**
   - Privacy expert
   - Clinical psychologist
   - User advocate

3. **User Testing**
   - Beta test with real mothers
   - Feedback on privacy comfort
   - Adjust based on concerns

---

## Ongoing Responsibilities

### Monthly
- Review support escalation accuracy
- Audit emotion detection for bias
- Check privacy settings clarity

### Quarterly
- Third-party security audit
- Update privacy policy if needed
- Review and improve safety nets

### Annually
- Full ethical AI audit
- User privacy satisfaction survey
- Refresh training data for keywords

---

## User Education

### Privacy Dashboard

```
🔒 Sua Privacidade

Dados armazenados:
├─ Diário: 47 entradas (criptografadas)
├─ Padrões emocionais: 12 semanas
└─ Histórico de notificações: 6 meses

Seus controles:
├─ IA ativada: Sim [Desativar]
├─ Criptografia: Ativada
├─ Reter dados por: 1 ano [Alterar]
└─ Compartilhar insights: Não

Ações:
[Exportar meus dados]
[Deletar tudo]
[Ver política de privacidade]
```

---

## Conclusion

**Our Promise:**

> "Seus sentimentos são seus. Nós apenas ajudamos você a cuidar melhor de si mesma. Nunca compartilharemos, venderemos ou usaremos suas emoções contra você. Você tem controle total, sempre."

**When in Doubt:**

Ask: "Would I be comfortable if this was my sister's emotional data?"

If no → Don't do it.

---

## Resources

- [LGPD Lei Geral de Proteção de Dados](https://www.gov.br/lgpd)
- [GDPR Guidelines](https://gdpr.eu/)
- [Ethical AI Principles](https://www.oecd.org/going-digital/ai/principles/)
- [Crisis Resources for Developers](https://suicidepreventionlifeline.org/help-yourself/for-developers/)
