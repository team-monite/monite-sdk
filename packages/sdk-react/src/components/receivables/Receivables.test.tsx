import { VirtuosoMockContext } from 'react-virtuoso';

import { Receivables } from '@/components';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_OWNER_PERMISSIONS,
} from '@/mocks';
import {
  checkPermissionQueriesLoaded,
  findParentElement,
  Provider,
  triggerClickOnFirstAutocompleteOption,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { MoniteSDK } from '@monite/sdk-api';
import { QueryClient } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

describe('Receivables', () => {
  describe('# Permissions', () => {
    test('support "read" and "create" permissions', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables />, {
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
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
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
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <Provider client={queryClient} sdk={monite} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();

      const createInvoiceButton = screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      await expect(createInvoiceButton).resolves.toBeInTheDocument();
      await expect(createInvoiceButton).resolves.not.toBeDisabled();

      const invoiceCells = screen.findAllByText(/INV-/);

      await expect(invoiceCells).resolves.toBeDefined();
    });

    test('newly created invoice should be opened after creation', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: Infinity, staleTime: Infinity },
        },
      });

      render(<Receivables />, {
        wrapper: ({ children }) => (
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 1000, itemHeight: 50 }}
          >
            <Provider client={queryClient} children={children} />
          </VirtuosoMockContext.Provider>
        ),
      });

      await waitUntilTableIsLoaded();

      const createInvoiceButton = await screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      act(() => fireEvent.click(createInvoiceButton));

      const nextPageButtonPromise = screen.findByRole('button', {
        name: t`Next page`,
      });
      await expect(nextPageButtonPromise).resolves.toBeInTheDocument();
      await expect(nextPageButtonPromise).resolves.toBeEnabled();

      // No contact progress indicator should be visible at this moment
      const contactPersonPromise = screen.findByLabelText<HTMLInputElement>(
        t`Contact person`
      );
      await expect(contactPersonPromise).resolves.toBeInTheDocument();
      const contactPersonInput = await contactPersonPromise;
      expect(
        contactPersonInput.parentElement!.querySelector(
          '.MuiCircularProgress-root'
        )
      ).toBeNull();

      // Choose counterpart and billing address
      console.log('bill to');
      await triggerClickOnFirstAutocompleteOption(/Bill to/i);
      console.log('billing address');
      await triggerClickOnFirstAutocompleteOption(/Billing address/i);
      console.log('vat id');
      await triggerClickOnFirstAutocompleteOption(/Your VAT ID/i);
      console.log('payment terms');
      await triggerClickOnFirstAutocompleteOption(/Payment terms/i);

      // Add item to invoice
      const itemsHeader = screen.getByText(t`Items`);
      // Use querySelector to find the 'Add Item' button.
      // Due to the button icon, the screen.getByText won't find it
      const addItemButton = itemsHeader.parentElement!.querySelector('button')!;
      act(() => fireEvent.click(addItemButton));

      console.log('available items');
      await waitFor(() => !!screen.queryByText(t`Available items`), {
        timeout: 30_000,
      });

      // Find product in 'Add Item' dialog
      // await expect(
      //   screen.findByText(t`Available items`)
      // ).resolves.toBeInTheDocument();
      // await waitUntilTableIsLoaded();

      const availableItems = screen.getByText(t`Available items`);
      const rightSideForm = findParentElement(
        availableItems,
        ({ tagName }) => tagName == 'FORM'
      )!;
      console.log('tbody tr');
      await waitFor(() => !!rightSideForm.querySelector('tbody tr'), {
        timeout: 30_000,
      });
      const productRow = rightSideForm.querySelector('tbody tr')!;
      console.log('checkbox mark');
      const productCheckbox = productRow.querySelector('input')!;
      act(() => fireEvent.click(productCheckbox));
      console.log('Add click');
      const addProductsButton = screen.getByText(t`Add`);
      act(() => fireEvent.click(addProductsButton));

      console.log('Create invoice');
      // Create invoice
      const nextPageButton = await nextPageButtonPromise;
      act(() => fireEvent.click(nextPageButton));
      await expect(nextPageButtonPromise).resolves.toBeDisabled();

      // Compose email dialog opens
      const composeEmailButtonPromise = screen.findByRole('button', {
        name: t`Compose email`,
      });
      await expect(composeEmailButtonPromise).resolves.toBeInTheDocument();
      await expect(composeEmailButtonPromise).resolves.toBeEnabled();
    }, 30_000);
  });
});
