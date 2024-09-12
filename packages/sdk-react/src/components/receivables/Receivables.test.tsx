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
          <Provider client={queryClient} children={children} />
        ),
      });

      await waitUntilTableIsLoaded();

      const createInvoiceButton = await screen.findByRole('button', {
        name: t`Create Invoice`,
      });

      act(() => fireEvent.click(createInvoiceButton));

      const nextPageButton = screen.findByRole('button', {
        name: t`Next page`,
      });
      await expect(nextPageButton).resolves.toBeInTheDocument();
      await expect(nextPageButton).resolves.toBeEnabled();

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
      await expect(
        screen.findByText(t`Available items`)
      ).resolves.toBeInTheDocument();
      await waitUntilTableIsLoaded();

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
      const availableItems2 = screen.getByText(t`Available items`);
      console.log(availableItems == availableItems2);
      console.log(rightSideForm.innerHTML);
      console.log(productRow.outerHTML);
      const productCheckbox = productRow.querySelector('input')!;
      act(() => fireEvent.click(productCheckbox));
      const addProductsButton = screen.getByText(t`Add`);
      act(() => fireEvent.click(addProductsButton));

      // Check Subtotal got updated
      const subtotalLabel = screen.getByText(t`Subtotal`);
      const subtotalCardTableItem = findParentElement(
        subtotalLabel,
        ({ classList }) =>
          classList.contains('Monite-CreateReceivable-CardTableItem')
      )!;
      const subtotalCardValue: HTMLElement =
        subtotalCardTableItem.querySelector(
          '.Monite-CreateReceivable-CardTableItem-Value'
        )!;
      expect(parseFloat(subtotalCardValue.innerText)).toBeGreaterThan(0);
      // subtotalLabel;
    });
  });
});
