import { toast } from 'react-hot-toast';
import { usePreviousDistinct } from 'react-use';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCurrencies } from '@/core/hooks';
import { useReceivableById } from '@/core/queries/useReceivables';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { plural, t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

import deepEqual from 'deep-eql';

export const InvoiceRecurrenceCancelModal = ({
  receivableId,
  open,
  onClose,
}: {
  receivableId: string;
  open: boolean;
  onClose: () => void;
}) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { data: receivable, isLoading: isReceivableLoading } =
    useReceivableById(receivableId);

  const { api, queryClient } = useMoniteContext();

  const invoice = receivable?.type === 'invoice' ? receivable : undefined;
  const recurrence_id = invoice?.recurrence_id ?? '';

  const cancelRecurrenceMutation =
    api.recurrences.postRecurrencesIdCancel.useMutation(
      { path: { recurrence_id } },
      {
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
        onSuccess: async () => {
          await Promise.all([
            api.receivables.getReceivables.invalidateQueries(queryClient),
            api.receivables.getReceivablesId.invalidateQueries(
              { parameters: { path: { receivable_id: receivableId } } },
              queryClient
            ),
            api.recurrences.getRecurrencesId.invalidateQueries(
              { parameters: { path: { recurrence_id } } },
              queryClient
            ),
          ]);
          toast.success(t(i18n)`Recurrence has been canceled`);
        },
      }
    );

  const { formatCurrencyToDisplay } = useCurrencies();

  const { data: recurrence } = api.recurrences.getRecurrencesId.useQuery(
    { path: { recurrence_id: recurrence_id } },
    { enabled: Boolean(recurrence_id) }
  );

  const previousRecurrence = usePreviousDistinct(recurrence, deepEqual);

  const totalPendingInvoices = (
    previousRecurrence?.status === 'active' && recurrence?.status === 'canceled'
      ? previousRecurrence
      : recurrence
  )?.iterations.filter(({ status }) => status === 'pending').length;

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
    <Dialog
      open={open && Boolean(receivableId)}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Cancel recurrence confirmation`}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle variant="h3">{t(
        i18n
      )`Confirm Cancellation of Recurring Invoice`}</DialogTitle>
      <DialogContent>
        <Typography>
          {t(i18n)`Are you sure you want to cancel this recurring invoice?`}
        </Typography>
        <ul>
          <Typography component="li">
            {t(i18n)`All future iterations of this invoice will be canceled.`}
          </Typography>
          {invoice && totalPendingInvoices !== undefined && (
            <Typography component="li">
              <Trans>
                Total amount for <strong>{totalPendingInvoices}</strong>{' '}
                canceled {invoicesPluralForm}:{' '}
                <strong>{pendingInvoicesTotalAmountWithCreditNotes}</strong>
              </Trans>
            </Typography>
          )}
        </ul>
        <Typography>{t(i18n)`This action can't be undone.`}</Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="inherit">
          {t(i18n)`Close`}
        </Button>
        <Button
          autoFocus
          variant="outlined"
          color="error"
          disabled={
            cancelRecurrenceMutation.isPending ||
            isReceivableLoading ||
            recurrence?.status !== 'active'
          }
          onClick={(event) => {
            event.preventDefault();
            cancelRecurrenceMutation.mutate(undefined, {
              onSuccess: onClose,
            });
          }}
        >
          {t(i18n)`Cancel recurrence`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
