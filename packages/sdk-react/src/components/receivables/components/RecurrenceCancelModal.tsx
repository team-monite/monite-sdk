import { usePreviousDistinct } from 'react-use';

import { useCurrencies } from '@/core/hooks';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { plural, t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import deepEqual from 'deep-eql';
import { components } from '@/api';
import { useCancelRecurrence } from '@/components/receivables/hooks/useCancelRecurrence';
import { useGetRecurrenceById } from '@/components/receivables/hooks/useGetRecurrenceById';

export const RecurrenceCancelModal = ({
  invoice,
  open,
  onClose,
}: {
  invoice: components['schemas']['InvoiceResponsePayload'];
  open: boolean;
  onClose: () => void;
}) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  const recurrence_id = invoice?.recurrence_id ?? '';

  const { mutate: cancelRecurrence, isPending: isCancellingRecurrence } = 
    useCancelRecurrence(recurrence_id, invoice.id);

  const { data: recurrence } = useGetRecurrenceById(recurrence_id);

  const previousRecurrence = usePreviousDistinct(recurrence, deepEqual);

  const totalPendingInvoices = (
    previousRecurrence?.status === 'active' && recurrence?.status === 'canceled'
      ? previousRecurrence
      : recurrence
  )?.iterations?.filter(({ status }) => status === 'pending')?.length ?? 0;

  const pendingInvoicesTotalAmountWithCreditNotes =
    invoice && totalPendingInvoices !== undefined
      ? formatCurrencyToDisplay(
          invoice.total_amount_with_credit_notes * totalPendingInvoices,
          invoice.currency
        )
      : undefined;

  const invoicesPluralForm = t(i18n)`${plural(totalPendingInvoices ?? 0, {
    one: 'invoice',
    two: 'invoices',
    few: 'invoices',
    many: 'invoices',
    zero: 'invoices',
    other: 'invoices',
  })}`;

  return (
    <ConfirmationModal
      open={open && Boolean(invoice.id)}
      title={t(i18n)`Cancel Recurring Invoice`}
      confirmLabel={t(i18n)`Cancel recurrence`}
      cancelLabel={t(i18n)`Close`}
      onClose={onClose}
      onConfirm={() => cancelRecurrence(undefined, {
        onSuccess: onClose,
      })}
      isLoading={isCancellingRecurrence}
    >
      <span className="mtw:inline-block">
        {t(i18n)`Are you sure you want to cancel this recurring invoice?`}
      </span>
      <span className="mtw:inline-block">
        {t(i18n)`All future iterations of this invoice will be canceled.`}
      </span>
      {invoice && totalPendingInvoices !== undefined && (
        <span className="mtw:inline-block">
          <Trans>
            Total amount for <strong>{totalPendingInvoices}</strong> canceled{' '}
            {invoicesPluralForm}:{' '}
            <strong>{pendingInvoicesTotalAmountWithCreditNotes}</strong>
          </Trans>
        </span>
      )}
      <span className="mtw:inline-block">{t(i18n)`This action can't be undone.`}</span>
    </ConfirmationModal>
  );
};
