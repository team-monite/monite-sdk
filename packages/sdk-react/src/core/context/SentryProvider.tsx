import type { PropsWithChildren, ReactNode } from 'react';

import { useDialog } from '@/ui/Dialog/DialogContext';
import { ErrorComponent } from '@/ui/error';
import { type IconWrapperSettings } from '@/ui/iconWrapper';
import * as Sentry from '@sentry/react';

interface SentryProviderProps {
  config: {
    enabled: boolean;
    tags: Record<string, string>;
  };
  children: ReactNode;
  iconWrapperSettings?: IconWrapperSettings;
}

/**
 * Attaches Sentry to the `ErrorBoundary`
 */
export const SentryProvider = ({
  children,
  config,
  iconWrapperSettings,
}: PropsWithChildren<SentryProviderProps>) => {
  if (config.enabled) {
    Sentry.getCurrentScope().update((scope) => {
      scope.setTags(config.tags);
      return scope;
    });
  }

  const dialogContext = useDialog();

  return (
    <Sentry.ErrorBoundary
      fallback={(props) => (
        <ErrorComponent
          iconWrapperSettings={iconWrapperSettings}
          onClose={dialogContext?.onClose}
          {...props}
        />
      )}
      onError={(error, componentStack, _eventId) => {
        Sentry.captureException(error, {
          contexts: {
            react: { componentStack },
          },
        });
      }}
    >
      <Sentry.Profiler>{children}</Sentry.Profiler>
    </Sentry.ErrorBoundary>
  );
};
