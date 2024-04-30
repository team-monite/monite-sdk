import { createContext, ReactNode, useContext, useMemo } from 'react';

import type { MoniteLocale } from '@/core/context/I18nLocaleProvider';
import { createQueryClient } from '@/core/context/MoniteQueryClientProvider';
import { SentryFactory } from '@/core/services';
import { useLingui } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import type { Hub } from '@sentry/react';
import { QueryClient } from '@tanstack/react-query';

interface MoniteContextValue {
  monite: MoniteSDK;
  code: MoniteLocale['code'];
  sentryHub: Hub | undefined;
  queryClient: QueryClient;
}

/**
 * @internal
 */
export const MoniteContext = createContext<MoniteContextValue | null>(null);

/**
 * @internal
 */
export function useMoniteContext() {
  const moniteContext = useContext(MoniteContext);

  if (!moniteContext) {
    throw new Error(
      'Could not find MoniteContext. Make sure that you are using "MoniteProvider" component before calling this hook.'
    );
  }

  return moniteContext;
}

export const MoniteContextProvider = ({
  monite,
  children,
  ...restProps
}: Omit<MoniteContextValue, 'queryClient' | 'sentryHub'> & {
  children: ReactNode;
}) => {
  const { i18n } = useLingui();
  const sentryHub = useMemo(() => {
    return typeof window !== 'undefined' && typeof document !== 'undefined' // Check if we are in the browser
      ? new SentryFactory({
          environment: monite.environment,
          entityId: monite.entityId,
        }).create()
      : undefined;
  }, [monite.entityId, monite.environment]);

  const queryClient = useMemo(
    () => createQueryClient(i18n, sentryHub),
    [i18n, sentryHub]
  );

  return (
    <MoniteContext.Provider
      value={{ ...restProps, queryClient, monite, sentryHub }}
    >
      {children}
    </MoniteContext.Provider>
  );
};
