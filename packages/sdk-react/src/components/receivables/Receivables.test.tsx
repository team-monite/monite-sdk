import React from 'react';

import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import { loadedPermissionsValidator, Provider } from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { Receivables } from './Receivables';

describe('Receivables', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, cacheTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitFor(() => loadedPermissionsValidator(queryClient));
      await waitFor(() => checkReceivableQueriesLoaded(queryClient));

      const createInvoiceButton = screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      await expect(createInvoiceButton).resolves.toBeInTheDocument();
      await expect(createInvoiceButton).resolves.not.toBeDisabled();

      const invoiceCells = screen.findAllByText(/INV-/);

      await expect(invoiceCells).resolves.toBeDefined();
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

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => loadedPermissionsValidator(queryClient));

      const createInvoiceButton = screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      await expect(createInvoiceButton).resolves.toBeInTheDocument();
      await expect(createInvoiceButton).resolves.toBeDisabled();

      await expect(
        screen.findByText(t`Access Restricted`, { selector: 'h3' })
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

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitFor(() => loadedPermissionsValidator(queryClient));
      await waitFor(() => checkReceivableQueriesLoaded(queryClient));

      const createInvoiceButton = screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      await expect(createInvoiceButton).resolves.toBeInTheDocument();
      await expect(createInvoiceButton).resolves.not.toBeDisabled();

      const invoiceCells = screen.findAllByText(/INV-/);

      await expect(invoiceCells).resolves.toBeDefined();
    });
  });
});

function checkReceivableQueriesLoaded(queryClient: QueryClient) {
  if (
    !queryClient.getQueryState(['receivable'], {
      exact: false,
    })
  )
    throw new Error('Receivables query is not executed');

  if (
    queryClient.getQueryState(['receivable'], { exact: false })?.status !==
    'success'
  )
    throw new Error('Receivables query failed');
}
