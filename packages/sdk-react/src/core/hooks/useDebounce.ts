import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to debounce a callback function
 * @template Args - The argument types of the callback function
 * @template R - The return type of the callback function
 * @param callback The function to be debounced
 * @param delay The delay in milliseconds
 * @returns The debounced callback function
 */
export const useDebounceCallback = <Args extends unknown[], R>(
  callback: (...args: Args) => R,
  delay: number = 300
): ((...args: Args) => void) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedCallback = useCallback(
    (...args: Args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};
