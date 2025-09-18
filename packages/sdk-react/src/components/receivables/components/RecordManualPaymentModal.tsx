import { ManualPaymentRecordDetails } from './ManualPaymentRecordDetails';
import { PaymentRecordForm } from './PaymentRecordForm';
import { components } from '@/api';
import { type ManualPaymentRecordFormValues } from '@/components/receivables/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useCreatePaymentRecord } from '@/core/queries/usePaymentRecords';
import { fromMinorUnits, toMinorUnits } from '@/core/utils/currency';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { useState } from 'react';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  children: ({ openModal }: { openModal: () => void }) => React.ReactNode;
};

type PaymentRecordDetails = ManualPaymentRecordFormValues & {
  created_by: string;
};

const DEFAULT_PAYMENT_RECORD: PaymentRecordDetails = {
  amount: 0,
  payment_date: new Date(),
  payment_time: new Date(),
  created_by: '',
};

export const RecordManualPaymentModal = ({ children, invoice }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmSubmission, setConfirmSubmission] = useState(false);
  const [formValues, setFormValues] = useState<PaymentRecordDetails>(
    DEFAULT_PAYMENT_RECORD
  );

  const { i18n } = useLingui();
  const { root } = useRootElements();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const { api, queryClient } = useMoniteContext();
  const { mutate: createPaymentRecord, isPending: isCreatingPaymentRecord } =
    useCreatePaymentRecord();
  const { data: user, isLoading: isLoadingUser } = useEntityUserByAuthToken();

  const showConfirmation = (data: ManualPaymentRecordFormValues) => {
    setFormValues({
      ...data,
      amount: toMinorUnits(data?.amount ?? 0),
      created_by: user?.id ?? '',
    });
    setConfirmSubmission(true);
  };

  const resetForm = () => {
    setConfirmSubmission(false);
    setFormValues(DEFAULT_PAYMENT_RECORD);
  };

  const createManualPaymentRecord = () => {
    const dateTimeWithReplacedTime = new Date(formValues.payment_date).setHours(
      formValues.payment_time.getHours(),
      formValues.payment_time.getMinutes()
    );

    const paid_at = new Date(dateTimeWithReplacedTime);

    createPaymentRecord(
      {
        amount: formValues?.amount ?? 0,
        currency: invoice.currency,
        paid_at: paid_at.toISOString(),
        object: {
          id: invoice.id,
          type: 'receivable',
        },
        payment_intent_id: invoice.id,
        entity_user_id: user?.id,
        status: 'succeeded',
      },
      {
        onSuccess: () => {
          api.receivables.getReceivablesId.invalidateQueries(
            {
              parameters: { path: { receivable_id: invoice.id } },
            },
            queryClient
          );
          api.receivables.getReceivables.invalidateQueries(queryClient);
          closeModal();
          resetForm();
        },
      }
    );
  };
  const isLoading = isCreatingPaymentRecord || isLoadingUser;

  if (
    [
      'draft',
      'paid',
      'canceled',
      'deleted',
      'accepted',
      'recurring',
      'expired',
      'declined',
      'uncollectible',
    ].includes(invoice.status)
  )
    return null;

  return (
    <>
      {children({ openModal })}
      <Dialog
        open={modalOpen}
        onClose={closeModal}
        container={root}
        aria-labelledby="dialog-title"
        fullWidth
        maxWidth="sm"
      >
        {confirmSubmission ? (
          <>
            <DialogContent sx={{ p: 4 }}>
              <ManualPaymentRecordDetails
                invoice={invoice}
                paymentRecords={formValues}
              />
            </DialogContent>
            <DialogActions
              sx={{ px: 4, pb: 4, justifyContent: 'space-between' }}
            >
              <Button onClick={closeModal}>{t(i18n)`Cancel`}</Button>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  disabled={isLoading}
                  onClick={() => setConfirmSubmission(false)}
                >
                  {t(i18n)`Edit record`}
                </Button>
                <Button
                  variant="contained"
                  disabled={isLoading}
                  onClick={createManualPaymentRecord}
                >
                  {t(i18n)`Confirm`}
                </Button>
              </Box>
            </DialogActions>
          </>
        ) : (
          <PaymentRecordForm
            invoice={invoice}
            initialValues={{
              amount: formValues.amount ? fromMinorUnits(formValues.amount) : 0,
              payment_date: formValues.payment_date,
              payment_time: formValues.payment_time,
            }}
            isLoading={isLoading}
            onCancel={closeModal}
            onSubmit={showConfirmation}
          />
        )}
      </Dialog>
    </>
  );
};
