/**
 * Emotion Detection Service
 * Analyzes diary entries to extract emotional signals
 */

import type {
  EmotionCategory,
  EmotionalAnalysis,
  EmotionScore,
  EmotionDetectionConfig,
  DiaryEntry,
} from '../types/emotional-intelligence';
import {
  POSITIVE_EMOTIONS,
  NEGATIVE_EMOTIONS,
  DEFAULT_ALGORITHM_CONFIG,
} from '../types/emotional-intelligence';

// ============================================
// EMOTION KEYWORDS (Portuguese - Brazilian)
// ============================================

export const EMOTION_KEYWORDS: Record<EmotionCategory, string[]> = {
  // Positive emotions
  joyful: [
    'feliz',
    'alegre',
    'contente',
    'animada',
    'radiante',
    'sorrindo',
    'rindo',
    'felicidade',
    'alegria',
    'vibrand',
  ],
  grateful: [
    'grata',
    'agradecida',
    'abençoada',
    'sortuda',
    'privilegiada',
    'obrigada',
    'gratidão',
    'agradeç',
    'bênção',
  ],
  peaceful: [
    'calma',
    'tranquila',
    'serena',
    'paz',
    'relaxada',
    'descansada',
    'tranquilidade',
    'serenidade',
    'pacífica',
  ],
  proud: [
    'orgulhosa',
    'realizada',
    'conquista',
    'sucesso',
    'consegui',
    'orgulho',
    'vitória',
    'alcancei',
  ],
  hopeful: [
    'esperança',
    'otimista',
    'confiante',
    'esperançosa',
    'vai dar certo',
    'futuro',
    'melhor',
    'confiança',
    'otimismo',
  ],

  // Negative emotions
  stressed: [
    'estressada',
    'pressionada',
    'tensão',
    'stress',
    'estresse',
    'pressão',
    'tensa',
    'nervosa',
  ],
  overwhelmed: [
    'sobrecarregada',
    'não aguento',
    'muito',
    'demais',
    'sufocada',
    'sobrecarga',
    'peso',
    'cansada demais',
    'não dou conta',
  ],
  anxious: [
    'ansiosa',
    'preocupada',
    'nervosa',
    'medo',
    'insegura',
    'ansiedade',
    'preocupação',
    'insegurança',
    'apreensiva',
  ],
  sad: [
    'triste',
    'down',
    'pra baixo',
    'deprimida',
    'melancólica',
    'chorando',
    'tristeza',
    'chorei',
    'lágrimas',
    'vontade de chorar',
  ],
  frustrated: [
    'frustrada',
    'irritada',
    'raiva',
    'brava',
    'chateada',
    'frustração',
    'irritação',
    'ódio',
    'revoltada',
  ],
  exhausted: [
    'exausta',
    'cansada',
    'sem energia',
    'esgotada',
    'acabada',
    'exaustão',
    'cansaço',
    'fadiga',
    'sem forças',
  ],
  lonely: [
    'sozinha',
    'isolada',
    'solitária',
    'abandonada',
    'sem apoio',
    'solidão',
    'isolamento',
    'desamparada',
  ],
  guilty: [
    'culpada',
    'culpa',
    'mãe ruim',
    'não sou boa',
    'falhei',
    'fracasso',
    'inadequada',
    'não merec',
    'deveria',
  ],

  // Neutral
  neutral: ['normal', 'ok', 'bem', 'regular', 'comum', 'típico'],
  reflective: ['pensando', 'refletindo', 'reflexão', 'considero', 'pensei', 'meditando'],
  uncertain: ['não sei', 'dúvida', 'incerta', 'confusa', 'indecisa', 'talvez', 'será'],
};

// ============================================
// EMOJI EMOTIONS
// ============================================

