import { useEffect, useRef } from 'react';
import { useIsMounted } from '@/core/hooks';

/**
 * Custom hook for window resize events
 * NextJS-safe with proper cleanup and SSR handling
 */
export const useWindowResize = (
  callback: () => void,
  debounceMs: number = 100
) => {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isMountedRef = useIsMounted();

  callbackRef.current = callback;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          callbackRef.current();
        }
      }, debounceMs);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [debounceMs, isMountedRef]);
};