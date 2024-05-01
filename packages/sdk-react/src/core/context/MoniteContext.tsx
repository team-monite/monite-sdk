import { createContext, ReactNode, useContext, useMemo } from 'react';

import {
  LinguiDynamicI18n,
  type MoniteLocale,
} from '@/core/context/MoniteI18nProvider';
import { createQueryClient } from '@/core/context/MoniteQueryClientProvider';
import { SentryFactory } from '@/core/services';
import type { I18n } from '@lingui/core';
import type { MoniteSDK } from '@monite/sdk-api';
import type { Hub } from '@sentry/react';
import type { QueryClient } from '@tanstack/react-query';

interface MoniteContextValue {
  monite: MoniteSDK;
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

type MoniteContextProviderProps = {
  children: ReactNode;
} & Pick<MoniteContextValue, 'monite'>;

/**
 * @internal
 */
export const MoniteContextProvider = (
  props: {
    locale: Partial<MoniteLocale> | undefined;
  } & MoniteContextProviderProps
) => {
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

const ContextProvider = ({
  monite,
  i18n,
  children,
}: Pick<MoniteContextValue, 'i18n'> & MoniteContextProviderProps) => {
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
