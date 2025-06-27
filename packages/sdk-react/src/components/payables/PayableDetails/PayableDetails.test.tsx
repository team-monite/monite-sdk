import { components } from '@/api';
import { createAPIClient } from '@/api/client';
import { Dialog } from '@/components';
import { getInvoiceOverdueDays } from '@/components/payables/utils/getInvoiceOverdueDays';
import { ENTITY_ID_FOR_EMPTY_PERMISSIONS } from '@/mocks/entityUsers';
import {
  changeDocumentIdByPayableId,
  payableFixturePages,
} from '@/mocks/payables';
import {
  Provider,
  renderWithClient,
  waitUntilTableIsLoaded,
} from '@/utils/test-utils';
import { t } from '@lingui/macro';
import { QueryClient } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { format } from 'date-fns';
import { vi } from 'vitest';

import { PayableDetails } from './PayableDetails';

const payableId = '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0';

const fixture = payableFixturePages.find((payable) => payable.id === payableId);

if (!fixture) {
  throw new Error(`Could not find fixture by id: ${payableId}`);
}

const initialStatus = 'draft';

const { api } = createAPIClient();

describe('PayableDetails', () => {
  afterEach(() => {
    fixture.status = initialStatus;
  });

  describe('# Existing payable', () => {
    describe('# UI', () => {
      test('should show "Access restricted" view if the user has no permissions to see the page', async () => {
        const monite = {
          entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
          fetchToken: () =>
            Promise.resolve({
              access_token: 'token',
              token_type: 'Bearer',
              expires_in: 3600,
            }),
        };

        renderWithClient(<PayableDetails id={payableId} />, monite);

        await waitUntilTableIsLoaded();

        const accessRestricted = await screen.findByText(/Access restricted/i);

        expect(accessRestricted).toBeInTheDocument();
      });

      test.skip('should show error message if the payable is not found', async () => {
        renderWithClient(<PayableDetails id="not-existing-payable" />);

        await waitUntilTableIsLoaded();

        expect(screen.getByText(/Payable not found/)).toBeInTheDocument();
      });

      test.skip('should show "Draft" status,"Cancel" and "Save" buttons when create payable', async () => {
        renderWithClient(<PayableDetails />);

        await waitUntilTableIsLoaded();

        const draftStatus = screen.getByText(t`Draft`);

        const cancelButton = screen.getByRole('button', {
          name: t`Cancel`,
        });
        const saveButton = screen.getByRole('button', { name: t`Save` });

        expect(draftStatus).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
        expect(saveButton).toBeInTheDocument();
      });

      test.skip('should show "Cancel" and "Save" buttons when edit payable', async () => {
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const editButton = await screen.findByRole('button', {
          name: t`Edit`,
        });

        fireEvent.click(editButton);

        const cancelButton = screen.getByRole('button', {
          name: t`Cancel`,
        });
        const saveButton = screen.getByRole('button', { name: t`Save` });

        expect(cancelButton).toBeInTheDocument();
        expect(saveButton).toBeInTheDocument();
      });

      test.skip('should show "Draft" tag, "Edit" button for payable in "Draft" status', async () => {
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const draftStatus = screen.getByText(t`Draft`);
        const editButton = await screen.findByRole('button', {
          name: t`Edit`,
        });
        const actionsSection = screen.getByTestId('PayableDetailsActions');
        const buttons = within(actionsSection).queryAllByRole('button');

        expect(draftStatus).toBeInTheDocument();
        expect(editButton).toBeInTheDocument();
        expect(buttons).toHaveLength(1);
      });

      test.skip('should show "New" tag, "Edit", "Cancel" and "Submit" buttons for payable in "New" status', async () => {
        fixture.status = 'new';
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const editButton = await screen.findByRole('button', {
          name: t`Edit`,
        });
        const cancelButton = screen.getByRole('button', {
          name: t`Cancel bill`,
        });
        const submitButton = screen.getByRole('button', {
          name: t`Submit`,
        });
        const actionsSection = screen.getByTestId('PayableDetailsActions');
        const buttons = within(actionsSection).queryAllByRole('button');

        expect(editButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(buttons).toHaveLength(3);
      });

      test.skip('should show "Canceled" tag and no buttons for payable in "Canceled" status', async () => {
        fixture.status = 'canceled';
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const canceledStatus = screen.getByText(t`Canceled`);
        const actionsSection = screen.getByTestId('PayableDetailsActions');
        const buttons = within(actionsSection).queryAllByRole('button');

        expect(canceledStatus).toBeInTheDocument();
        expect(buttons).toHaveLength(0);
      });

      test.skip('should show "In Approval" tag, "Reject" and "Approve" button for payable in "In Approval" status', async () => {
        fixture.status = 'approve_in_progress';
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const pendingStatus = screen.getByText(t`In Approval`);
        const rejectButton = await screen.findByRole('button', {
          name: t`Reject`,
        });
        const approveButton = screen.getByRole('button', {
          name: t`Approve`,
        });
        const actionsSection = screen.getByTestId('PayableDetailsActions');
        const buttons = within(actionsSection).queryAllByRole('button');

        expect(pendingStatus).toBeInTheDocument();
        expect(rejectButton).toBeInTheDocument();
        expect(approveButton).toBeInTheDocument();
        expect(buttons).toHaveLength(2);
      });

      test.skip('should show "Rejected" tag and no buttons for payable in "Rejected" status', async () => {
        fixture.status = 'rejected';
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const rejectedStatus = screen.getByText(t`Rejected`);
        const actionsSection = screen.getByTestId('PayableDetailsActions');
        const buttons = within(actionsSection).queryAllByRole('button');

        expect(rejectedStatus).toBeInTheDocument();
        expect(buttons).toHaveLength(0);
      });

      test.skip('should show "Approved" tag, "Pay" button for payable in "Approved" status', async () => {
        fixture.status = 'waiting_to_be_paid';
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const waitingStatus = screen.getByText(t`Approved`);
        const payButton = await screen.findByRole('button', {
          name: t`Pay`,
        });
        const actionsSection = screen.getByTestId('PayableDetailsActions');
        const buttons = within(actionsSection).queryAllByRole('button');

        expect(waitingStatus).toBeInTheDocument();
        expect(payButton).toBeInTheDocument();
        expect(buttons).toHaveLength(1);
      });

      test.skip('should show "Paid" tag and no buttons for payable in "Paid" status', async () => {
        fixture.status = 'paid';
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const paidStatus = screen.getByText(t`Paid`);
        const actionsSection = screen.getByTestId('PayableDetailsActions');
        const buttons = within(actionsSection).queryAllByRole('button');

        expect(paidStatus).toBeInTheDocument();
        expect(buttons).toHaveLength(0);
      });
    });

    describe('# Public API', () => {
      const user = userEvent.setup();

      test.skip('should send correct request (required fields) when user update payable', async () => {
        const queryClient = new QueryClient();

        render(<PayableDetails id={payableId} />, {
          wrapper: ({ children }) => (
            <Provider client={queryClient} children={children} />
          ),
        });

        await waitUntilTableIsLoaded();

        const editButton = await screen.findByRole('button', {
          name: t`Edit`,
        });

        fireEvent.click(editButton);

        const InvoiceNumberValue = 'Invoice number';
        const invoiceNumberInput = screen.getByLabelText(t`Invoice Number *`);
        fireEvent.change(invoiceNumberInput, {
          target: { value: InvoiceNumberValue },
        });

        const saveButton = screen.getByRole('button', {
          name: t`Save`,
        });

        await user.click(saveButton);

        const requestBody = await waitFor(() => {
          const mutationsCache = queryClient.getMutationCache();

          const updatePayableMutation = mutationsCache.find({
            mutationKey: api.payables.patchPayablesId.getMutationKey(),
          });

          return updatePayableMutation?.state.variables?.body;
        });

        if (!requestBody) {
          throw new Error(
            'The mutation to update the payable has never been called'
          );
        }

        expect(requestBody).toMatchObject({
          document_id: InvoiceNumberValue,
          due_date: format(new Date(fixture.due_date!), 'yyyy-MM-dd'),
          currency: fixture.currency,
        });
      });
    });

    describe('# Actions', () => {
      const user = userEvent.setup();

      test.skip('should call "onClose" callback when the user clicks on "X" button', async () => {
        const onCloseMock = vi.fn();

        renderWithClient(
          <Dialog open={true}>
            <PayableDetails id={payableId} onClose={onCloseMock} />
          </Dialog>
        );

        await waitUntilTableIsLoaded();

        const closeButton = screen.getByRole('button', {
          name: 'Close payable details',
        });
        fireEvent.click(closeButton);

        expect(onCloseMock).toHaveBeenCalled();
      });

      test.skip('should trigger "onSaved" callback when we click on "Save" button', async () => {
        const onSavedMock = vi.fn();

        renderWithClient(
          <PayableDetails id={payableId} onSaved={onSavedMock} />
        );

        await waitUntilTableIsLoaded();

        const editButton = await screen.findByRole('button', {
          name: t`Edit`,
        });

        await user.click(editButton);

        const saveButton = await screen.findByRole('button', {
          name: t`Save`,
        });

        await user.click(saveButton);

        await waitFor(() => {
          expect(onSavedMock).toHaveBeenCalledWith(payableId);
        });
      });

      test.skip('should trigger "onCanceled" callback when we click on "Cancel" button', async () => {
        fixture.status = 'new';
        const onCanceledMock = vi.fn();

        renderWithClient(
          <PayableDetails id={payableId} onCanceled={onCanceledMock} />
        );

        await waitUntilTableIsLoaded();

        let cancelButton = await screen.findByRole('button', {
          name: t`Cancel bill`,
        });

        await user.click(cancelButton);

        // Reset cancelButton to the one from the modal
        cancelButton = await screen.findByRole('button', {
          name: t`Cancel bill`,
        });

        await user.click(cancelButton);

        await waitFor(() => {
          expect(onCanceledMock).toHaveBeenCalledWith(payableId);
        });
      });

      test.skip('should trigger "onSubmitted" callback when we click on "Submit" button', async () => {
        fixture.status = 'new';
        const onSubmittedMock = vi.fn();

        renderWithClient(
          <PayableDetails id={payableId} onSubmitted={onSubmittedMock} />
        );

        await waitUntilTableIsLoaded();

        const submitButton = await screen.findByRole('button', {
          name: t`Submit`,
        });

        await user.click(submitButton);

        await waitFor(() => {
          expect(onSubmittedMock).toHaveBeenCalledWith(payableId);
        });
      });

      test.skip('should trigger "onRejected" callback when we click on "Reject" button', async () => {
        fixture.status = 'approve_in_progress';
        const onRejectedMock = vi.fn();

        renderWithClient(
          <PayableDetails id={payableId} onRejected={onRejectedMock} />
        );

        await waitUntilTableIsLoaded();

        const rejectButton = await screen.findByRole('button', {
          name: t`Reject`,
        });

        await user.click(rejectButton);

        await waitFor(() => {
          expect(onRejectedMock).toHaveBeenCalledWith(payableId);
        });
      });

      test.skip('should trigger "onApproved" callback when we click on "Approve" button', async () => {
        fixture.status = 'approve_in_progress';
        const onApprovedMock = vi.fn();

        renderWithClient(
          <PayableDetails id={payableId} onApproved={onApprovedMock} />
        );

        await waitUntilTableIsLoaded();

        const approveButton = await screen.findByRole('button', {
          name: t`Approve`,
        });

        await user.click(approveButton);

        await waitFor(() => {
          expect(onApprovedMock).toHaveBeenCalledWith(payableId);
        });
      });

      //TODO: cover with test for integration flow of payments intent
      test.skip('should trigger "onPay" callback when we click on "Pay" button', async () => {
        const onPayMock = vi.fn();
        const payableId = 'waiting-to-be-paid-id';
        const fixture = { status: 'waiting_to_be_paid', id: payableId };

        renderWithClient(<PayableDetails id={fixture.id} onPay={onPayMock} />);

        await waitFor(() => {
          expect(screen.getByRole('button', { name: /pay/i })).toBeEnabled();
        });

        const payButton = screen.getByRole('button', { name: /pay/i });

        await userEvent.click(payButton);

        await waitFor(() => {
          expect(onPayMock).toHaveBeenCalledWith(fixture.id);
        });
      });
    });

    describe('# Detail information changes', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterAll(() => {
        vi.useRealTimers();
      });

      test.skip('should update UI when we change payable detail information', async () => {
        renderWithClient(<PayableDetails id={payableId} />);

        await waitUntilTableIsLoaded();

        const editButton = await screen.findByRole('button', {
          name: t`Edit`,
        });

        fireEvent.click(editButton);

        const oldDocumentId = fixture.document_id;

        expect(
          await screen.findByDisplayValue(oldDocumentId!, undefined, {
            timeout: 5_000,
          })
        ).toBeInTheDocument();

        const newDocumentId = changeDocumentIdByPayableId(payableId);

        vi.advanceTimersByTime(15_000);

        const newDocumentIdElement = await screen.findByDisplayValue(
          newDocumentId
        );

        expect(newDocumentIdElement).toBeInTheDocument();

        /** The old price shouldn't be in the document anymore */
        await expect(
          screen.findByDisplayValue(oldDocumentId!)
        ).rejects.toThrowError(/Unable to find an element/);
      });
    });

    describe('getInvoiceOverdueDays', () => {
      const createPayableInvoice = (
        status: components['schemas']['PayableStateEnum'],
        due_date: components['schemas']['PayableResponseSchema']['due_date']
      ): components['schemas']['PayableResponseSchema'] => ({
        id: 'some-unique-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        entity_id: 'some-entity-id',
        status,
        due_date,
        payable_origin: 'upload',
        source_of_payable_data: 'user_specified',
        credit_notes: [],
      });

      const testCasesPayable: {
        description: string;
        status: components['schemas']['PayableStateEnum'];
        due_date: string;
        expected: number;
      }[] = [
        {
          description:
            'should return false when due_date is after today for payable',
          status: 'draft',
          due_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          expected: 0,
        },
        {
          description: 'should return false when due_date is today for payable',
          status: 'new',
          due_date: new Date().toISOString(),
          expected: 0,
        },
        {
          description:
            'should return overdue days when due_date is before today for payable',
          status: 'waiting_to_be_paid',
          due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          expected: 1,
        },
        {
          description:
            'should return false for status not in overdue statuses, even if due_date is before today for payable',
          status: 'paid',
          due_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          expected: 0,
        },
        {
          description:
            'should return false for status not in overdue statuses and due_date is today for payable',
          status: 'approve_in_progress',
          due_date: new Date().toISOString(),
          expected: 0,
        },
      ];

      testCasesPayable.forEach(
        ({ description, status, due_date, expected }) => {
          it(description, () => {
            const invoice: components['schemas']['PayableResponseSchema'] =
              createPayableInvoice(status, due_date);
            expect(getInvoiceOverdueDays(invoice)).toBe(expected);
          });
        }
      );
    });
  });
});
