import React from 'react';

import { Dialog } from '@/components';
import { InvoiceDetailsPermissions } from '@/core/queries';
import { receivableListFixture } from '@/mocks';
import { renderWithClient, waitUntilTableIsLoaded } from '@/utils/test-utils';
import {
  CreditNoteResponsePayload,
  InvoiceResponsePayload,
  QuoteResponsePayload,
  ReceivablesStatusEnum,
} from '@monite/sdk-api';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';

import { InvoiceDetails } from './InvoiceDetails';

const invoiceId = receivableListFixture.quote[0].id;

interface TestConcurrentActionParams {
  callback: string;
  successAssertion: string;
  status: InvoiceDetailsPermissions;
  invoiceStatus: ReceivablesStatusEnum;
}

function getActionButton(
  action: InvoiceDetailsPermissions
): Promise<HTMLElement> {
  const actionsSection = screen.getByTestId('InvoiceDetailsFooter');

  switch (action) {
    case InvoiceDetailsPermissions.Delete: {
      return within(actionsSection).findByRole('button', {
        name: 'Delete invoice',
      });
    }

    case InvoiceDetailsPermissions.Cancel: {
      return within(actionsSection).findByRole('button', {
        name: 'Cancel',
      });
    }

    case InvoiceDetailsPermissions.Issue: {
      return within(actionsSection).findByRole('button', {
        name: 'Issue invoice',
      });
    }

    case InvoiceDetailsPermissions.MarkAsUncollectible: {
      return within(actionsSection).findByRole('button', {
        name: 'Mark as uncollectible invoice',
      });
    }
  }
}

describe('InvoiceDetails', () => {
  const quoteFixture = receivableListFixture.quote.find(
    (item) => item.id === invoiceId
  );
  const invoiceFixture = receivableListFixture.invoice.find(
    (item) => item.id === invoiceId
  );
  const creditNoteFixture = receivableListFixture.credit_note.find(
    (item) => item.id === invoiceId
  );
  const fixture = quoteFixture || invoiceFixture || creditNoteFixture;

  if (!fixture) {
    throw new Error(`Could not find fixture by id: ${invoiceId}`);
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
        renderWithClient(
          <InvoiceDetails type={InvoiceResponsePayload.type.INVOICE} />
        );

        await waitUntilTableIsLoaded();

        expect(screen.getByText(/create invoice/i)).toBeInTheDocument();
      });
    });

    describe('# Invoice details', () => {
      test('should show "Issue" and "Delete" buttons for invoice in "Draft" status', async () => {
        fixture.status = ReceivablesStatusEnum.DRAFT;

        renderWithClient(<InvoiceDetails id={invoiceId} />);

        await waitUntilTableIsLoaded();

        expect(
          await getActionButton(InvoiceDetailsPermissions.Issue)
        ).toBeInTheDocument();
        expect(
          await getActionButton(InvoiceDetailsPermissions.Delete)
        ).toBeInTheDocument();
      });

      test.skip('should show "Cancel" button for invoice in "ISSUED" status', async () => {
        fixture.status = ReceivablesStatusEnum.ISSUED;

        renderWithClient(<InvoiceDetails id={invoiceId} />);

        await waitUntilTableIsLoaded();

        expect(
          await getActionButton(InvoiceDetailsPermissions.Cancel)
        ).toBeInTheDocument();
      });

      test.skip('should show "Cancel" and "MarkAsUncollectible" buttons for invoice in "OVERDUE" status', async () => {
        fixture.status = ReceivablesStatusEnum.OVERDUE;

        renderWithClient(
          <InvoiceDetails id="1b2fe86b-f02a-4f3f-a258-a19e53bd06ec" />
        );

        await waitUntilTableIsLoaded();

        expect(
          await getActionButton(InvoiceDetailsPermissions.Cancel)
        ).toBeInTheDocument();
        expect(
          await getActionButton(InvoiceDetailsPermissions.MarkAsUncollectible)
        ).toBeInTheDocument();
      });

      /** We should show **none** buttons for all these statuses */
      test.each([
        ReceivablesStatusEnum.ACCEPTED,
        ReceivablesStatusEnum.EXPIRED,
        ReceivablesStatusEnum.DECLINED,
        ReceivablesStatusEnum.RECURRING,
        ReceivablesStatusEnum.PARTIALLY_PAID,
        ReceivablesStatusEnum.PAID,
        ReceivablesStatusEnum.UNCOLLECTIBLE,
        ReceivablesStatusEnum.CANCELED,
        ReceivablesStatusEnum.DELETED,
      ] as const)(
        'should show none buttons for invoice in "%s" status',
        async (status) => {
          fixture.status = status;

          renderWithClient(<InvoiceDetails id={invoiceId} />);

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
        status: InvoiceDetailsPermissions.Issue,
        invoiceStatus: ReceivablesStatusEnum.DRAFT,
      },
      {
        callback: 'onDelete',
        status: InvoiceDetailsPermissions.Delete,
        successAssertion: 'deleted',
        invoiceStatus: ReceivablesStatusEnum.DRAFT,
      },
      {
        callback: 'onCancel',
        status: InvoiceDetailsPermissions.Cancel,
        successAssertion: 'cancelled',
        invoiceStatus: ReceivablesStatusEnum.ISSUED,
      },
      {
        callback: 'onCancel',
        status: InvoiceDetailsPermissions.Cancel,
        successAssertion: 'cancelled',
        invoiceStatus: ReceivablesStatusEnum.OVERDUE,
      },
      {
        callback: 'onMarkAsUncollectible',
        status: InvoiceDetailsPermissions.MarkAsUncollectible,
        successAssertion: 'marked as uncollectible',
        invoiceStatus: ReceivablesStatusEnum.OVERDUE,
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

        renderWithClient(<InvoiceDetails id={invoiceId} {...props} />);

        await waitUntilTableIsLoaded();

        const actionButton = await getActionButton(status);
        fireEvent.click(actionButton);

        await waitFor(() => {
          expect(onMock).toHaveBeenCalledWith(invoiceId);
        });
      }
    );

    test('should call "onDelete" callback when the invoice has type "Quote"', async () => {
      fixture.type = QuoteResponsePayload.type.QUOTE;

      const onDeleteMock = jest.fn();

      renderWithClient(
        <InvoiceDetails id={invoiceId} onDelete={onDeleteMock} />
      );

      await waitUntilTableIsLoaded();

      const deleteButton = await getActionButton(
        InvoiceDetailsPermissions.Delete
      );
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(onDeleteMock).toHaveBeenCalledWith(invoiceId);
      });
    });

    test('should call "onDelete" callback when the invoice has type "CreditNote"', async () => {
      fixture.type = CreditNoteResponsePayload.type.CREDIT_NOTE;

      const onDeleteMock = jest.fn();

      renderWithClient(
        <InvoiceDetails id={invoiceId} onDelete={onDeleteMock} />
      );

      await waitUntilTableIsLoaded();

      const deleteButton = await getActionButton(
        InvoiceDetailsPermissions.Delete
      );
      fireEvent.click(deleteButton);

      await waitFor(() => {
        expect(onDeleteMock).toHaveBeenCalledWith(invoiceId);
      });
    });

    test('should call "onClose" callback when the user clicks on "X" button', async () => {
      const onCloseMock = jest.fn();

      renderWithClient(
        <Dialog open onClose={onCloseMock}>
          <InvoiceDetails id={invoiceId} />
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
});
