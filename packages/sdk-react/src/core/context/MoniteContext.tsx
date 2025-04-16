import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { createAPIClient } from '@/api/client';
import { getDefaultComponentSettings } from '@/core/componentSettings';
import { createQueryClient } from '@/core/context/createQueryClient';
import { MoniteQraftContext } from '@/core/context/MoniteAPIProvider';
import {
  type ContextProviderProps,
  type MoniteContextProviderProps,
  type MoniteContextValue,
  type MoniteTheme,
} from '@/core/context/MoniteContext.types';
import { getLocaleWithDefaults, I18nLoader } from '@/core/context/MoniteI18nProvider';
import { SentryFactory } from '@/core/services';
import { createThemeWithDefaults } from '@/core/utils/createThemeWithDefaults';

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
