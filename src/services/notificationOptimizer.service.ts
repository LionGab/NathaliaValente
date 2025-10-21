/**
 * Notification Optimizer Service
 * Adjusts notification timing, content, and frequency based on emotional state
 */

import type {
  HabitReminder,
  EmotionalContext,
  OptimizedSchedule,
  NotificationContent,
  FrequencyAdjustment,
  SupportAssessment,
  SupportResource,
  ResourceType,
  DiaryEntry,
  EmotionCategory,
  NotificationTone,
  SupportLevel,
  NotificationHistory,
} from '../types/emotional-intelligence';
import { NEGATIVE_EMOTIONS, DEFAULT_ALGORITHM_CONFIG } from '../types/emotional-intelligence';
import { detectEmotionalStreak } from './emotionDetection.service';

// ============================================
// TIMING OPTIMIZATION
// ============================================

/**
 * Optimize notification timing based on emotional context
 */
export function optimizeNotificationTime(
  reminder: HabitReminder,
  emotionalContext: EmotionalContext
): OptimizedSchedule {
  const { currentState, patterns, preferences } = emotionalContext;
  const config = DEFAULT_ALGORITHM_CONFIG.timingOptimization;

  let optimizedTime = parseTime(reminder.scheduled_time);
  let shouldSend = true;
  const adjustments: string[] = [];

  // Rule 1: Skip if user prefers to skip on negative mood
  if (
    reminder.skip_on_negative_mood &&
    NEGATIVE_EMOTIONS.includes(currentState.primary_emotion) &&
    currentState.sentiment_score < -0.4
  ) {
    shouldSend = false;
    adjustments.push('Skipped due to negative mood and user preference');
    return {
      originalTime: reminder.scheduled_time,
      optimizedTime: reminder.scheduled_time,
      adjustment: adjustments.join('; '),
      confidence: 0.9,
      shouldSend,
    };
  }

  // Rule 2: Avoid morning notifications if user shows morning stress
  if (
    config.enableMorningAvoidance &&
    patterns.morning_sentiment < -0.3 &&
    preferences.avoid_morning_notifications &&
    optimizedTime.hour < 12
  ) {
    optimizedTime = { hour: 14, minute: optimizedTime.minute }; // Move to 2 PM
    adjustments.push('Moved to afternoon due to morning stress pattern');
  }

  // Rule 3: Delay during high stress
  if (
    config.enableStressDelay &&
    currentState.stress_level >= 4 &&
    isWithinNextHours(optimizedTime, 2)
  ) {
    optimizedTime = addHours(optimizedTime, config.stressDelayHours);
    adjustments.push(`Delayed ${config.stressDelayHours}h due to high current stress`);
  }

  // Rule 4: Respect blackout periods
  if (preferences.blackout_start && preferences.blackout_end) {
    if (isInBlackoutPeriod(optimizedTime, preferences.blackout_start, preferences.blackout_end)) {
      optimizedTime = moveToNextAvailableSlot(optimizedTime, preferences.blackout_end);
      adjustments.push('Moved outside blackout period');
    }
  }

  // Rule 5: Optimize for historical best time
  if (config.enableHistoricalOptimization) {
    const bestTimeOfDay = findBestTimeOfDay(patterns);
    if (bestTimeOfDay && Math.abs(optimizedTime.hour - bestTimeOfDay) > 3) {
      const originalHour = optimizedTime.hour;
      optimizedTime.hour = bestTimeOfDay;
      adjustments.push(
        `Adjusted from ${originalHour}:00 to ${bestTimeOfDay}:00 based on your positive mood patterns`
      );
    }
  }

  // Rule 6: Ensure minimum interval between notifications
  // (This would require checking notification history - placeholder for now)
  // if (lastNotificationWithinInterval(user, preferences.min_notification_interval_hours)) {
  //   adjustments.push('Delayed to maintain notification spacing');
  // }

  const confidence = calculateOptimizationConfidence(emotionalContext, adjustments.length);

  return {
    originalTime: reminder.scheduled_time,
    optimizedTime: formatTime(optimizedTime),
    adjustment: adjustments.length > 0 ? adjustments.join('; ') : 'No adjustment needed',
    confidence,
    shouldSend,
  };
}

