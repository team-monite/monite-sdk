import type { PropsWithChildren, ReactNode } from 'react';

// import { useDialog } from '@/components/Dialog';
import { useDialog } from '@/components/Dialog/DialogContext';
import { ErrorBase } from '@/ui/error'; // Assuming IconWrapperSettings is exported from here or its definition is accessible
import { type IconWrapperSettings } from '@/ui/iconWrapper'; // Assuming IconWrapperSettings is exported from here or its definition is accessible
// import { useMoniteContext } from '@/core/context/MoniteContext'; // Remove this import
import * as Sentry from '@sentry/react';

interface SentryProviderProps {
  config: {
    enabled: boolean;
    tags: Record<string, string>;
  };
  children: ReactNode;
  iconWrapperSettings?: IconWrapperSettings; // Add this prop
}

/**
 * Attaches Sentry to the `ErrorBoundary`
 */
export const SentryProvider = ({
  children,
  config,
  iconWrapperSettings, // Use the prop
}: PropsWithChildren<SentryProviderProps>) => {
  if (config.enabled) {
    Sentry.getCurrentScope().update((scope) => {
      scope.setTags(config.tags);
      return scope;
    });
  }

  // const { componentSettings } = useMoniteContext(); // Remove this
  const dialogContext = useDialog();
  // const iconWrapperSettings = componentSettings?.general?.iconWrapper; // Remove this

  return (
    <Sentry.ErrorBoundary
      fallback={(props) =>
        <ErrorBase
          iconWrapperSettings={iconWrapperSettings}
          onClose={dialogContext?.onClose}
          {...props}
        />}
      onError={(error, componentStack, _eventId) => {
        Sentry.captureException(error, {
          contexts: {
            react: { componentStack },
          },
        });
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
