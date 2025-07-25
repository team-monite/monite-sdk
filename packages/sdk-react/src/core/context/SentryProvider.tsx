import { useMoniteContext } from '@/core/context/MoniteContext';
import { Error as ErrorComponent } from '@/ui/error/Error';
import { ErrorBoundary, Profiler } from '@sentry/react';
import { ReactNode } from 'react';

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