/**
 * Find the best time of day based on sentiment patterns
 */
function findBestTimeOfDay(patterns: EmotionalContext['patterns']): number | null {
  const timeScores = [
    { hour: 9, sentiment: patterns.morning_sentiment },
    { hour: 14, sentiment: patterns.afternoon_sentiment },
    { hour: 19, sentiment: patterns.evening_sentiment },
  ];

  const best = timeScores.sort((a, b) => b.sentiment - a.sentiment)[0];

  // Only return if significantly positive
  return best.sentiment > 0.2 ? best.hour : null;
}

/**
 * Calculate confidence in the optimization
 */
function calculateOptimizationConfidence(
  emotionalContext: EmotionalContext,
  adjustmentCount: number
): number {
  const { patterns } = emotionalContext;

  // More data = higher confidence
  const dataConfidence = Math.min(patterns.entry_count / 20, 1); // Saturate at 20 entries

  // More adjustments = lower confidence (more guessing)
  const adjustmentPenalty = adjustmentCount * 0.1;

  return Math.max(0.3, Math.min(1, dataConfidence - adjustmentPenalty + 0.4));
}

// ============================================
// CONTENT PERSONALIZATION
// ============================================

/**
 * Personalize notification content based on emotional state
 */
export function personalizeNotificationContent(
  reminder: HabitReminder,
  emotionalContext: EmotionalContext
): NotificationContent {
  const { currentState } = emotionalContext;
  const config = DEFAULT_ALGORITHM_CONFIG.contentPersonalization;

  // Get content strategy for current emotion
  const strategy = CONTENT_STRATEGIES[currentState.primary_emotion] || CONTENT_STRATEGIES.neutral;

  // Select appropriate template
  const template = selectTemplate(strategy.templates, currentState.stress_level);
  const message = template.replace('{habit_title}', reminder.title.toLowerCase());

  // Build notification content
  const content: NotificationContent = {
    title: reminder.title,
    message,
    tone: strategy.tone,
  };

  // Add support resources if needed
  if (
    config.enableSupportSuggestions &&
    strategy.includeSupport &&
    currentState.stress_level >= config.supportThresholdStress
  ) {
    content.includeSupport = true;
    content.supportMessage = 'Se precisar conversar, estamos aqui. Ver recursos →';
  }

  // Offer to skip if appropriate
  if (strategy.offerToSkip && currentState.stress_level >= 4) {
    content.offerToSkip = true;
  }

  // Include calming exercises
  if (strategy.includeBreathingExercise && currentState.primary_emotion === 'anxious') {
    content.includeBreathingExercise = true;
  }

  return content;
}

/**
 * Content strategies for each emotion
 */
const CONTENT_STRATEGIES: Record<
  EmotionCategory,
  {
    tone: NotificationTone;
    templates: string[];
    includeSupport?: boolean;
    offerToSkip?: boolean;
    includeBreathingExercise?: boolean;
  }
