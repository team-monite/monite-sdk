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

import { toMinorUnits } from '@/core/utils/currency';

import { ManualPaymentRecordDetails } from './ManualPaymentRecordDetails';
import {
  PaymentRecordForm,
} from './PaymentRecordForm';
import { ManualPaymentRecordFormValues } from '../validation';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  children: ({ openModal }: { openModal: () => void }) => React.ReactNode;
};

export type PaymentRecordDetails = {
  amount: number | null;
  payment_date: Date | null;
  payment_time: Date | null;
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
  const [formValues, setFormValues] = useState<ManualPaymentRecordFormValues>(
    DEFAULT_PAYMENT_RECORD
  );

  const { i18n } = useLingui();
  const { root } = useRootElements();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const { api, queryClient } = useMoniteContext();
  const { mutate: createPaymentRecord, isPending: isCreatingPaymentRecord } = useCreatePaymentRecord();
  const { data: user, isLoading: isLoadingUser } = useEntityUserByAuthToken();

  const showConfirmation = (data: ManualPaymentRecordFormValues) => {
    setFormValues({ 
      ...data, 
      amount: toMinorUnits(data?.amount ?? 0)
    });
    setConfirmSubmission(true);
  };

  const resetForm = () => {
    setConfirmSubmission(false);
    setFormValues(DEFAULT_PAYMENT_RECORD);
  };

  const createManualPaymentRecord = () => {
    const dateTimeWithReplacedTime = new Date(
      formValues.payment_date
    ).setHours(
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
                <Button variant="contained" disabled={isLoading} onClick={createManualPaymentRecord}>
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
              amount: formValues.amount ? formValues.amount / 100 : 0,
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
