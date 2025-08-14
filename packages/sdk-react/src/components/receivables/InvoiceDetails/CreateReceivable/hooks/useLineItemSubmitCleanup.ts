import { useCallback, useRef } from 'react';

/**
 * Custom hook to manage the registration and execution of a line item cleanup function,
 * used before submitting a form containing line items (e.g., in invoices).
 */
export const useLineItemSubmitCleanup = () => {
  const lineItemCleanupFnRef = useRef<(() => void) | null>(null);

  const registerLineItemCleanupFn = useCallback((fn: (() => void) | null) => {
    lineItemCleanupFnRef.current = fn;
  }, []);

  const runLineItemCleanup = useCallback(() => {
    lineItemCleanupFnRef.current?.();
  }, []);

  return {
    registerLineItemCleanupFn,
    runLineItemCleanup,
  };
};