> = {
  // High stress/overwhelm: Gentle, permission-giving
  stressed: {
    tone: 'gentle',
    templates: [
      'Sem pressão, mas quando puder: {habit_title}. Você está fazendo o seu melhor.',
      'Um lembrete gentil: {habit_title}. Vá no seu ritmo, mãe.',
      'Que tal {habit_title}? Mas só se você estiver pronta. Tudo bem ir devagar.',
      '{habit_title} - sem culpa se não der hoje. Você está dando o seu melhor.',
    ],
    includeSupport: true,
  },

  overwhelmed: {
    tone: 'gentle',
    templates: [
      'Eu sei que está muito. Mas talvez {habit_title} possa ajudar um pouco.',
      'Respira fundo. Quando puder: {habit_title}. Sem culpa se não der hoje.',
      'Você não precisa fazer tudo. Mas {habit_title} pode ser um momento seu.',
      'Está tudo bem não estar bem. {habit_title} quando você conseguir.',
    ],
    includeSupport: true,
    offerToSkip: true,
  },

  anxious: {
    tone: 'calming',
    templates: [
      'Um momento de calma: {habit_title}. Isso pode ajudar.',
      '{habit_title} - às vezes pequenos rituais trazem paz.',
      'Lembrete tranquilo: {habit_title}. Você está segura, você está bem.',
      'Respire fundo. {habit_title} pode trazer um momento de serenidade.',
    ],
    includeBreathingExercise: true,
  },

  sad: {
    tone: 'warm',
    templates: [
      'Você merece cuidado. Que tal {habit_title}?',
      'Um pequeno passo: {habit_title}. Você não está sozinha.',
      '{habit_title} - porque você importa, mãe.',
      'Mesmo nos dias difíceis: {habit_title}. Você é importante.',
    ],
    includeSupport: true,
  },

  exhausted: {
    tone: 'gentle',
    templates: [
      'Sei que você está cansada. {habit_title} pode esperar se precisar.',
      '{habit_title} - mas só se você tiver energia. Descansar também vale.',
      'Um lembrete suave: {habit_title}. Cuide-se primeiro.',
    ],
    offerToSkip: true,
  },

  frustrated: {
    tone: 'balanced',
    templates: [
      'Sei que está difícil. {habit_title} pode ser um respiro.',
      '{habit_title} - um momento para você, longe da frustração.',
      'Respira. {habit_title} quando você estiver pronta.',
    ],
  },

  lonely: {
    tone: 'warm',
    templates: [
      'Você não está sozinha. {habit_title} - estamos aqui com você.',
      '{habit_title} - um momento de conexão consigo mesma.',
      'Lembrete carinhoso: {habit_title}. Você faz parte de uma comunidade.',
    ],
    includeSupport: true,
  },

  guilty: {
    tone: 'warm',
    templates: [
      'Você é uma boa mãe. {habit_title} - sem culpa, só amor.',
      '{habit_title} - você está fazendo o melhor que pode, e isso é suficiente.',
      'Seja gentil consigo mesma. {habit_title} sem julgamentos.',
    ],
  },

  // Neutral/positive: Motivational, encouraging
  joyful: {
    tone: 'enthusiastic',
    templates: [
      'Você está radiante! Hora de {habit_title}!',
      'Mantém essa energia! {habit_title} agora?',
      'Que dia bom! Vamos com {habit_title}?',
      'Sua alegria ilumina! {habit_title} para manter o ritmo.',
    ],
  },

  grateful: {
    tone: 'warm',
    templates: [
      'Gratidão em ação: {habit_title}',
      'Continue cultivando o bem: {habit_title}',
      'Mais um momento especial: {habit_title}',
      'Com gratidão: {habit_title} para honrar seu cuidado.',
    ],
  },

  peaceful: {
    tone: 'calming',
    templates: [
      'Mantendo a paz: {habit_title}',
      'Na serenidade: {habit_title}',
      '{habit_title} - continue nessa energia tranquila.',
    ],
  },

  proud: {
    tone: 'enthusiastic',
    templates: [
      'Você está arrasando! {habit_title} para continuar brilhando.',
      'Conquista após conquista! {habit_title} agora?',
      '{habit_title} - você merece celebrar cada passo.',
    ],
  },

  hopeful: {
    tone: 'motivational',
    templates: [
      'O futuro é brilhante! {habit_title} para seguir em frente.',
      'Com esperança: {habit_title}',
      '{habit_title} - cada passo te leva mais perto.',
    ],
  },

  neutral: {
    tone: 'balanced',
    templates: [
      'Lembrete: {habit_title}',
      'Hora de {habit_title}',
      '{habit_title} - você consegue!',
      'Momento para {habit_title}',
    ],
  },

  reflective: {
    tone: 'balanced',
    templates: [
      'Em seus pensamentos? {habit_title} pode ajudar a processar.',
      '{habit_title} - um momento de introspecção.',
      'Reflita e aja: {habit_title}',
    ],
  },

  uncertain: {
    tone: 'balanced',
    templates: [
      'Mesmo na incerteza: {habit_title}',
      '{habit_title} - pequenos passos contam.',
      'Não precisa ter certeza. Apenas tente: {habit_title}',
    ],
  },
};

