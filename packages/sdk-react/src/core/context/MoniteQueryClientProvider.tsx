import { ReactNode, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import type { Hub } from '@sentry/react';
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

/**
 * `MoniteQueryClientProvider` is a React component that provides a QueryClient instance to its children.
 * It uses the `useMemo` hook to create the QueryClient instance.
 * This component is used internally by the `MoniteProvider` component to invalidate the QueryClient instance
 * when the `MoniteSDK` instance changes.
 *
 * @param props - The properties passed to the component.
 * @param props.children - The child components to which the QueryClient instance should be provided.
 *
 * @returns A QueryClientProvider component with the QueryClient instance and the child components.
 */
export const MoniteQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { queryClient } = useMoniteContext();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const createQueryClient = (i18n: I18n, sentryHub: Hub | undefined) =>
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

        const message = getAPIErrorMessage(i18n, err);

        if (message) {
          toast.error(message, {
            id: message,
          });
        } else {
          toast.error(t(i18n)`Unrecognized error. Please contact support.`);
        }

        sentryHub?.captureException(err);
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
  });