export const EMOJI_EMOTIONS: Record<EmotionCategory, string[]> = {
  joyful: ['😊', '😄', '🥰', '😍', '🤗', '🎉', '✨', '💖', '😁', '😀', '🌟', '💕', '🥳'],
  grateful: ['🙏', '💝', '🌟', '🌈', '💐', '🙌', '❤️'],
  peaceful: ['😌', '🧘‍♀️', '🌸', '🕊️', '☮️', '🌺', '🍃', '🌿'],
  proud: ['💪', '🏆', '👏', '🎯', '⭐', '🌟'],
  hopeful: ['🌈', '✨', '🌅', '🌄', '💫', '🦋'],

  sad: ['😢', '😭', '😔', '💔', '😞', '😿', '🥺', '😓'],
  stressed: ['😫', '😩', '😰', '🤯', '😤'],
  overwhelmed: ['😵', '🥴', '😖', '😣'],
  anxious: ['😟', '😨', '😰', '😱', '😬'],
  frustrated: ['😤', '😠', '😡', '🤬', '😾'],
  exhausted: ['😴', '😪', '🥱', '😵‍💫', '💤'],
  lonely: ['😔', '🥀', '💔'],
  guilty: ['😞', '😔', '😢'],

  neutral: ['😐', '😑', '🙂'],
  reflective: ['🤔', '💭', '🧐'],
  uncertain: ['😕', '🤷‍♀️', '😶', '🤔'],
};

// ============================================
// EMOTION DETECTION FUNCTIONS
// ============================================

/**
 * Main emotion detection function
 */
export function analyzeEmotionalContent(
  content: string,
  userEmotionTag?: EmotionCategory,
  config: EmotionDetectionConfig = DEFAULT_ALGORITHM_CONFIG.emotionDetection
): EmotionalAnalysis {
  const emotions: EmotionScore[] = [];
  const normalizedContent = content.toLowerCase();

  // 1. User-tagged emotion (highest priority)
  if (userEmotionTag) {
    emotions.push({
      emotion: userEmotionTag,
      confidence: config.sentimentWeighting.userTag,
      source: 'user_tag',
    });
  }

  // 2. Keyword Analysis
  if (config.enableKeywordAnalysis) {
    const keywordEmotions = detectKeywordEmotions(normalizedContent);
    emotions.push(...keywordEmotions);
  }

  // 3. Emoji Analysis
  if (config.enableEmojiAnalysis) {
    const emojis = extractEmojis(content);
    const emojiEmotions = detectEmojiEmotions(emojis);
    emotions.push(...emojiEmotions);
  }

  // 4. Aggregate and deduplicate emotions
  const aggregated = aggregateEmotionScores(emotions);

  // 5. Filter by confidence threshold
  const filtered = aggregated.filter((e) => e.confidence >= config.confidenceThreshold);

  // 6. Calculate sentiment score
  const sentiment = calculateSentiment(filtered.length > 0 ? filtered : aggregated);

  // 7. Determine primary emotion
  const sorted = filtered.length > 0 ? filtered : aggregated;
  sorted.sort((a, b) => b.confidence - a.confidence);
  const primary = sorted[0] || { emotion: 'neutral' as EmotionCategory, confidence: 0.5 };

  // 8. Estimate mood intensity based on keyword intensity and frequency
  const moodIntensity = estimateMoodIntensity(normalizedContent, aggregated);

  return {
    primaryEmotion: primary.emotion,
    confidence: primary.confidence,
    allEmotions: sorted,
    sentimentScore: sentiment,
    detectedEmojis: extractEmojis(content),
    moodIntensity,
  };
}

/**
 * Detect emotions from keywords
 */
function detectKeywordEmotions(normalizedContent: string): EmotionScore[] {
  const words = tokenize(normalizedContent);
  const emotions: EmotionScore[] = [];

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    const matches: string[] = [];

    for (const keyword of keywords) {
      // Check for partial matches (e.g., "agradeç" matches "agradecer", "agradecida")
      const found = words.filter((word) => word.includes(keyword) || keyword.includes(word));
      matches.push(...found);
    }

    if (matches.length > 0) {
      const confidence = calculateKeywordConfidence(matches.length, words.length);
      emotions.push({
        emotion: emotion as EmotionCategory,
        confidence,
        source: 'keyword',
        matches: [...new Set(matches)], // Remove duplicates
      });
    }
  }

  return emotions;
}

/**
 * Detect emotions from emojis
 */
function detectEmojiEmotions(emojis: string[]): EmotionScore[] {
  const emotions: EmotionScore[] = [];

  if (emojis.length === 0) return emotions;

  for (const [emotion, emojiList] of Object.entries(EMOJI_EMOTIONS)) {
    const matches = emojis.filter((emoji) => emojiList.includes(emoji));

    if (matches.length > 0) {
      const confidence = calculateEmojiConfidence(matches.length, emojis.length);
      emotions.push({
        emotion: emotion as EmotionCategory,
        confidence,
        source: 'emoji',
        matches,
      });
    }
  }

  return emotions;
}

