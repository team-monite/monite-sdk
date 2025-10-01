import { useEffect, type EffectCallback } from 'react';

/**
 * Hook that runs an effect only once when the component mounts.
 * This is a semantic wrapper around `useEffect(..., [])` to make the intent explicit.
 *
 * @param effect - The effect callback to run on mount
 *
 * @example
 * ```typescript
 * useDidMount(() => {
 *   const cleanup = setupSomething();
 *   return () => cleanup(); // Cleanup on unmount
 * });
 * ```
 */
export const useDidMount = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
};
