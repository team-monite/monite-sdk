import { MoniteSettings } from './MoniteProvider';
import { createAPIClient, CreateMoniteAPIClientResult } from '@/api/client';
import { getDefaultComponentSettings } from '@/core/componentSettings';
import type { ComponentSettings } from '@/core/componentSettings';
import { getLocaleWithDefaults, I18nLoader } from '@/core/context/I18nLoader';
import {
  type MoniteLocaleWithRequired,
  type MoniteLocale,
} from '@/core/context/MoniteI18nTypes';
import { MoniteQraftContext } from '@/core/context/MoniteQraftContext';
import { createQueryClient } from '@/core/context/createQueryClient';
import { useIsMounted } from '@/core/hooks/useIsMounted';
import { SentryFactory } from '@/core/services';
import { type ThemeConfig } from '@/core/theme/types';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';
import type { I18n } from '@lingui/core';
import type { Theme } from '@mui/material';
import type { Hub } from '@sentry/react';
import type { QueryClient } from '@tanstack/react-query';
import type { Locale as DateFnsLocale } from 'date-fns';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

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

/**
 * MoniteTheme extends the MUI Theme with custom palette properties.
 * The custom palette structure is defined via module augmentation in mui-styles.d.ts
 */
export type MoniteTheme = Theme & {
  components?: ThemeConfig['components'];
};

export interface MoniteContextValue
  extends MoniteContextBaseValue,
    CreateMoniteAPIClientResult {
  environment: 'dev' | 'sandbox' | 'production';
  entityId: string;
  sentryHub: Hub | undefined;
  queryClient: QueryClient;
  apiUrl: string;
  theme: MoniteTheme;
  componentSettings: ComponentSettings;
  fetchToken: FetchToken;
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
    () => createThemeWithDefaults(userTheme),
    [userTheme]
  );

  const isMountedRef = useIsMounted();

  const cleanup = useMemo(
    () => () => {
      if (!isMountedRef.current) return;

      (async () => {
        try {
          await queryClient.cancelQueries();
          queryClient.clear();
          queryClient.unmount();
        } catch (error) {
          console.warn(error);
        }
      })();
    },
    [queryClient, isMountedRef]
  );

  useEffect(() => {
    queryClient.mount();

    return () => {
      cleanup();
    };
  }, [queryClient, cleanup]);

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
        sentryHub,
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
