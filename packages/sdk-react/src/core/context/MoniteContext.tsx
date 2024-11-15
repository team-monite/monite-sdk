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
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';
import type { I18n } from '@lingui/core';
import type { Theme, ThemeOptions } from '@mui/material';
import type { Hub } from '@sentry/react';
import type { QueryClient } from '@tanstack/react-query';

import type { Locale as DateFnsLocale } from 'date-fns';

import { MoniteSettings } from './MoniteProvider';

interface MoniteContextBaseValue {
  locale: MoniteLocaleWithRequired;
  i18n: I18n;
  dateFnsLocale: DateFnsLocale;
}

export interface MoniteContextValue
  extends MoniteContextBaseValue,
    CreateMoniteAPIClientResult {
  environment: 'dev' | 'sandbox' | 'production';
  entityId: string;
  sentryHub: Hub | undefined;
  queryClient: QueryClient;
  apiUrl: string;
  theme: Theme;
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
  monite: MoniteSettings;
  locale: Partial<MoniteLocale> | undefined;
  theme: Theme | ThemeOptions | undefined;
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
  monite: MoniteSettings;
  children: ReactNode;
  theme: Theme | ThemeOptions | undefined;
}

const ContextProvider = ({
  monite,
  locale,
  i18n,
  dateFnsLocale,
  theme: userTheme,
  children,
}: ContextProviderProps) => {
  const { entityId, apiUrl, fetchToken } = monite;
  let environment: 'dev' | 'sandbox' | 'production';

  if (apiUrl) {
    if (apiUrl.match(/dev/)) {
      environment = 'dev';
    } else if (apiUrl.match(/sandbox/)) {
      environment = 'sandbox';
    } else {
      environment = 'production';
    }
  } else {
    environment = 'sandbox';
  }

  const sentryHub = useMemo(() => {
    return typeof window !== 'undefined' && typeof document !== 'undefined' // Check if we are in the browser
      ? new SentryFactory({
          environment,
          entityId,
        }).create()
      : undefined;
  }, [entityId, environment]);

  const queryClient = useMemo(
    () => createQueryClient(i18n, sentryHub),
    [i18n, sentryHub]
  );

  const { api, version, requestFn } = useMemo(
    () =>
      createAPIClient({
        entityId: entityId,
        context: MoniteQraftContext,
      }),
    [entityId]
  );

  const theme = useMemo(
    () => createThemeWithDefaults(i18n, userTheme),
    [i18n, userTheme]
  );

  useEffect(() => {
    queryClient.mount();
    return () => queryClient.unmount();
  }, [queryClient]);

  return (
    <MoniteContext.Provider
      value={{
        environment,
        entityId,
        theme,
        queryClient,
        sentryHub,
        i18n,
        locale,
        dateFnsLocale,
        apiUrl: apiUrl || 'https://api.sandbox.monite.com/v1',
        fetchToken,
        api,
        version,
        requestFn,
      }}
    >
      {children}
    </MoniteContext.Provider>
  );
};
