import React from 'react';

import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_LOW_PERMISSIONS,
} from '@/mocks';
import {
  loadedPermissionsValidator,
  Provider,
  renderWithClient,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { Tags } from './Tags';

describe('Tags', () => {
  describe('# Permissions', () => {
    test('display "Create new tag" button if user has "create" permission', async () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });

      render(<Tags />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitFor(() => loadedPermissionsValidator(queryClient));
      await waitFor(() => checkTagQueriesLoaded(queryClient));

      const createTagButton = screen.findByRole('button', {
        name: t`Create new tag`,
      });

      await expect(createTagButton).resolves.toBeInTheDocument();
      await expect(createTagButton).resolves.not.toBeDisabled();
    });

    test('no display the "Create new tag" button if user has no "create" permission', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_LOW_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      });

      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
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
    });

    test('display `<TagsTable/>` if user has "read" permission', async () => {
      renderWithClient(<Tags />);
      await waitUntilTableIsLoaded();
      await expect(screen.findByText('tag 1')).resolves.toBeInTheDocument();
    });

    test('display "Access Restriction" and disabled "Create new tag" button if user has no permissions', async () => {
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
        defaultOptions: { queries: { retry: false } },
      });

      render(<Tags />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => loadedPermissionsValidator(queryClient));
      await waitFor(() => checkTagQueriesLoaded(queryClient));

      await expect(
        screen.findByText(/Access Restricted/i, { selector: 'h3' })
      ).resolves.toBeInTheDocument();

      await expect(
        screen.findByRole('button', {
          name: t`Create new tag`,
        })
      ).resolves.toBeDisabled();
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
