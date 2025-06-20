'use client';

import { ReactNode, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

const MoniteLoadingFallback = () => (
  <div
    data-testid="monite-loading"
    style={{
      padding: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      color: '#666',
    }}
  >
    Loading Monite UI...
  </div>
);

const ErrorComponent = () => (
  <div style={{ color: 'red', padding: '20px' }}>
    Error: MoniteProvider not found in MoniteComponents
  </div>
);

interface MoniteProviderProps {
  entityUserId: string;
  entityId: string;
  apiUrl: string;
  children: ReactNode;
}

const DynamicMoniteProvider = dynamic(
  () =>
    import('@/components/MoniteComponents').then((mod) => {
      if (!mod.MoniteProvider) {
        return ErrorComponent;
      }

      return mod.MoniteProvider;
    }),
  {
    ssr: false,
    loading: () => <MoniteLoadingFallback />,
  }
);

export function ClientSideMoniteProvider({
  entityUserId,
  entityId,
  apiUrl,
  children,
}: MoniteProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (entityUserId && entityId && apiUrl) {
      setIsReady(true);
    }
  }, [entityUserId, entityId, apiUrl]);

  if (!isReady) {
    return <MoniteLoadingFallback />;
  }

  return (
    <div data-testid="monite-provider-wrapper">
      <DynamicMoniteProvider
        entityUserId={entityUserId}
        entityId={entityId}
        apiUrl={apiUrl}
      >
        <div data-testid="monite-components">{children}</div>
      </DynamicMoniteProvider>
    </div>
  );
}
