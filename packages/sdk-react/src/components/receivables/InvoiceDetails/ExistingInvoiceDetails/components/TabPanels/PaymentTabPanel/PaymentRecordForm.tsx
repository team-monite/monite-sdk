import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { components } from '@/api';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useCurrencies } from '@/core/hooks';
// import { RHFTimePicker } from '@/components/RHF/RHFTimePicker'; // Hidden for future iteration.
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
} from '@mui/material';

import { PaymentRecordDetails } from './RecordManualPaymentModal';
import { manualPaymentRecordValidationSchema } from './schemas/manualPaymentRecordValidationSchema';

export type PaymentRecordFormValues = Omit<PaymentRecordDetails, 'created_by'>;
type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  initialValues?: PaymentRecordFormValues;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: PaymentRecordFormValues) => void;
};

export const PaymentRecordForm: React.FC<Props> = ({
  invoice,
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  const { control, handleSubmit, reset } = useForm<PaymentRecordFormValues>({
    resolver: yupResolver(
      manualPaymentRecordValidationSchema(i18n, invoice.amount_due)
    ),
    defaultValues: useMemo(
      () =>
        initialValues ?? {
          amount: 0,
          // reference_number: '', // Hidden for future iteration.
          payment_date: null,
          // payment_time: null, // Hidden for future iteration.
        },
      [initialValues]
    ),
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ px: 4, pt: 4 }} variant="h3" id="dialog-title">{t(
          i18n
        )`Record payment`}</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <RHFTextField
                label={t(i18n)`Amount`}
                name="amount"
                control={control}
                fullWidth
                required
              />
              <FormHelperText>
                {t(i18n)`Enter full amount due of`}{' '}
                {formatCurrencyToDisplay(invoice.amount_due, invoice.currency)}
              </FormHelperText>
            </Grid>
            {/* Hidden for future iteration */}
            {/* <Grid item xs={6}>
              <RHFTextField
                label={t(i18n)`Reference number`}
                name="reference_number"
                control={control}
                fullWidth
                required
              />
              <FormHelperText>{t(
                i18n
              )`Or fill in the transaction ID instead`}</FormHelperText>
            </Grid> */}
            <Grid item xs={6}>
              <RHFDatePicker
                label={t(i18n)`Date`}
                name="payment_date"
                control={control}
              />
            </Grid>
            {/* Hidden for future iteration */}
            {/* <Grid item xs={6}>
              <RHFTimePicker
                label={t(i18n)`Time`}
                name="payment_time"
                control={control}
                required
                fullWidth
              />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4 }}>
          <Button autoFocus onClick={onCancel}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="contained"
            startIcon={
              isLoading ? <CircularProgress size={20} color="warning" /> : null
            }
            type="submit"
          >
            {t(i18n)`Save`}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
