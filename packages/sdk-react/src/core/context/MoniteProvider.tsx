import React, { ReactNode, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { ContainerCssBaseline } from '@/components/ContainerCssBaseline';
import { EmotionCacheProvider } from '@/core/context/EmotionCacheProvider';
import {
  I18nLocaleProvider,
  MoniteLocale,
} from '@/core/context/I18nLocaleProvider';
import { MoniteScopedProvider } from '@/core/context/MoniteScopedProvider';
import {
  createThemeWithDefaults,
  MoniteThemeContext,
  useMoniteThemeContext,
} from '@/core/context/MoniteThemeProvider';
import { SentryFactory } from '@/core/services';
import { getMessageInError } from '@/core/utils/getMessageInError';
import { Error as ErrorComponent } from '@/ui/error';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ApiError, MoniteSDK } from '@monite/sdk-api';
import { Theme, ThemeOptions } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import type { Hub } from '@sentry/react';
import { ErrorBoundary, Profiler } from '@sentry/react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { GlobalToast } from '../GlobalToast';
import { MoniteContext, useMoniteContext } from './MoniteContext';

export interface MoniteProviderProps {
  children?: ReactNode;

  /**
   * `theme` responsible for global styling of all Widgets provided.
   * If `theme` is not provided, `Monite` uses default theme.
   *
   * `Monite` uses `Material UI` for styling. If you want to know
   *  more how to customize theme, please visit:
   * @see {@link https://mui.com/customization/default-theme/ Default theme}
   */
  theme?: ThemeOptions | Theme;

  /** An instance of `MoniteSDK` */
  monite: MoniteSDK;

  /**
   * `locale` responsible for internationalisation
   *  of all Widgets provided.
   *
   * `locale.code` is used for global Widgets translation. (e.g. `en`)
   * `locale.messages` is used for translation for some of the Widgets.
   */
  locale?: Partial<MoniteLocale>;
}

const createQueryClient = (i18n: I18n, sentryHub: Hub | undefined) =>
  new QueryClient({
    mutationCache: new MutationCache({
      onError: (err, _variables, _context, mutation) => {
        /**
         * If this mutation has an `onError` callback defined
         *  skip global error handling.
         */
        if (mutation.options.onError) {
          return;
        }

        const message = getMessageInError(err);

        if (message) {
          toast.error(message, {
            id: message,
          });
        } else {
          toast.error(t(i18n)`Unrecognized error. Please contact support.`);
        }

        const isBackendError = err instanceof ApiError;

        /**
         * We have to send to Sentry only Client errors. If the error comes from the server,
         *  we shouldn't send it because we can't do anything with it.
         *  It's not a client-side error
         */
        if (!isBackendError) {
          sentryHub?.captureException(err);
        }
      },
    }),

    /**
     * Default Options
     *
     * @see https://tanstack.com/query/v4/docs/react/reference/QueryClient
     */
    defaultOptions: {
      queries: {
        /**
         * We want to refetch on window focus only
         *  if the query is not in `error` state.
         * Otherwise, we will get an error over and over again
         *  if the query is in `error` state and user
         *  will try to focus on the window.
         */
        refetchOnWindowFocus: (query) => query.state.status !== 'error',
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchIntervalInBackground: false,
        retry: false,

        /** Make `staleTime` to 1 minute */
        staleTime: 1000 * 60 * 1,
      },
    },
    queryCache: new QueryCache({
      onError: (err: unknown) => {
        const message = getMessageInError(err);

        if (message) {
          if (message.includes('Object type at permissions not found')) {
            toast.error(
              t(i18n)`You do not have permission to access this resource.`,
              {
                id: 'permission-error',
              }
            );

            return;
          }
        } else {
          toast.error(t(i18n)`Unrecognized error. Please contact support.`);
        }
      },
    }),
  });

export interface IMoniteGeneralProviderProps {
  children: MoniteProviderProps['children'];
}

/**
 * Attaches Sentry to the `ErrorBoundary`
 */
const SentryProvider = ({ children }: IMoniteGeneralProviderProps) => {
  const { sentryHub } = useMoniteContext();

  return (
    <ErrorBoundary
      fallback={(props) => <ErrorComponent {...props} />}
      onError={(error, componentStack, eventId) => {
        sentryHub?.captureException(error, {
          event_id: eventId,
          captureContext: {
            contexts: {
              react: { componentStack },
            },
          },
        });
      }}
    >
      <Profiler>{children}</Profiler>
    </ErrorBoundary>
  );
};

