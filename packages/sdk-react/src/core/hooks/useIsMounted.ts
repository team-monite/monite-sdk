import { useEffect, useRef } from 'react';

/**
 * Hook that tracks whether the component is currently mounted.
 * Useful for preventing state updates on unmounted components.
 *
 * @returns A ref object with current boolean indicating mount status
 */
export const useIsMounted = () => {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return isMountedRef;
};
