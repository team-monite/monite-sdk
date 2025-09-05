import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * Hook to debounce a value
 * @template T - The type of the value to debounce
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook to debounce a callback function with auto-cleanup on unmount
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

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  return debouncedCallback;
};
