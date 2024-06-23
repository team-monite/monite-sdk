'use client';

import { ReactNode, useCallback, useMemo } from 'react';

import { useLingui } from '@lingui/react';
import { MoniteSDK } from '@monite/sdk-api';
import { MoniteProvider as MoniteProviderBase } from '@monite/sdk-react';

import { useAppTheme } from '@/components/ThemeRegistry/AppThemeProvider';

export const MoniteProvider = ({
  apiUrl,
  entityId,
  entityUserId,
  children,
}: {
  apiUrl: string;
  entityId: string;
  entityUserId: string;
  children: ReactNode;
}) => {
  const { theme } = useAppTheme();
  const { i18n } = useLingui();

  const fetchToken = useCallback(async () => {
    /**
     * We must add `entityUserId` as a dependency to create a new `fetchToken`
     * function and call create a new `MoniteSDK` instance.
     * Whenever `monite` is updated, all the components that depend on it will
     * be re-rendered, and data will be fetched again.
     */
    if (!entityUserId) throw new Error('entityUserId is not defined');

    return (
      await fetch('/api/auth/token', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
      })
    ).json();
  }, [entityUserId]);

  const monite = useMemo(
    () =>
      new MoniteSDK({
        apiUrl,
        entityId,
        fetchToken,
      }),
    [apiUrl, entityId, fetchToken]
  );

  return (
    <MoniteProviderBase
      monite={monite}
      theme={theme}
      locale={{ code: i18n.locale }}
    >
      {children}
    </MoniteProviderBase>
  );
};