/**
 * Extract emojis from text
 */
export function extractEmojis(text: string): string[] {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  return text.match(emojiRegex) || [];
}

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // Remove punctuation, keep letters and numbers
    .split(/\s+/)
    .filter((word) => word.length > 2); // Remove very short words
}

/**
 * Calculate confidence for keyword detection
 */
function calculateKeywordConfidence(matchCount: number, totalWords: number): number {
  if (totalWords === 0) return 0;

  // Confidence based on:
  // 1. Match density (how many matches relative to total words)
  // 2. Absolute count (more matches = higher confidence)
  const density = matchCount / Math.max(totalWords, 1);
  const countFactor = Math.min(matchCount / 3, 1); // Saturate at 3 matches

  // Weighted combination
  const confidence = density * 0.5 + countFactor * 0.5;

  return Math.min(confidence, 1);
}

/**
 * Calculate confidence for emoji detection
 */
function calculateEmojiConfidence(matchCount: number, totalEmojis: number): number {
  if (totalEmojis === 0) return 0;

  // Emojis are more explicit than keywords, so higher base confidence
  const ratio = matchCount / totalEmojis;
  return Math.min(ratio * 0.8 + 0.2, 1); // Base of 0.2, up to 1.0
}

/**
 * Aggregate multiple emotion scores for the same emotion
 */
function aggregateEmotionScores(emotions: EmotionScore[]): EmotionScore[] {
  const aggregated = new Map<EmotionCategory, EmotionScore>();

  for (const emotion of emotions) {
    const existing = aggregated.get(emotion.emotion);

    if (existing) {
      // Combine confidences (weighted average based on source)
      const weight1 = getSourceWeight(existing.source);
      const weight2 = getSourceWeight(emotion.source);
      const totalWeight = weight1 + weight2;

      const combinedConfidence =
        (existing.confidence * weight1 + emotion.confidence * weight2) / totalWeight;

      aggregated.set(emotion.emotion, {
        emotion: emotion.emotion,
        confidence: Math.min(combinedConfidence, 1),
        source: existing.source, // Keep original source
        matches: [...(existing.matches || []), ...(emotion.matches || [])],
      });
    } else {
      aggregated.set(emotion.emotion, emotion);
    }
  }

  return Array.from(aggregated.values());
}

/**
 * Get weight for different emotion sources
 */
function getSourceWeight(source: EmotionScore['source']): number {
  switch (source) {
    case 'user_tag':
      return 1.0; // Highest weight - user explicitly said this
    case 'keyword':
      return 0.7;
    case 'emoji':
      return 0.5;
    case 'ml_model':
      return 0.8;
    default:
      return 0.5;
  }
}

/**
 * Calculate overall sentiment score (-1 to 1)
 */
