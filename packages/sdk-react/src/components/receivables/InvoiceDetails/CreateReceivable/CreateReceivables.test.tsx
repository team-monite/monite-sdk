import { CounterpartDataTestId } from '@/components/counterparts/Counterpart.types';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { CreateCounterpartDialogTestEnum } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CreateCounterpartDialog.types';
import { counterpartListFixture } from '@/mocks';
import { entityIds, entityVatIdList } from '@/mocks/entities';
import { paymentTermsFixtures } from '@/mocks/paymentTerms';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import {
  renderWithClient,
  triggerClickOnAutocompleteOption,
  triggerClickOnSelectOption,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { screen, fireEvent, waitFor } from '@testing-library/react';

import { CreateReceivables } from './CreateReceivables';

describe('CreateReceivables', () => {
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

    const submitButton = screen.getByRole('button', { name: /create/i });

    fireEvent.click(submitButton);

    const error = await screen.findByText(/ add at least 1 item/i);

    expect(error).toBeInTheDocument();
  });

  test.skip('should create receivable when the form is valid', async () => {
    const onCreateMock = jest.fn();

    renderWithClient(
      <CreateReceivables type={'invoice'} onCreate={onCreateMock} />
    );

    await waitUntilTableIsLoaded();

    const firstCounterpart = counterpartListFixture[0];

    // Select first counterpart
    triggerClickOnSelectOption(
      /Bill to/i,
      getCounterpartName(firstCounterpart)
    );

    // Select the first two items
    fireEvent.click(screen.getByRole('button', { name: 'Add item' }));
    const checkboxes = await screen.findAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /create/i });
      fireEvent.click(submitButton);

      expect(onCreateMock).toHaveBeenCalled();
    });
  });

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
      fireEvent.click(screen.getByRole('button', { name: /create/i }));
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
      fireEvent.click(screen.getByRole('button', { name: /create/i }));
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