/**
 * Select appropriate template based on stress level
 */
function selectTemplate(templates: string[], stressLevel: number): string {
  const index = Math.min(stressLevel - 1, templates.length - 1);
  return templates[Math.max(0, index)];
}

// ============================================
// FREQUENCY ADJUSTMENT
// ============================================

/**
 * Adjust notification frequency based on emotional patterns
 */
export function adjustNotificationFrequency(
  baselineFrequency: number,
  emotionalContext: EmotionalContext,
  recentEngagement: number
): FrequencyAdjustment {
  const { patterns } = emotionalContext;
  const config = DEFAULT_ALGORITHM_CONFIG.frequencyAdjustment;

  let adjusted = baselineFrequency;
  const reasons: string[] = [];

  if (!config.enableAutoReduction) {
    return {
      original: baselineFrequency,
      adjusted: baselineFrequency,
      reason: 'Auto-adjustment disabled',
      temporary: false,
    };
  }

  // Rule 1: Reduce during overwhelm
  if (patterns.overwhelm_score > config.overwhelmThreshold) {
    adjusted = Math.max(config.minNotificationsPerDay, Math.floor(baselineFrequency * 0.5));
    reasons.push('Reduced by 50% to ease overwhelm');
  }

  // Rule 2: Reduce during high stress
  else if (patterns.stress_level >= config.stressThreshold) {
    adjusted = Math.max(config.minNotificationsPerDay, Math.floor(baselineFrequency * 0.7));
    reasons.push('Reduced by 30% during high stress period');
  }

  // Rule 3: Reduce during high mood volatility
  else if (patterns.mood_volatility > 0.7) {
    adjusted = Math.max(config.minNotificationsPerDay, Math.floor(baselineFrequency * 0.8));
    reasons.push('Reduced by 20% during emotionally volatile period');
  }

  // Rule 4: Maintain during positive periods
  else if (patterns.average_sentiment > 0.5) {
    adjusted = baselineFrequency;
    reasons.push('Maintaining frequency during positive period');
  }

  // Rule 5: Reduce if low engagement
  if (recentEngagement < 0.3) {
    adjusted = Math.max(config.minNotificationsPerDay, adjusted - 1);
    reasons.push('Reduced due to low engagement (< 30%)');
  }

  return {
    original: baselineFrequency,
    adjusted,
    reason: reasons.join('; '),
    temporary: true,
    reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  };
}

/**
 * Calculate recent notification engagement
 */
export function calculateRecentEngagement(
  notificationHistory: NotificationHistory[],
  days: number = 7
): number {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const recent = notificationHistory.filter(
    (n) => n.sent_at && new Date(n.sent_at) > cutoff
  );

  if (recent.length === 0) return 1; // Assume good engagement if no data

  const engaged = recent.filter((n) => n.opened || n.action_taken).length;
  return engaged / recent.length;
}

// ============================================
// SUPPORT ESCALATION
// ============================================

/**
 * Assess if user needs support resources
 */
