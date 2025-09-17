import {
  manualPaymentRecordValidationSchema,
  ManualPaymentRecordFormValues,
} from '../validation';
import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { safeZodResolver } from '@/core/utils/safeZodResolver';
import { RHFDatePicker } from '@/ui/RHF/RHFDatePicker';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { RHFTimePicker } from '@/ui/RHF/RHFTimePicker';
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
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  initialValues?: ManualPaymentRecordFormValues;
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (data: ManualPaymentRecordFormValues) => void;
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
    useForm<ManualPaymentRecordFormValues>({
      resolver: safeZodResolver<ManualPaymentRecordFormValues>(
        manualPaymentRecordValidationSchema(i18n, invoice.amount_due)
      ),
      defaultValues: useMemo(
        () =>
          initialValues ?? {
            amount: 0,
            payment_date: new Date(),
            payment_time: new Date(),
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
                type="number"
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
