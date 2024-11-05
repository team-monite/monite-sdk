import { useState } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useCreatePaymentRecord } from '@/core/queries/usePaymentRecords';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { ManualPaymentRecordDetails } from './ManualPaymentRecordDetails';
import {
  PaymentRecordForm,
  PaymentRecordFormValues,
} from './PaymentRecordForm';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  children: ({ openModal }: { openModal: () => void }) => React.ReactNode;
};

export type PaymentRecordDetails = {
  amount: number | null;
  payment_date: Date | null;
  payment_time: Date | null;
};

const DEFAULT_PAYMENT_RECORD: PaymentRecordDetails = {
  amount: 0,
  payment_date: new Date(),
  payment_time: new Date(),
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
  const createPaymentRecord = useCreatePaymentRecord();
  const { data: user, isLoading: isLoadingUser } = useEntityUserByAuthToken();

  const showConfirmation = (data: PaymentRecordFormValues) => {
    setFormValues({ ...data, amount: (data?.amount ?? 0) * 100 });
    setConfirmSubmission(true);
  };

  const resetForm = () => {
    setConfirmSubmission(false);
    setFormValues(DEFAULT_PAYMENT_RECORD);
  };

  const createManualPaymentRecord = () => {
    const dateTimeWithReplacedTime = new Date(
      formValues.payment_date ?? ''
    ).setHours(
      formValues.payment_time?.getHours() ?? 0,
      formValues.payment_time?.getMinutes() ?? 0
    );

    const paid_at = new Date(dateTimeWithReplacedTime);

    createPaymentRecord.mutate(
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
      },
      {
        onSuccess: () => {
          api.receivables.getReceivablesId.invalidateQueries(
            {
              parameters: { path: { receivable_id: invoice.id } },
            },
            queryClient
          );
          closeModal();
          resetForm();
        },
      }
    );
  };
  const isLoading = createPaymentRecord.isPending || isLoadingUser;

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
                  onClick={() => setConfirmSubmission(false)}
                >
                  {t(i18n)`Edit record`}
                </Button>
                <Button variant="contained" onClick={createManualPaymentRecord}>
                  {t(i18n)`Confirm`}
                </Button>
              </Box>
            </DialogActions>
          </>
        ) : (
          <PaymentRecordForm
            invoice={invoice}
            initialValues={{
              ...formValues,
              amount: formValues.amount ? formValues.amount / 100 : null,
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