export function assessSupportNeeds(
  recentEntries: DiaryEntry[],
  supportResources: SupportResource[]
): SupportAssessment {
  const config = DEFAULT_ALGORITHM_CONFIG.supportEscalation;

  if (!config.enableAutoSuggestions || recentEntries.length === 0) {
    return {
      level: 'none',
      reasons: [],
      suggestedResources: [],
      urgency: 'low',
      message: '',
    };
  }

  const assessment: SupportAssessment = {
    level: 'none',
    reasons: [],
    suggestedResources: [],
    urgency: 'low',
    message: '',
  };

  // Calculate negative emotion streak
  const negativeStreak = detectEmotionalStreak(recentEntries, NEGATIVE_EMOTIONS);

  // Calculate average sentiment
  const avgSentiment =
    recentEntries.reduce((sum, e) => sum + e.sentiment_score, 0) / recentEntries.length;

  // Check for concerning keywords
  const hasConcerningContent = recentEntries.some((entry) =>
    config.concerningKeywords.some((keyword) =>
      entry.content.toLowerCase().includes(keyword)
    )
  );

  // Level 1: Gentle suggestion (7+ days negative)
  if (negativeStreak >= config.negativeStreakDays) {
    assessment.level = 'gentle_suggestion';
    assessment.reasons.push('Noticed you have been having a tough week');
    assessment.suggestedResources = filterResourcesByType(supportResources, [
      'article',
      'meditation',
    ]);
    assessment.urgency = 'low';
  }

  // Level 2: Supportive check-in (14+ days or very negative sentiment)
  if (negativeStreak >= 14 || avgSentiment < config.sentimentThreshold) {
    assessment.level = 'supportive_checkin';
    assessment.reasons.push('You have been struggling for a while');
    assessment.suggestedResources = filterResourcesByType(supportResources, [
      'therapist_finder',
      'article',
      'hotline',
    ]);
    assessment.urgency = 'medium';
  }

  // Level 3: Direct resource offer (concerning content)
  if (hasConcerningContent || avgSentiment < -0.8) {
    assessment.level = 'direct_offer';
    assessment.reasons.push('Detected signs of significant distress');
    assessment.suggestedResources = filterResourcesByType(supportResources, [
      'hotline',
      'therapist_finder',
    ]);
    assessment.urgency = 'high';
    assessment.prioritize = true;
  }

  assessment.message = generateSupportMessage(assessment.level);

  return assessment;
}

/**
 * Generate appropriate support message
 */
function generateSupportMessage(level: SupportLevel): string {
  const messages: Record<SupportLevel, string> = {
    none: '',
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
      'Gostaria de ver opções de suporte?',
  };

  return messages[level];
}

/**
 * Filter resources by type
 */
function filterResourcesByType(
  resources: SupportResource[],
  types: ResourceType[]
): SupportResource[] {
  return resources
    .filter((r) => r.is_active && types.includes(r.resource_type))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3); // Limit to top 3
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

interface TimeSlot {
  hour: number;
  minute: number;
}

function parseTime(timeString: string): TimeSlot {
  const [hour, minute] = timeString.split(':').map(Number);
  return { hour, minute };
}

function formatTime(time: TimeSlot): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

function addHours(time: TimeSlot, hours: number): TimeSlot {
  let newHour = time.hour + hours;
  const newMinute = time.minute;

  if (newHour >= 24) {
    newHour = newHour % 24;
  }

  return { hour: newHour, minute: newMinute };
}

function isWithinNextHours(time: TimeSlot, hours: number): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const minutesSinceModnight = time.hour * 60 + time.minute;
  const currentMinutesSinceMidnight = currentHour * 60 + currentMinute;
  const diff = minutesSinceModnight - currentMinutesSinceMidnight;

  return diff >= 0 && diff <= hours * 60;
}

function isInBlackoutPeriod(time: TimeSlot, startTime: string, endTime: string): boolean {
  const start = parseTime(startTime);
  const end = parseTime(endTime);

  const minutes = time.hour * 60 + time.minute;
  const startMinutes = start.hour * 60 + start.minute;
  const endMinutes = end.hour * 60 + end.minute;

  if (startMinutes <= endMinutes) {
    return minutes >= startMinutes && minutes <= endMinutes;
  } else {
    // Blackout period crosses midnight
    return minutes >= startMinutes || minutes <= endMinutes;
  }
}

function moveToNextAvailableSlot(_time: TimeSlot, blackoutEnd: string): TimeSlot {
  const end = parseTime(blackoutEnd);
  return addHours(end, 0.5); // 30 minutes after blackout ends
}
