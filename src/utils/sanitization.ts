/**
 * Input sanitization utilities for security
 * Provides functions to clean and validate user inputs
 */

/**
 * Maximum lengths for various input types
 */
export const INPUT_LIMITS = {
  SEARCH_QUERY: 100,
  USERNAME: 50,
  EMAIL: 254, // RFC 5321
  PASSWORD: 128,
  COMMENT: 500,
  POST_CONTENT: 5000,
  BIO: 500,
} as const;

/**
 * Sanitizes a search query by removing potentially dangerous characters
 * and limiting length
 * 
 * @example
 * const clean = sanitizeSearchQuery(userInput);
 */
export const sanitizeSearchQuery = (input: string): string => {
  return input
    .trim()
    .slice(0, INPUT_LIMITS.SEARCH_QUERY)
    .replace(/[<>]/g, ''); // Remove HTML tags
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Removes script tags and dangerous attributes
 * 
 * @example
 * const safe = sanitizeHtml(userContent);
 */
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

/**
 * Sanitizes a username by removing special characters
 * and normalizing to lowercase
 * 
 * @example
 * const username = sanitizeUsername('John@Doe!');
 * // Returns: 'johndoe'
 */
export const sanitizeUsername = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .slice(0, INPUT_LIMITS.USERNAME)
    .replace(/[^a-z0-9_]/g, '');
};

/**
 * Sanitizes an email address by normalizing to lowercase
 * and removing whitespace
 * 
 * @example
 * const email = sanitizeEmail(' User@Example.COM ');
 * // Returns: 'user@example.com'
 */
export const sanitizeEmail = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .slice(0, INPUT_LIMITS.EMAIL);
};

/**
 * Checks if a string contains potentially dangerous content
 * 
 * @example
 * const isDangerous = containsDangerousContent(userInput);
 */
export const containsDangerousContent = (input: string): boolean => {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /eval\(/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * List of known disposable email domains
 */
export const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
] as const;

/**
 * Checks if an email domain is disposable
 * 
 * @example
 * const isDisposable = isDisposableEmail('test@tempmail.com');
 */
export const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.includes(
    domain as typeof DISPOSABLE_EMAIL_DOMAINS[number]
  );
};

/**
 * Escapes special characters in a string for safe regex use
 * 
 * @example
 * const escaped = escapeRegex('Hello. World?');
 */
export const escapeRegex = (input: string): string => {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Rate limiting helper
 * Tracks function calls and returns whether rate limit is exceeded
 * 
 * @example
 * const limiter = createRateLimiter(5, 60000); // 5 calls per minute
 * if (!limiter.checkLimit('userId123')) {
 *   return 'Rate limit exceeded';
 * }
 */
export class RateLimiter {
  private calls: Map<string, number[]> = new Map();

  constructor(
    private maxCalls: number,
    private windowMs: number
  ) {}

  checkLimit(key: string): boolean {
    const now = Date.now();
    const userCalls = this.calls.get(key) || [];
    
    // Remove calls outside the window
    const validCalls = userCalls.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (validCalls.length >= this.maxCalls) {
      return false; // Rate limit exceeded
    }

    validCalls.push(now);
    this.calls.set(key, validCalls);
    return true; // Within rate limit
  }

  reset(key: string): void {
    this.calls.delete(key);
  }
}

/**
 * Creates a rate limiter instance
 * 
 * @example
 * const searchLimiter = createRateLimiter(10, 60000); // 10 searches per minute
 */
export const createRateLimiter = (
  maxCalls: number,
  windowMs: number
): RateLimiter => {
  return new RateLimiter(maxCalls, windowMs);
};
