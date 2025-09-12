import { PurchaseOrderFormData } from '../schemas';
import { PURCHASE_ORDER_CONSTANTS } from '../constants';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, TextField, Typography } from '@mui/material';
import { addDays } from 'date-fns';
import { useFormContext, Controller } from 'react-hook-form';

export const PurchaseOrderDetailsSection = () => {
  const { i18n } = useLingui();
  const { control, watch } = useFormContext<PurchaseOrderFormData>();

  const validForDays = watch('valid_for_days') || PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS;
  const expiryDate = addDays(new Date(), validForDays);

  return (
    <div className="mtw:w-full">
      <Typography sx={{ mb: 2 }} variant="subtitle1">
        {t(i18n)`Terms`}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ lineHeight: 2 }}
          >
            {t(i18n)`Expiry date`}
          </Typography>
          <Controller
            name="valid_for_days"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                inputProps={{ min: PURCHASE_ORDER_CONSTANTS.MIN_VALID_DAYS, max: PURCHASE_ORDER_CONSTANTS.MAX_VALID_DAYS }}
                fullWidth
                label={t(i18n)`Valid for (days)`}
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message ||
                  `${t(i18n)`Expires on`}: ${expiryDate.toLocaleDateString()}`
                }
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ lineHeight: 2 }}
          >
            {t(i18n)`Message`}
          </Typography>
          <Controller
            name="message"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                multiline
                rows={4}
                fullWidth
                placeholder={t(i18n)`Add a message for the vendor...`}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </Box>
    </div>
  );
};
