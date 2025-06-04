import type { ReactNode } from 'react';

import { useDialog } from '@/components/Dialog/DialogContext';
import { ErrorComponent } from '@/ui/error/Error';
import { ErrorBoundary } from '@sentry/react';

export const MoniteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const dialogContext = useDialog();

  return (
    <ErrorBoundary
      fallback={(props) => (
        <ErrorComponent onClose={dialogContext?.onClose} {...props} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
