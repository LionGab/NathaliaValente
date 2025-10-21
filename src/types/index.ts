/**
 * Central export for all type definitions
 */

// Models
export * from './models';

// Emotional Intelligence types
export * from './emotional-intelligence';

// Common utility types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

// Component props types
export interface BaseComponentProps {
  className?: string;
  testId?: string;
}
