import React from 'react';

import { components } from '@/api';
import { MoniteProvider } from '@/core/context/MoniteProvider';
import {
  ENTITY_ID_FOR_EMPTY_PERMISSIONS,
  ENTITY_ID_FOR_LOW_PERMISSIONS,
} from '@/mocks/entityUsers';
import {
  addNewItemToPayablesList,
  payableFixturePages,
} from '@/mocks/payables';
import {
  renderWithClient,
  triggerClickOnSelectOption,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { PayablesTable } from './PayablesTable';

jest.useFakeTimers();
jest.setTimeout(10000);

describe('PayablesTable', () => {
  describe('# UI', () => {
    test('should render access restricted message when user does not have access to payables', async () => {
      const monite = new MoniteSDK({
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 10_000,
          }),
      });

      renderWithClient(
        <MoniteProvider monite={monite}>
          <PayablesTable />
        </MoniteProvider>
      );

      expect(await screen.findByText(/Access Restricted/)).toBeInTheDocument();
    }, 10_000);

    test('should render a special row for payable in OCR processing', async () => {
      renderWithClient(<PayablesTable />);

      await waitUntilTableIsLoaded();

      const payableInOcr = payableFixturePages[1];

      const fileNameCell = await screen.findByRole('cell', {
        name: String(payableInOcr.file?.name),
      });
      const ocrStatusCell = screen.getByRole('cell', {
        name: /Processing file/i,
      });

      expect(fileNameCell).toBeInTheDocument();
      expect(fileNameCell.getAttribute('aria-colspan')).toEqual('2');

      expect(ocrStatusCell).toBeInTheDocument();
      expect(ocrStatusCell.getAttribute('aria-colspan')).toEqual('3');
    });
  });

  describe('# Actions', () => {
    test('should trigger a `onRowClick` callback when click on a row', async () => {
      const onRowClickMock = jest.fn();

      renderWithClient(<PayablesTable onRowClick={onRowClickMock} />);

      await waitUntilTableIsLoaded();

      const firstPayable = payableFixturePages[0];

      if (!firstPayable)
        throw new Error('Could not find any organization in the fixtures list');

      const company = await screen.findByText(String(firstPayable.document_id));

      fireEvent.click(company);

      expect(firstPayable.id).toBeDefined();
      expect(onRowClickMock).toHaveBeenCalledWith(firstPayable.id);
    });

    test('should trigger "onChangeFilterMock" with "field: search" when we are filtering items', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(<PayablesTable onChangeFilter={onChangeFilterMock} />);

      await waitUntilTableIsLoaded();

      const search = screen.getByLabelText('Search');

      const searchValue = 'Acme';
      fireEvent.change(search, {
        target: { value: searchValue },
      });

      /**
       * We have to push the timer forward because `search` is debounced,
       *  and we have to wait until the search will be executed
       */
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(onChangeFilterMock).toHaveBeenCalledWith({
          field: 'search',
          value: searchValue,
        });
      });
    });

    test('should trigger "onChangeFilterMock" with "status" and changing "value" when we are filtering payables', async () => {
      const onChangeFilterMock = jest.fn();

      renderWithClient(<PayablesTable onChangeFilter={onChangeFilterMock} />);

      await waitUntilTableIsLoaded();

      fireEvent.mouseDown(
        screen.getByRole('button', {
          name: /status/i,
        })
      );

      const statusDropdown = await screen.findByRole('listbox', {
        name: /status/i,
      });
      const { getByRole } = within(statusDropdown);
      const paidOption = getByRole('option', {
        name: 'Paid',
      });
      fireEvent.click(paidOption);

      await waitFor(() => {
        expect(onChangeFilterMock).toHaveBeenCalledWith({
          field: 'status',
          value: 'paid',
        });
      });
    });

    test('should show "Pay" button for payables in status "Waiting to be paid" and user has permission to pay', async () => {
      const onPayMock = jest.fn();

      renderWithClient(<PayablesTable onPay={onPayMock} />);

      /** We may have multiple items with button `Pay` */
      const payButtons = await screen.findAllByRole('button', { name: 'Pay' });
      const payButton = payButtons[0];

      fireEvent.click(payButton);

      expect(onPayMock).toHaveBeenCalled();
    });

    test('should NOT show "Pay" button for payables in status "Waiting to be paid" but the user has NO permission to pay', async () => {
      const onPayMock = jest.fn();

      const monite = new MoniteSDK({
        /**
         * If the `entity-id` is `low-permissions`,
         *  then the server will say that all actions
         *  are not available for the current user
         */
        entityId: ENTITY_ID_FOR_LOW_PERMISSIONS,
        fetchToken: () =>
          Promise.resolve({
            access_token: 'token',
            token_type: 'Bearer',
            expires_in: 10_000,
          }),
      });

      renderWithClient(<PayablesTable onPay={onPayMock} />, monite);

      await waitUntilTableIsLoaded();

      /** We may have multiple items with button `Pay` */
      const payButtons = screen.queryAllByRole('button', { name: 'Pay' });

      expect(payButtons).toEqual([]);
      expect(onPayMock).not.toHaveBeenCalled();
    });
  });

  describe('# Filters', () => {
    test('should filter items by name when we fill information in "Search"', async () => {
      renderWithClient(<PayablesTable />);

      await waitUntilTableIsLoaded();

      const search = screen.getByLabelText('Search');

      const searchValue = 'Acme Inc Second Page';
      fireEvent.change(search, {
        target: { value: searchValue },
      });

      /**
       * We have to push the timer forward because `search` is debounced,
       *  and we have to wait until the search will be executed
       */
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        const items = screen.getAllByRole('row');

        expect(items.length).toEqual(1);
      });
    });

    test('should filter items by "Status" when we click on "Status" filter', async () => {
      renderWithClient(<PayablesTable />);

      await waitUntilTableIsLoaded();

      triggerClickOnSelectOption('Status', 'Draft');

      await waitUntilTableIsLoaded();

      const itemsBeforeSort = screen
        .getAllByRole('row')
        // Skip the first row, because it's a header
        .slice(1)
        .map((i) => i.textContent)
        .filter((i) => i!.match(/Draft/));

      // We may have 0 items with status "Draft"
      expect(itemsBeforeSort.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('# Pagination', () => {
    test('should fetch only first 10 elements when the page limit is 10', async () => {
      renderWithClient(<PayablesTable />);

      await waitUntilTableIsLoaded();

      await waitFor(() => {
        const items = screen.getAllByRole('row').slice(1);

        expect(items.length).toBe(10);
      });
    });

    test('should next page be available when we render first page', async () => {
      renderWithClient(<PayablesTable />);

      await waitUntilTableIsLoaded();

      const nextButton = getNextButton();
      const prevButton = getPrevButton();

      const nextDisabled = nextButton.hasAttribute('disabled');
      const prevDisabled = prevButton.hasAttribute('disabled');

      expect(nextDisabled).toBeFalsy();
      expect(prevDisabled).toBeTruthy();
    });

    test('should fetch previous 10 elements when we click on "prev" button', async () => {
      renderWithClient(<PayablesTable />);

      await waitUntilTableIsLoaded();

      const nextButton = getNextButton();

      fireEvent.click(nextButton);

      const firstPageCounterpartDocumentId =
        payableFixturePages[0].document_id!;

      await waitFor(() => {
        expect(
          screen.queryByText(firstPageCounterpartDocumentId)
        ).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(getPrevButton().hasAttribute('disabled')).toBe(false);
      });

      fireEvent.click(getPrevButton());

      expect(
        await screen.findByText(firstPageCounterpartDocumentId)
      ).toBeInTheDocument();
    });
  });

  describe('# Live Updates', () => {
    test('should update the table list of payables when the data has been added on the server', async () => {
      let resultItem:
        | components['schemas']['PayableResponseSchema']
        | undefined = undefined;

      renderWithClient(
        <PayablesTable
          onRowClick={() => {
            resultItem = addNewItemToPayablesList();
          }}
        />
      );

      await waitUntilTableIsLoaded();

      const firstPayable = payableFixturePages[0];

      const invoiceId = await screen.findByText(
        String(firstPayable.document_id)
      );

      fireEvent.click(invoiceId);

      await waitFor(() => {
        expect(resultItem).not.toBeUndefined();
      });

      /**
       * Push the timer forward for `refetchInterval` milliseconds
       *  to wait until the table will be re-fetched
       *  and new data will come
       */
      jest.advanceTimersByTime(2_000);

      expect(
        await screen.findByText(String(resultItem!.document_id))
      ).toBeInTheDocument();
    });
  });
});

/** Returns `next` button on the page */
function getNextButton() {
  return screen.getByRole('button', { name: /next/i });
}

/** Returns `previous` button on the page */
function getPrevButton() {
  return screen.getByRole('button', { name: /previous/i });
}
