import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { components } from '@/api';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { RHFTimePicker } from '@/components/RHF/RHFTimePicker';
import { useCurrencies } from '@/core/hooks';
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

export const PaymentRecordForm = ({
  invoice,
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}: Props) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay, getSymbolFromCurrency } = useCurrencies();

  const { control, handleSubmit, reset, setValue } =
    useForm<PaymentRecordFormValues>({
      resolver: yupResolver(
        manualPaymentRecordValidationSchema(i18n, invoice.amount_due)
      ),
      defaultValues: useMemo(
        () =>
          initialValues ?? {
            amount: null,
            payment_date: null,
            payment_time: null,
          },
        [initialValues]
      ),
    });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const currencySymbol = getSymbolFromCurrency(invoice.currency);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ px: 4, pt: 4 }} variant="h3" id="dialog-title">{t(
          i18n
        )`Record payment`}</DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <RHFTextField
                label={t(i18n)`Amount`}
                name="amount"
                placeholder="0"
                control={control}
                sx={{
                  '::after': {
                    content: `"${currencySymbol}"`,
                    position: 'absolute',
                    right: '16px',
                    bottom: 0,
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.28)',
                    pointerEvents: 'none',
                  },
                }}
                fullWidth
                required
              />
              <FormHelperText>
                {t(i18n)`Enter full amount due of`}{' '}
                <Button
                  variant="text"
                  sx={{ textDecoration: 'underline' }}
                  onClick={() => setValue('amount', invoice.amount_due / 100)}
                >
                  {formatCurrencyToDisplay(
                    invoice.amount_due,
                    invoice.currency
                  )}
                </Button>
              </FormHelperText>
            </Grid>
            <Grid item xs={6}>
              <RHFDatePicker
                label={t(i18n)`Date`}
                name="payment_date"
                control={control}
              />
            </Grid>
            <Grid item xs={6}>
              <RHFTimePicker
                label={t(i18n)`Time`}
                name="payment_time"
                control={control}
                sx={{
                  '::after': {
                    content: '"UTC"',
                    position: 'absolute',
                    right: '16px',
                    bottom: 0,
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    color: 'rgba(0,0,0,0.28)',
                    pointerEvents: 'none',
                  },
                }}
                fullWidth
                required
              />
            </Grid>
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
