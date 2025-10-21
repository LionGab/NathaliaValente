/**
 * Daily Quote type definitions
 */

export interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  category: QuoteCategory;
  date: string;
  created_at: string;
}

export type QuoteCategory = 'motivational' | 'faith' | 'motherhood' | 'self-care' | 'wisdom';

export interface CreateQuoteInput {
  quote: string;
  author: string;
  category: QuoteCategory;
}
