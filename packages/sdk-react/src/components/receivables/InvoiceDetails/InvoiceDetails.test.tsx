import React from 'react';

import { components } from '@/api';
import { Dialog } from '@/components';
import { InvoiceDetailsPermissions } from '@/core/queries/useReceivables';
import { receivableListFixture } from '@/mocks';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { InvoiceDetails } from './InvoiceDetails';

const invoice = receivableListFixture.invoice[0];
const quoteId = receivableListFixture.quote[0].id;
const creditNoteId = receivableListFixture.credit_note[0].id;

interface TestConcurrentActionParams {
  callback: string;
  successAssertion: string;
  status: InvoiceDetailsPermissions;
  invoiceStatus: components['schemas']['ReceivablesStatusEnum'];
}

function getActionButton(
  action: InvoiceDetailsPermissions
): Promise<HTMLElement> {
  const actionsSection = screen.getByTestId('InvoiceDetailsFooter');

  switch (action) {
    case 'delete': {
      return within(actionsSection).findByRole('button', {
        name: /Delete/i,
      });
    }

    case 'cancel': {
      return within(actionsSection).findByRole('button', {
        name: 'Cancel',
      });
    }

    case 'issue': {
      return within(actionsSection).findByRole('button', {
        name: /Issue/i,
      });
    }

    case 'mark_as_uncollectible': {
      return within(actionsSection).findByRole('button', {
        name: 'Mark as uncollectible invoice',
      });
    }
  }
}

