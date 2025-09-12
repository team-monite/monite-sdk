import { PURCHASE_ORDER_CONSTANTS } from '../constants';
import { CreatePurchaseOrderFormProps } from '../validation';
import { RHFDatePicker } from '@/ui/RHF/RHFDatePicker/RHFDatePicker';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, TextField, Typography } from '@mui/material';
import { addDays, differenceInDays } from 'date-fns';
import { useEffect, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface PurchaseOrderTermsSummaryProps {
  disabled?: boolean;
}

export const FullfillmentSummary = ({
  disabled,
}: PurchaseOrderTermsSummaryProps) => {
  const { i18n } = useLingui();
  const { control, watch, setValue } =
    useFormContext<CreatePurchaseOrderFormProps>();

  const validForDays =
    watch('valid_for_days') || PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS;
  const expiryDate = watch('expiry_date');

  useEffect(() => {
    if (!expiryDate) {
      const defaultExpiryDate = addDays(new Date(), validForDays);
      setValue('expiry_date', defaultExpiryDate);
    }
  }, [expiryDate, validForDays, setValue]);

  const handleExpiryDateChange = useCallback(
    (newDate: Date | null) => {
      if (newDate) {
        const today = new Date();
        const days = Math.max(
          PURCHASE_ORDER_CONSTANTS.MIN_VALID_DAYS,
          differenceInDays(newDate, today)
        );
        setValue('valid_for_days', days);
      }
    },
    [setValue]
  );

  const handleValidForDaysChange = useCallback(
    (days: number) => {
      const newExpiryDate = addDays(new Date(), days);
      setValue('expiry_date', newExpiryDate);
    },
    [setValue]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ lineHeight: 2 }}
        >
          {t(i18n)`Expiry date`}
        </Typography>
        <RHFDatePicker
          control={control}
          name="expiry_date"
          disabled={disabled}
          minDate={new Date()}
          onChange={(value) => {
            handleExpiryDateChange(value);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: 'outlined',
              helperText: `${t(i18n)`Valid for`}: ${validForDays} ${t(i18n)`day${validForDays === 1 ? '' : 's'}`}`,
              onBlur: (e) => {
                const input = e.target as HTMLInputElement;

                if (input.value) {
                  const date = new Date(input.value);
                  if (!isNaN(date.getTime())) {
                    handleExpiryDateChange(date);
                  }
                }
              },
            },
          }}
        />
      </Box>

      <Controller
        name="valid_for_days"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            type="number"
            inputProps={{
              min: PURCHASE_ORDER_CONSTANTS.MIN_VALID_DAYS,
              max: PURCHASE_ORDER_CONSTANTS.MAX_VALID_DAYS,
            }}
            label={t(i18n)`Valid for (days)`}
            error={false}
            onChange={(e) => {
              const days = Number(e.target.value);
              field.onChange(days);
              handleValidForDaysChange(days);
            }}
            disabled={disabled}
            sx={{ display: 'none' }}
          />
        )}
      />
    </Box>
  );
};
