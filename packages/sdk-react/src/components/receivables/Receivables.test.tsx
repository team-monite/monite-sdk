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
  waitForCondition,
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
  waitForElementToBeRemoved,
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

      // Fill required fields
      await triggerClickOnFirstAutocompleteOption(/Bill to/i);
      await triggerClickOnFirstAutocompleteOption(/Billing address/i);
      await triggerClickOnFirstAutocompleteOption(/Your VAT ID/i);
      await triggerClickOnFirstAutocompleteOption(/Payment terms/i);

      // Add item to invoice
      const itemsHeader = screen.getByText(t`Items`);
      // Use querySelector to find the 'Add Item' button.
      // Due to the button icon, the screen.getByText won't find it
      const addItemButton = itemsHeader.parentElement!.querySelector('button')!;
      act(() => fireEvent.click(addItemButton));
      // Wait for Products dialog to open
      await waitForCondition(
        () => !!screen.queryByText(`Available items`),
        3_000
      );

      const availableItems = screen.getByText(t`Available items`);
      const rightSideForm = findParentElement(
        availableItems,
        ({ tagName }) => tagName == 'FORM'
      )!;
      // Wait for products to load
      await waitForCondition(
        () => !!rightSideForm.querySelector('tbody tr input'),
        3_000
      );
      const productCheckbox = rightSideForm.querySelector('tbody tr input')!;
      act(() => fireEvent.click(productCheckbox));

      const addProductsButton = screen.getByRole('button', { name: t`Add` });
      act(() => fireEvent.click(addProductsButton));
      // Wait for Products dialog to close
      await waitForElementToBeRemoved(addProductsButton, {
        timeout: 3_000,
      });

      // Create invoice
      const nextPageButton = await nextPageButtonPromise;
      act(() => fireEvent.click(nextPageButton));

      // Compose email dialog opens
      await waitForCondition(
        () => !!screen.queryByRole('button', { name: t`Compose email` }),
        3_000
      );
    }, 30_000);
  });
});