describe('InvoiceDetails', () => {
  const quoteFixture = receivableListFixture.quote.find(
    (item) => item.id === quoteId
  );
  const invoiceFixture = receivableListFixture.invoice.find(
    (item) => item.id === invoice.id
  );
  const creditNoteFixture = receivableListFixture.credit_note.find(
    (item) => item.id === creditNoteId
  );
  const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

  if (!fixture) {
    throw new Error(`Could not find fixture by id: ${invoice}`);
  }

  const initialStatus = fixture.status;
  const initialType = fixture.type;

  afterEach(() => {
    /** After each test flush the fixture `status`, `type` to initial */
    fixture.status = initialStatus;
    fixture.type = initialType;
  });

  describe('# UI', () => {
    describe('# Create invoice', () => {
      test('should render Create Invoice form when we provide `type` but not `id`', async () => {
        renderWithClient(<InvoiceDetails type="invoice" />);

        await waitUntilTableIsLoaded();

        expect(screen.getByText(/create invoice/i)).toBeInTheDocument();
      });
    });

    describe('# Quote details', () => {
      test.skip('should show "Cancel" button for invoice in "ISSUED" status', async () => {
        fixture.status = 'issued';

        renderWithClient(<InvoiceDetails id={quoteId} />);

        await waitUntilTableIsLoaded();

        expect(await getActionButton('cancel')).toBeInTheDocument();
      });

      test.skip('should show "Cancel" and "MarkAsUncollectible" buttons for invoice in "OVERDUE" status', async () => {
        fixture.status = 'overdue';

        renderWithClient(
          <InvoiceDetails id="1b2fe86b-f02a-4f3f-a258-a19e53bd06ec" />
        );

        await waitUntilTableIsLoaded();

        expect(await getActionButton('cancel')).toBeInTheDocument();
        expect(
          await getActionButton('mark_as_uncollectible')
        ).toBeInTheDocument();
      });

      /** We should show **none** buttons for all these statuses */
      test.each([
        'accepted',
        'expired',
        'declined',
        'recurring',
        'partially_paid',
        'paid',
        'uncollectible',
        'canceled',
        'deleted',
      ] as const)(
        'should show none buttons for invoice in "%s" status',
        async (status) => {
          fixture.status = status;

          renderWithClient(<InvoiceDetails id={quoteId} />);

          await waitUntilTableIsLoaded();

          const footer = screen.getByTestId('InvoiceDetailsFooter');
          const buttons = within(footer).findAllByRole('button', undefined, {
            timeout: 200,
          });

          await expect(buttons).rejects.toThrow(/Unable to find role/);
        }
      );

      test('should make a toast when the invoice by provided "id" is not found', async () => {
        renderWithClient(<InvoiceDetails id="unsupported-invoice-id" />);

        await waitUntilTableIsLoaded();

        /**
         * The error may appear on the screen and in toast.
         * Because of that we just check that
         *  we have more than 0 elements in errors
         */
        const errors = await screen.findAllByText(
          'There is no receivable by provided id: unsupported-invoice-id'
        );

        expect(errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe.skip('# Actions', () => {
    const concurrentActions: Array<TestConcurrentActionParams> = [
      {
        callback: 'onIssue',
        successAssertion: 'issued',
        status: 'issue',
        invoiceStatus: 'draft',
      },
      {
        callback: 'onDelete',
        status: 'delete',
        successAssertion: 'deleted',
        invoiceStatus: 'draft',
      },
      {
        callback: 'onCancel',
        status: 'cancel',
        successAssertion: 'cancelled',
        invoiceStatus: 'issued',
      },
      {
        callback: 'onCancel',
        status: 'cancel',
        successAssertion: 'cancelled',
        invoiceStatus: 'overdue',
      },
      {
        callback: 'onMarkAsUncollectible',
        status: 'mark_as_uncollectible',
        successAssertion: 'marked as uncollectible',
        invoiceStatus: 'overdue',
      },
    ];

    /**
     * If you are not familiar with `test.concurrent.each` signature
     *  you can take a look at Jest documentation
     *
     * @see {@link https://jestjs.io/docs/api#testconcurrenteachtablename-fn-timeout} Jest test.concurrent.each documentation
     */
    test.each(concurrentActions)(
      'should call "$callback" callback when the invoice successfully $successAssertion',
      async ({ callback, status, invoiceStatus }) => {
        fixture.status = invoiceStatus;

        const onMock = jest.fn();
        const props = {
          [callback]: onMock,
        };

        renderWithClient(<InvoiceDetails id={quoteId} {...props} />);

        await waitUntilTableIsLoaded();

        const actionButton = await getActionButton(status);
        fireEvent.click(actionButton);

        await waitFor(() => {
          expect(onMock).toHaveBeenCalledWith(quoteId);
        });
      }
    );

    test('should call "onDelete" callback when the invoice has type "Quote"', async () => {
      fixture.type = 'quote';

      const onDeleteMock = jest.fn();

      renderWithClient(<InvoiceDetails id={quoteId} onDelete={onDeleteMock} />);

      await waitUntilTableIsLoaded();

      const deleteButton = await getActionButton('delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(onDeleteMock).toHaveBeenCalledWith(quoteId);
      });
    });

    test('should call "onDelete" callback when the invoice has type "CreditNote"', async () => {
      fixture.type = 'credit_note';

      const onDeleteMock = jest.fn();

      renderWithClient(<InvoiceDetails id={quoteId} onDelete={onDeleteMock} />);

      await waitUntilTableIsLoaded();

      const deleteButton = await getActionButton('delete');
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(onDeleteMock).toHaveBeenCalledWith(quoteId);
      });
    });

    test('should call "onClose" callback when the user clicks on "X" button', async () => {
      const onCloseMock = jest.fn();

      renderWithClient(
        <Dialog open onClose={onCloseMock}>
          <InvoiceDetails id={quoteId} />
        </Dialog>
      );

      await waitUntilTableIsLoaded();

      const closeButton = screen.getByRole('button', {
        name: 'Close invoice details',
      });
      fireEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe('# Edit invoice', () => {
    test('should show "EditInvoice" component when we click on "Edit invoice" button', async () => {
      renderWithClient(<InvoiceDetails id={invoice.id} />);

      const editButton = await screen.findByRole('button', {
        name: 'Edit invoice',
      });

      expect(editButton).toBeInTheDocument();

      fireEvent.click(editButton);

      const editInvoiceTitle = await screen.findByRole('heading', {
        name: /Edit invoice/i,
      });

      expect(editInvoiceTitle).toBeInTheDocument();
    });
  });
});
