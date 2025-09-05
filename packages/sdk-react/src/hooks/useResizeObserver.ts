import { useEffect, useRef } from 'react';
import { useIsMounted } from '@/core/hooks';

/**
 * Custom hook for observing element resize events
 * NextJS-safe with proper cleanup and SSR handling
 */
export const useResizeObserver = (
  callback: () => void,
  debounceMs: number = 50
) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<ResizeObserver>();
  const isMountedRef = useIsMounted();

  // Keep callback ref updated
  callbackRef.current = callback;

  const observe = (element: HTMLElement | null) => {
    if (!element || typeof window === 'undefined') return;

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new ResizeObserver(() => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Debounce the callback
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          callbackRef.current();
        }
      }, debounceMs);
    });

    // Start observing
    observerRef.current.observe(element);
  };

  const disconnect = () => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return { observe, disconnect };
};