import React from 'react';

import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import {
  loadedPermissionsValidator,
  Provider,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { Tags } from './Tags';

describe('Tags', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Tags />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();
      await waitFor(() => loadedPermissionsValidator(queryClient));
      await waitFor(() => checkTagQueriesLoaded(queryClient));

      const createTagButton = screen.findByRole('button', {
        name: t`Create new tag`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.not.toBeDisabled();

      const tableRowTag = screen.findByText('tag 1');
      await expect(tableRowTag).resolves.toBeInTheDocument();
    });

    test('support empty permissions', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Tags />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => loadedPermissionsValidator(queryClient));

      const createTagButton = screen.findByRole('button', {
        name: t`Create new tag`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.toBeDisabled();
      await expect(
        screen.findByText(/Access Restricted/i, { selector: 'h3' })
      ).resolves.toBeInTheDocument();
    });

    test('support "allowed_for_own" access for "read" and "create" permissions', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Tags />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();
      await waitFor(() => loadedPermissionsValidator(queryClient));
      await waitFor(() => checkTagQueriesLoaded(queryClient));

      const createTagButton = screen.findByRole('button', {
        name: t`Create new tag`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.not.toBeDisabled();

      const tableRowTag = screen.findByText('tag 1');
      await expect(tableRowTag).resolves.toBeInTheDocument();
    });
  });
});

function checkTagQueriesLoaded(queryClient: QueryClient) {
  if (
    !queryClient.getQueryState(['tags'], {
      exact: false,
    })
  )
    throw new Error('Product query is not executed');

  if (
    queryClient.getQueryState(['product'], {
      exact: false,
      predicate: (query) => query.state.status !== 'success',
    })
  ) {
    throw new Error('Tags query is still loading');
  }
}
