'use client';

import React, { ReactNode } from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { Error as ErrorComponent } from '@/ui/error';
import { ErrorBoundary, Profiler } from '@sentry/react';

/**
 * Attaches Sentry to the `ErrorBoundary`
 */
export const SentryProvider = ({ children }: { children: ReactNode }) => {
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
