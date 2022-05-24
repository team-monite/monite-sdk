import { createContext, useContext } from 'react';

import type { MoniteLocale } from '@/core/context/I18nLocaleProvider';
import { MoniteSDK } from '@monite/sdk-api';
import type { Hub } from '@sentry/react';

interface MoniteContextValue {
  monite: MoniteSDK;
  code: MoniteLocale['code'];
  sentryHub: Hub | undefined;
}

export const MoniteContext = createContext<MoniteContextValue | null>(null);

export function useMoniteContext() {
  const moniteContext = useContext(MoniteContext);

  if (!moniteContext) {
    throw new Error(
      'Could not find MoniteContext. Make sure that you are using "MoniteProvider" component before calling this hook.'
    );
  }

  return moniteContext;
}