/**
 * Provides Monite theme and global styles
 * Fetches theme from global `MoniteProvider` and apply it to the Material `ThemeProvider`
 */
export const MoniteStyleProvider = ({
  children,
}: Pick<MoniteProviderProps, 'children'>) => {
  return (
    <SentryProvider>
      <MoniteScopedProvider>{children}</MoniteScopedProvider>
    </SentryProvider>
  );
};

export const MoniteProvider = ({
  monite,
  theme,
  children,
  locale,
}: MoniteProviderProps) => {
  const sentryHub = useMemo(() => {
    return typeof window !== 'undefined' && typeof document !== 'undefined' // Check if we are in the browser
      ? new SentryFactory({
          environment: monite.environment,
          entityId: monite.entityId,
        }).create()
      : undefined;
  }, [monite.entityId, monite.environment]);

  const userLocale =
    locale?.code ??
    (typeof navigator === 'undefined' ? 'en' : navigator.language);

  const moniteInstanceKey = useInstanceKey(monite);
  const muiTheme = useMemo(() => createThemeWithDefaults(theme), [theme]);

  return (
    <I18nLocaleProvider
      locale={{
        code: userLocale,
        messages: locale?.messages,
      }}
    >
      <MoniteQueryClientProvider
        /**
         * QueryClientProvider is not triggers re-rendering when `queryClient` is changed.
         * Therefore, we need to provide a unique key for each `MoniteSDK` instance
         * to trigger re-rendering of the `QueryClientProvider` with the new `QueryClient`.
         */
        key={moniteInstanceKey}
        sentryHub={sentryHub}
      >
        <MoniteThemeContext.Provider value={muiTheme}>
          <MoniteContext.Provider
            value={{
              monite,
              code: userLocale,
              sentryHub,
            }}
          >
            <ReactQueryDevtools initialIsOpen={false} />
            <EmotionCacheProvider cacheKey="monite-css-baseline">
              <MuiThemeProvider theme={muiTheme}>
                <ContainerCssBaseline enableColorScheme />
                <GlobalToast />
              </MuiThemeProvider>
            </EmotionCacheProvider>
            {children}
          </MoniteContext.Provider>
        </MoniteThemeContext.Provider>
      </MoniteQueryClientProvider>
    </I18nLocaleProvider>
  );
};

/**
 * `MoniteQueryClientProvider` is a React component that provides a QueryClient instance to its children.
 * It uses the `useMemo` hook to create the QueryClient instance.
 * This component is used internally by the `MoniteProvider` component to invalidate the QueryClient instance
 * when the `MoniteSDK` instance changes.
 *
 * @param props - The properties passed to the component.
 * @param props.children - The child components to which the QueryClient instance should be provided.
 * @param props.sentryHub - SentryHub instance to which the QueryClient instance should be provided.
 *
 * @returns A QueryClientProvider component with the QueryClient instance and the child components.
 */
const MoniteQueryClientProvider = ({
  children,
  sentryHub,
}: {
  children: ReactNode;
  sentryHub: Hub | undefined;
}) => {
  const { i18n } = useLingui();
  const queryClient = useMemo(
    () => createQueryClient(i18n, sentryHub),
    [i18n, sentryHub]
  );
  const queryClientInstanceKey = useInstanceKey(queryClient);

  return (
    <QueryClientProvider
      /**
       * We need to provide a unique key for each `QueryClient` instance,
       * otherwise, `QueryClientProvider` will not trigger re-rendering
       * on `queryClient` change.
       */
      key={queryClientInstanceKey}
      client={queryClient}
    >
      {children}
    </QueryClientProvider>
  );
};

/**
 * A custom hook that generates a unique key for a given instance.
 * The key is based on the current timestamp when the instance is first passed to the hook.
 * If the instance is not in the map, it will be added with the current timestamp as its key.
 *
 * @param {object} instance - The instance for which to generate a unique key.
 * @returns {number} The unique key associated with the given instance.
 * @throws {Error} If the instance key is not defined.
 */
const useInstanceKey = (instance: object) => {
  const [instancesMap] = useState(() => new WeakMap([[instance, Date.now()]]));

  if (!instancesMap.has(instance)) instancesMap.set(instance, Date.now());

  const instanceKey = instancesMap.get(instance);
  if (!instanceKey) throw new Error('Instance key is not defined.');

  return instanceKey;
};
