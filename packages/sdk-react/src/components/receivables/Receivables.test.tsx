import { Receivables } from '@/components';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import {
  checkPermissionQueriesLoaded,
  Provider,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Receivables', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables customerTypes={['customer', 'vendor']} />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();

      const createInvoiceButton = screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      await expect(createInvoiceButton).resolves.toBeInTheDocument();
      await expect(createInvoiceButton).resolves.not.toBeDisabled();

      const invoicesTab = await screen.findByRole('tab', { name: /invoices/i });

      await userEvent.click(invoicesTab);

      const invoiceCells = screen.findAllByText(/INV-/);

      await expect(invoiceCells).resolves.toBeDefined();
    });

    test('support empty permissions', async () => {
      const monite = {
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      };

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} monite={monite} children={children} />
        ),
      });

      await waitFor(() => checkPermissionQueriesLoaded(queryClient));

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
      const monite = {
        entityId: ENTITY_ID_FOR_OWNER_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
      };

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} monite={monite} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();

      const createInvoiceButton = screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      const invoicesTab = await screen.findByRole('tab', { name: /invoices/i });

      await userEvent.click(invoicesTab);

      await expect(createInvoiceButton).resolves.toBeInTheDocument();
      await expect(createInvoiceButton).resolves.not.toBeDisabled();

      const invoiceCells = screen.findAllByText(/INV-/);

      await expect(invoiceCells).resolves.toBeDefined();
    });
  });
});
