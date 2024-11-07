import { VirtuosoMockContext } from 'react-virtuoso';

import { Receivables } from '@/components';
import { CounterpartDataTestId } from '@/components/counterparts/Counterpart.types';
import { CreateCounterpartDialogTestEnum } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CreateCounterpartDialog.types';
import { entityIds, entityVatIdList } from '@/mocks/entities';
import { paymentTermsFixtures } from '@/mocks/paymentTerms';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import {
  findParentElement,
  Provider,
  renderWithClient,
  triggerClickOnAutocompleteOption,
  triggerClickOnFirstAutocompleteOption,
  triggerClickOnSelectOption,
  waitForCondition,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { QueryClient } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { CreateReceivables } from './CreateReceivables';

describe.skip('CreateReceivables', () => {
  test('should show errors when user submit an empty form', async () => {
    renderWithClient(<CreateReceivables type={'invoice'} />);

    await waitUntilTableIsLoaded();

    const submitButton = screen.getByRole('button', { name: /Next page/i });

    fireEvent.click(submitButton);

    const errors = await screen.findAllByText(/ is a required/i);

    expect(errors.length).toBeGreaterThanOrEqual(1);
  });

  test('should show "items is empty" error when user submit an empty form', async () => {
    renderWithClient(<CreateReceivables type={'invoice'} />);

    await waitUntilTableIsLoaded();

    const submitButton = screen.getByRole('button', { name: /Next/i });

    fireEvent.click(submitButton);

    const error = await screen.findByText(/ add at least 1 item/i);

    expect(error).toBeInTheDocument();
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
    fireEvent.click(createInvoiceButton);

    await waitForCondition(
      () =>
        !!screen.queryByRole('button', {
          name: t`Next page`,
        })
    );
    const nextPageButtonPromise = screen.findByRole('button', {
      name: t`Next page`,
    });
    await expect(nextPageButtonPromise).resolves.toBeEnabled();

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

    await triggerClickOnFirstAutocompleteOption(/Bill to/i);
    await triggerClickOnFirstAutocompleteOption(/Billing address/i);
    await triggerClickOnFirstAutocompleteOption(/Your VAT ID/i);
    await triggerClickOnFirstAutocompleteOption(/Payment terms/i);

    const itemsHeader = screen.getByText(t`Items`);
    // Use querySelector to find the 'Add Item' button.
    // Due to the button icon, the screen.getByText won't find it
    const addItemButton = itemsHeader.parentElement!.querySelector('button')!;
    fireEvent.click(addItemButton);
    await waitForCondition(
      () => !!screen.queryByText(`Available items`),
      3_000
    );

    const availableItems = screen.getByText(t`Available items`);
    const rightSideForm = findParentElement(
      availableItems,
      ({ tagName }) => tagName == 'FORM'
    )!;
    await waitForCondition(
      () => !!rightSideForm.querySelector('tbody tr input'),
      3_000
    );
    const productCheckbox = rightSideForm.querySelector('tbody tr input')!;
    fireEvent.click(productCheckbox);

    const addProductsButton = screen.getByRole('button', { name: t`Add` });
    fireEvent.click(addProductsButton);
    await waitForElementToBeRemoved(addProductsButton, {
      timeout: 3_000,
    });

    const nextPageButton = await nextPageButtonPromise;
    fireEvent.click(nextPageButton);

    await waitForCondition(
      () => !!screen.queryByRole('button', { name: t`Compose email` }),
      3_000
    );
  }, 30_000);

  describe('# Select Counterpart', () => {
    test('should show "Create counterpart" dialog when the user clicks on "Bill to" select and "Create new counterpart" button', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      triggerClickOnAutocompleteOption(/Bill to/i, /Create new counterpart/i);

      const counterpartDialog = await screen.findByTestId(
        CreateCounterpartDialogTestEnum.DataTestId
      );

      expect(counterpartDialog).toBeInTheDocument();
    });

    test('should show "Create individual" dialog when the user clicks on "individual" button', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      triggerClickOnAutocompleteOption(/Bill to/i, /Create new counterpart/i);

      const individualButton = await screen.findByText(/Individual person/i);
      fireEvent.click(individualButton);

      expect(await screen.findByTestId(CounterpartDataTestId.IndividualForm));
    });

    test('should show "Create organization" dialog when the user clicks on "organization" button', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      triggerClickOnAutocompleteOption(/Bill to/i, /Create new counterpart/i);

      const organizationButton = await screen.findByText(/Organization/i);

      await waitFor(() => {
        expect(organizationButton).not.toBeDisabled();
      });

      fireEvent.click(organizationButton);

      expect(await screen.findByTestId(CounterpartDataTestId.OrganizationForm));
    });
  });

  describe('# Select Item', () => {
    test('should show "Create item" dialog when the user clicks on "Add item" button', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      fireEvent.click(screen.getByRole('button', { name: 'Add item' }));

      expect(await screen.findByText(/Select invoice currency/i));
    });

    test('should show "Create item" dialog when the user clicks on "Add item" button', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      fireEvent.click(screen.getByRole('button', { name: 'Add item' }));

      expect(await screen.findByText(/Select invoice currency/i));
    });

    test('should show "Create product" dialog when the user clicks on "Add item" button and then "Create new" button', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
      fireEvent.click(screen.getByRole('button', { name: 'Create new' }));

      expect(await screen.findByText(/Create New Product/i));
    });
  });

  describe('# Fulfillment date', () => {
    test('should fill "Fulfillment date" with the current date when the user clicks on "Same as invoice date" checkbox', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      const fulfillmentDateInput = screen.getByLabelText(/Fulfillment date/i);

      expect(fulfillmentDateInput).toHaveValue('');

      const sameAsInvoiceDateCheckbox = screen.getByRole('checkbox', {
        name: /Same as invoice date/i,
      });

      fireEvent.click(sameAsInvoiceDateCheckbox);

      const today = new Date();
      const formatted = new Intl.DateTimeFormat(
        'de-DE',
        DateTimeFormatOptions.EightDigitDate
      ).format(today);

      expect(fulfillmentDateInput).toHaveValue(formatted);
    });
  });

  describe('# Entity VAT ID', () => {
    test('should be able to select entity VAT id when data is fetched', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      const errorMessage = 'VAT ID is a required field';

      /** We should have an error if we do not fill entity vat id */
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(await screen.findByText(errorMessage)).toBeInTheDocument();

      const vatIdByEntity = entityVatIdList[entityIds[0]];
      const firstVatID = vatIdByEntity.data[0];

      /** We shouldn't have this error when we fill entity VAT id */
      triggerClickOnSelectOption(/Your VAT ID/i, firstVatID.value);
      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      });
    });
  });

  describe('# Payment terms', () => {
    test('should be able to select payment term when data is fetched', async () => {
      const onCreateMock = jest.fn();

      renderWithClient(
        <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
      );

      await waitUntilTableIsLoaded();

      const errorMessage = 'Payment terms is a required field';

      /** We should have an error if we do not fill entity vat id */
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(await screen.findByText(errorMessage)).toBeInTheDocument();

      const firstPaymentTerm = paymentTermsFixtures.data?.[0];

      if (!firstPaymentTerm) {
        throw new Error('Payment terms fixtures are empty');
      }

      /** We shouldn't have this error when we fill entity VAT id */
      triggerClickOnSelectOption(
        /Payment term/i,
        new RegExp(firstPaymentTerm.name, 'i')
      );
      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      });
    });
  });
});
