import { useEffect, useRef } from 'react';

/**
 * Custom hook that returns a ref object indicating if the component is currently mounted.
 *
 * @returns A React ref object whose `current` property is `true` if the component is mounted,
 * and `false` otherwise.
 */
export const useIsMounted = () => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
};
