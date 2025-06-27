import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { createAPIClient, CreateMoniteAPIClientResult } from '@/api/client';
import { getDefaultComponentSettings } from '@/core/componentSettings';
import type { ComponentSettings } from '@/core/componentSettings';
import { createQueryClient } from '@/core/context/createQueryClient';
import type { ThemeConfig } from '@/core/theme/types';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';
import type { I18n } from '@lingui/core';
import type { Theme } from '@mui/material';
import type { QraftContextValue } from '@openapi-qraft/react';
import type { QueryClient } from '@tanstack/react-query';

import type { Locale as DateFnsLocale } from 'date-fns';

import {
  getLocaleWithDefaults,
  I18nLoader,
  MoniteLocaleWithRequired,
  type MoniteLocale,
} from './i18nUtils';
import { MoniteSettings } from './MoniteProvider';

interface MoniteContextBaseValue {
  locale: MoniteLocaleWithRequired;
  i18n: I18n;
  dateFnsLocale: DateFnsLocale;
}

export type FetchToken = () => Promise<{
  access_token: string;
  expires_in: number;
  token_type: string;
}>;

export type MoniteTheme = Theme & {
  palette: {
    neutral: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '70': string;
      '80': string;
      '90': string;
      '95': string;
    };
    primary: {
      main: string;
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '55': string;
      '60': string;
      '65': string;
      '80': string;
      '85': string;
      '90': string;
      '95': string;
    };
    success: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '60': string;
      '80': string;
      '90': string;
      '95': string;
    };
    warning: {
      main: string;
      '10': string;
      '30': string;
      '50': string;
      '60': string;
      '80': string;
      '90': string;
      '95': string;
    };
    error: {
      main: string;
      '10': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '80': string;
      '90': string;
      '95': string;
    };
  };
};

export interface MoniteContextValue
  extends MoniteContextBaseValue,
    CreateMoniteAPIClientResult {
  environment: 'dev' | 'sandbox' | 'production';
  entityId: string;
  queryClient: QueryClient;
  apiUrl: string;
  theme: MoniteTheme;
  componentSettings: ComponentSettings;
  fetchToken: FetchToken;
}

/**
 * @internal
 */
export const MoniteQraftContext = createContext<QraftContextValue>(undefined);

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
  theme: ThemeConfig | undefined;
  componentSettings: Partial<ComponentSettings> | undefined;
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
          {/* SentryProvider is now used inside ContextProvider where settings are resolved */}
          {children}
        </ContextProvider>
      )}
    </I18nLoader>
  );
};

interface ContextProviderProps extends MoniteContextBaseValue {
  monite: MoniteSettings;
  children: ReactNode;
  theme: ThemeConfig | undefined;
  componentSettings?: Partial<ComponentSettings>;
}

const ContextProvider = ({
  monite,
  locale,
  i18n,
  dateFnsLocale,
  theme: userTheme,
  componentSettings,
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

  const queryClient = useMemo(() => createQueryClient(i18n, null), [i18n]);

  const { api, version, requestFn } = useMemo(
    () =>
      createAPIClient({
        entityId: entityId,
        context: MoniteQraftContext,
      }),
    [entityId]
  );

  const theme = useMemo(
    () => createThemeWithDefaults(userTheme) as MoniteTheme,
    [userTheme]
  );

  useEffect(() => {
    queryClient.mount();
    return () => queryClient.unmount();
  }, [queryClient]);

  return (
    <MoniteContext.Provider
      value={{
        api,
        version,
        environment,
        entityId,
        theme: theme as MoniteTheme,
        componentSettings: getDefaultComponentSettings(i18n, componentSettings),
        queryClient,
        i18n,
        locale,
        dateFnsLocale,
        apiUrl: apiUrl || 'https://api.sandbox.monite.com/v1',
        fetchToken,
        requestFn,
      }}
    >
      {children}
    </MoniteContext.Provider>
  );
};
