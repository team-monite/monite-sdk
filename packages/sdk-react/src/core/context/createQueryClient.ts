import { toast } from 'react-hot-toast';

import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { MutationCache, QueryClient, type DefaultOptions, type QueryCache } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

export const createQueryClient = (
  i18n: I18n,
  sentryInstance?: typeof Sentry,
  defaultOptions?: DefaultOptions<Error>,
  queryCache?: QueryCache
) =>
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

        sentryInstance?.captureException(err);
      },
    }),

    /**
     * Default Options
     *
     * @see https://tanstack.com/query/v4/docs/react/reference/QueryClient
     */
    defaultOptions: defaultOptions ?? {
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
    queryCache,
  });
