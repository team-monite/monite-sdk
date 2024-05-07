import React, { ReactNode, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { getMessageInError } from '@/core/utils/getMessageInError';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { ApiError } from '@monite/sdk-api';
import type { Hub } from '@sentry/react';
import {
  MutationCache,
  QueryCache,
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
export const useInstanceKey = (instance: object) => {
  const [instancesMap] = useState(() => new WeakMap([[instance, Date.now()]]));

  if (!instancesMap.has(instance)) instancesMap.set(instance, Date.now());

  const instanceKey = instancesMap.get(instance);
  if (!instanceKey) throw new Error('Instance key is not defined.');

  return instanceKey;
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
