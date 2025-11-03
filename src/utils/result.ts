/**
 * Result pattern for type-safe error handling
 * Provides a consistent way to handle success and failure cases
 *
 * @example
 * const result = await fetchUser(userId);
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error);
 * }
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Creates a successful result
 */
export const success = <T>(data: T): Result<T, never> => ({
  success: true,
  data,
});

/**
 * Creates a failed result
 */
export const failure = <E>(error: E): Result<never, E> => ({
  success: false,
  error,
});

/**
 * Maps a successful result to a new value
 */
export const mapResult = <T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> => {
  if (result.success) {
    return success(fn(result.data));
  }
  return result;
};

/**
 * Maps a failed result to a new error
 */
export const mapError = <T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> => {
  if (!result.success) {
    return failure(fn(result.error));
  }
  return result;
};

/**
 * Wraps an async function to return a Result instead of throwing
 */
export const wrapAsync = async <T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<Result<T, string>> => {
  try {
    const data = await fn();
    return success(data);
  } catch (error) {
    const message = errorMessage || (error instanceof Error ? error.message : 'Unknown error');
    return failure(message);
  }
};
