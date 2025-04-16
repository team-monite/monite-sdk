import { useContext } from 'react';

import { MoniteContext } from '@/core/context/MoniteContext';
import type { MoniteContextValue } from '@/core/context/MoniteContext.types';

/**
 * Hook to access the Monite context value
 */
export function useMoniteContext(): MoniteContextValue {
  const moniteContext = useContext(MoniteContext);

  if (!moniteContext) {
    throw new Error(
      'Could not find MoniteContext. Make sure that you are using "MoniteProvider" component before calling this hook.'
    );
  }

  return moniteContext;
} 