export function calculateSentiment(emotions: EmotionScore[]): number {
  if (emotions.length === 0) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  for (const { emotion, confidence } of emotions) {
    const weight = confidence;

    if (POSITIVE_EMOTIONS.includes(emotion)) {
      totalScore += weight;
    } else if (NEGATIVE_EMOTIONS.includes(emotion)) {
      totalScore -= weight;
    }
    // Neutral emotions don't affect sentiment

    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  // Normalize to -1 to 1 range
  const normalized = totalScore / totalWeight;
  return Math.max(-1, Math.min(1, normalized));
}

/**
 * Estimate mood intensity (1-5 scale)
 */
function estimateMoodIntensity(content: string, emotions: EmotionScore[]): number {
  // Intensity indicators in Portuguese
  const intensifiers = [
    'muito',
    'demais',
    'extremamente',
    'super',
    'mega',
    'completamente',
    'totalmente',
    'absolutamente',
  ];
  const diminishers = ['pouco', 'um pouco', 'meio', 'levemente', 'ligeiramente'];

  let baseIntensity = 3; // Neutral

  // Adjust based on emotion confidence
  const maxConfidence = Math.max(...emotions.map((e) => e.confidence), 0.5);
  baseIntensity = 2 + maxConfidence * 3; // 2-5 range

  // Adjust based on intensifiers/diminishers
  const hasIntensifier = intensifiers.some((word) => content.includes(word));
  const hasDiminisher = diminishers.some((word) => content.includes(word));

  if (hasIntensifier) baseIntensity = Math.min(5, baseIntensity + 1);
  if (hasDiminisher) baseIntensity = Math.max(1, baseIntensity - 1);

  return Math.round(baseIntensity);
}

// ============================================
// PATTERN ANALYSIS
// ============================================

/**
 * Analyze emotional patterns from multiple diary entries
 */
export function analyzeEmotionalPatterns(entries: DiaryEntry[]): {
  dominantEmotions: EmotionScore[];
  averageSentiment: number;
  moodVolatility: number;
  morningSentiment: number;
  afternoonSentiment: number;
  eveningSentiment: number;
  stressLevel: number;
  overwhelmScore: number;
  gratitudeCount: number;
  joyCount: number;
} {
  if (entries.length === 0) {
    return {
      dominantEmotions: [],
      averageSentiment: 0,
      moodVolatility: 0,
      morningSentiment: 0,
      afternoonSentiment: 0,
      eveningSentiment: 0,
      stressLevel: 1,
      overwhelmScore: 0,
      gratitudeCount: 0,
      joyCount: 0,
    };
  }

  // Calculate dominant emotions across all entries
  const allEmotions = entries.flatMap((e) => e.detected_emotions);
  const dominantEmotions = aggregateEmotionScores(allEmotions)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);

  // Calculate average sentiment
  const averageSentiment = entries.reduce((sum, e) => sum + e.sentiment_score, 0) / entries.length;

  // Calculate mood volatility (standard deviation of sentiment)
  const sentimentVariance =
    entries.reduce((sum, e) => sum + Math.pow(e.sentiment_score - averageSentiment, 2), 0) /
    entries.length;
  const moodVolatility = Math.sqrt(sentimentVariance);

  // Time-based sentiment analysis
  const { morning, afternoon, evening } = categorizeByTimeOfDay(entries);
  const morningSentiment = calculateAverageSentiment(morning);
  const afternoonSentiment = calculateAverageSentiment(afternoon);
  const eveningSentiment = calculateAverageSentiment(evening);

  // Stress and overwhelm metrics
  const stressEntries = entries.filter((e) => e.primary_emotion === 'stressed');
  const overwhelmEntries = entries.filter((e) => e.primary_emotion === 'overwhelmed');
  const stressLevel = Math.min(5, Math.ceil((stressEntries.length / entries.length) * 5));
  const overwhelmScore = overwhelmEntries.length / entries.length;

  // Positive metrics
  const gratitudeCount = entries.filter((e) => e.primary_emotion === 'grateful').length;
  const joyCount = entries.filter((e) => e.primary_emotion === 'joyful').length;

  return {
    dominantEmotions,
    averageSentiment,
    moodVolatility,
    morningSentiment,
    afternoonSentiment,
    eveningSentiment,
    stressLevel,
    overwhelmScore,
    gratitudeCount,
    joyCount,
  };
}

/**
 * Categorize entries by time of day
 */
function categorizeByTimeOfDay(entries: DiaryEntry[]): {
  morning: DiaryEntry[];
  afternoon: DiaryEntry[];
  evening: DiaryEntry[];
} {
  const morning: DiaryEntry[] = [];
  const afternoon: DiaryEntry[] = [];
  const evening: DiaryEntry[] = [];

  for (const entry of entries) {
    const hour = new Date(entry.created_at).getHours();

    if (hour >= 5 && hour < 12) {
      morning.push(entry);
    } else if (hour >= 12 && hour < 18) {
      afternoon.push(entry);
    } else {
      evening.push(entry);
    }
  }

  return { morning, afternoon, evening };
}

/**
 * Calculate average sentiment for a group of entries
 */
function calculateAverageSentiment(entries: DiaryEntry[]): number {
  if (entries.length === 0) return 0;
  return entries.reduce((sum, e) => sum + e.sentiment_score, 0) / entries.length;
}

/**
 * Detect emotional streak (consecutive days with similar emotions)
 */
export function detectEmotionalStreak(
  entries: DiaryEntry[],
  targetEmotions: EmotionCategory[]
): number {
  if (entries.length === 0) return 0;

  let streak = 0;
  let currentStreak = 0;

  // Sort by date descending (most recent first)
  const sorted = [...entries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  for (const entry of sorted) {
    if (targetEmotions.includes(entry.primary_emotion)) {
      currentStreak++;
      streak = Math.max(streak, currentStreak);
    } else {
      // Reset streak if current emotion not in target
      currentStreak = 0;
    }
  }

  return streak;
}
