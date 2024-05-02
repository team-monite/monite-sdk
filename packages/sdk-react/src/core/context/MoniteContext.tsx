import { createContext, ReactNode, useContext, useMemo } from 'react';

import {
  LinguiDynamicI18n,
  type MoniteLocale,
} from '@/core/context/MoniteI18nProvider';
import { createQueryClient } from '@/core/context/MoniteQueryClientProvider';
import { SentryFactory } from '@/core/services';
import type { I18n } from '@lingui/core';
import type { MoniteSDK } from '@monite/sdk-api';
import type { Theme } from '@mui/material';
import type { Hub } from '@sentry/react';
import type { QueryClient } from '@tanstack/react-query';

interface MoniteContextInputValue {
  monite: MoniteSDK;
  theme: Theme;
}

interface MoniteContextValue extends MoniteContextInputValue {
  i18n: I18n;
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

interface MoniteContextProviderProps extends MoniteContextInputValue {
  locale: Partial<MoniteLocale> | undefined;
  children: ReactNode;
}

/**
 * @internal
 */
export const MoniteContextProvider = (props: MoniteContextProviderProps) => {
  const locale = useMemo(() => {
    // todo: maybe move to separate function
    const localeCode =
      props.locale?.code ??
      (typeof navigator === 'undefined' ? 'en' : navigator.language);

    return {
      ...props.locale,
      code: localeCode,
    };
  }, [props.locale]);

  return (
    <LinguiDynamicI18n locale={locale}>
      {(i18n) => <ContextProvider {...props} i18n={i18n} />}
    </LinguiDynamicI18n>
  );
};

interface ContextProviderProps extends MoniteContextInputValue {
  i18n: I18n;
  children: ReactNode;
}

const ContextProvider = ({
  monite,
  i18n,
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

  return (
    <MoniteContext.Provider
      value={{
        theme,
        monite,
        queryClient,
        sentryHub,
        i18n,
      }}
    >
      {children}
    </MoniteContext.Provider>
  );
};
