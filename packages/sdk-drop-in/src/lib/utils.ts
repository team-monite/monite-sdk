export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Standard delay for cleanup operations to allow React to process
 * This specific timing is optimized for React cleanup operations
 */
export const CLEANUP_DELAY_MS = 50;

export const cleanupDelay = (): Promise<void> => delay(CLEANUP_DELAY_MS);

export const safeExecute = (
  fn: () => void | Promise<void>,
  errorMessage?: string,
  logError: boolean = true
): void => {
  try {
    const result = fn();

    if (!(result instanceof Promise)) return;

    result.catch((error) => {
      if (!logError) return;
      console.warn(errorMessage || 'Error during safe execution:', error);
    });
  } catch (error) {
    if (!logError) return;
    console.warn(errorMessage || 'Error during safe execution:', error);
  }
};

/**
 * Creates a safe async function wrapper with error handling
 * @param fn - Async function to wrap
 * @param errorMessage - Optional error message prefix
 * @param logError - Whether to log errors (default: true)
 */
export const safeAsync = <T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  errorMessage?: string,
  logError: boolean = true
) => {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (!logError) return undefined;

      console.warn(errorMessage || 'Error during async execution:', error);
      return undefined;
    }
  };
};

export const generateId = (prefix: string = 'id'): string => {
  const hasRandomUUID =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function';

  return hasRandomUUID
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const clearElement = (
  element: Element | null,
  errorMessage?: string
): void => {
  if (!element) return;

  safeExecute(() => {
    element.innerHTML = '';
  }, errorMessage || 'Error clearing element content');
};
