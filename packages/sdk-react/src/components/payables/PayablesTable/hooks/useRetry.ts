import { useState, useCallback, useMemo } from 'react';

interface RetryConfig {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxAttempts: 5,
  initialDelayMs: 1000,
  backoffFactor: 1.5,
  shouldRetry: () => true,
  onRetry: () => {},
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface RetryState {
  attempt: number;
  isRetrying: boolean;
  error: unknown | null;
}

export const useRetry = (config: RetryConfig = {}) => {
  const finalConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ...config }),
    [config]
  );

  const [state, setState] = useState<RetryState>({
    attempt: 0,
    isRetrying: false,
    error: null,
  });

  const executeWithRetry = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T> => {
      setState({ attempt: 1, isRetrying: true, error: null });

      const attemptOperation = async (attempt: number): Promise<T> => {
        try {
          const result = await operation();
          setState({ attempt: 0, isRetrying: false, error: null });
          return result;
        } catch (error) {
          setState((prev) => ({ ...prev, error }));

          if (
            attempt < finalConfig.maxAttempts &&
            finalConfig.shouldRetry(error)
          ) {
            const delay =
              finalConfig.initialDelayMs *
              Math.pow(finalConfig.backoffFactor, attempt - 1);

            finalConfig.onRetry(attempt, error);
            await wait(delay);

            setState((prev) => ({
              ...prev,
              attempt: attempt + 1,
            }));

            return attemptOperation(attempt + 1);
          }

          setState((prev) => ({ ...prev, isRetrying: false }));
          throw error;
        }
      };

      return attemptOperation(1);
    },
    [finalConfig]
  );

  return {
    executeWithRetry,
    ...state,
  };
};
