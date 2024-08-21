import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { createAPIClient, CreateMoniteAPIClientResult } from '@/api/client';
import { createQueryClient } from '@/core/context/createQueryClient';
import { MoniteQraftContext } from '@/core/context/MoniteAPIProvider';
import {
  getLocaleWithDefaults,
  I18nLoader,
  MoniteLocaleWithRequired,
  type MoniteLocale,
} from '@/core/context/MoniteI18nProvider';
import { SentryFactory } from '@/core/services';
import type { I18n } from '@lingui/core';
import type { MoniteSDK } from '@monite/sdk-api';
import type { Theme } from '@mui/material';
import type { Hub } from '@sentry/react';
import type { QueryClient } from '@tanstack/react-query';

import type { Locale as DateFnsLocale } from 'date-fns';

interface MoniteContextBaseValue {
  monite: MoniteSDK;
  locale: MoniteLocaleWithRequired;
  i18n: I18n;
  dateFnsLocale: DateFnsLocale;
  theme: Theme;
}

export interface MoniteContextValue
  extends MoniteContextBaseValue,
    CreateMoniteAPIClientResult {
  sentryHub: Hub | undefined;
  queryClient: QueryClient;
  apiUrl: string;
  fetchToken: () => Promise<{
    access_token: string;
    expires_in: number;
    token_type: string;
  }>;
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

interface MoniteContextProviderProps {
  monite: MoniteSDK;
  locale: Partial<MoniteLocale> | undefined;
  theme: Theme;
  children: ReactNode;
}

/**
 * @internal
 */
export const MoniteContextProvider = ({
  locale,
  children,
  ...restProps
}: MoniteContextProviderProps) => {
  const defaultedLocale = getLocaleWithDefaults(locale);

  return (
    <I18nLoader locale={defaultedLocale}>
      {(i18n, datePickerAdapterLocale) => (
        <ContextProvider
          {...restProps}
          i18n={i18n}
          locale={defaultedLocale}
          dateFnsLocale={datePickerAdapterLocale}
        >
          {children}
        </ContextProvider>
      )}
    </I18nLoader>
  );
};

interface ContextProviderProps extends MoniteContextBaseValue {
  children: ReactNode;
}

const ContextProvider = ({
  monite,
  locale,
  i18n,
  dateFnsLocale,
  theme,
  children,
}: ContextProviderProps) => {
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

  const { api, version, requestFn } = useMemo(
    () =>
      createAPIClient({
        entityId: monite.entityId,
        context: MoniteQraftContext,
      }),
    [monite.entityId]
  );

  useEffect(() => {
    queryClient.mount();
    return () => queryClient.unmount();
  }, [queryClient]);

  return (
    <MoniteContext.Provider
      value={{
        theme,
        monite,
        queryClient,
        sentryHub,
        i18n,
        locale,
        dateFnsLocale,
        apiUrl: monite.baseUrl,
        fetchToken: monite.fetchToken,
        api,
        version,
        requestFn,
      }}
    >
      {children}
    </MoniteContext.Provider>
  );
};
