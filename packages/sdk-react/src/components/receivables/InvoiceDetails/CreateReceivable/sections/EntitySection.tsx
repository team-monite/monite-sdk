import { Controller, useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, FormControl, TextField, Typography } from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

interface EntitySectionProps extends SectionGeneralProps {
  /**
   * Describes which fields should be hidden from the user
   *  (example: `purchaise_order` is not available for editing
   *   and we want to hide it. But for [CREATE] request it should be sent)
   */
  hidden?: ['purchase_order'];
  visibleFields?: {
    isPurchaseOrderShown?: boolean;
    isTermsAndConditionsShown?: boolean;
    isFooterShown?: boolean;
  };
}

export const EntitySection = ({
  disabled,
  visibleFields,
}: EntitySectionProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  return (
    <Box>
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ lineHeight: 2 }}
      >
        {t(i18n)`Memo`}
      </Typography>
      <Controller
        name="memo"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl
            variant="outlined"
            fullWidth
            required
            disabled={disabled}
            sx={{ mb: 2 }}
            error={Boolean(error)}
          >
            <TextField
              {...field}
              placeholder={t(
                i18n
              )`Dear client, as discussed, please find attached our invoice:`}
              multiline
              minRows={2}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  background: 'white',
                },
              }}
              error={Boolean(error)}
            />
          </FormControl>
        )}
      />

      {visibleFields?.isFooterShown && (
        <>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ lineHeight: 2 }}
          >
            {t(i18n)`Note to customer`}
          </Typography>
          <Controller
            name="footer"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="outlined"
                fullWidth
                disabled={disabled}
                sx={{ mb: 2 }}
                error={Boolean(error)}
              >
                <TextField
                  {...field}
                  placeholder={t(
                    i18n
                  )`Add a note to be displayed below the line items`}
                  multiline
                  minRows={2}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      background: 'white',
                    },
                  }}
                  error={Boolean(error)}
                />
              </FormControl>
            )}
          />
        </>
      )}

      {visibleFields?.isPurchaseOrderShown && (
        <>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ lineHeight: 2 }}
          >
            {t(i18n)`Purchase order`}
          </Typography>
          <Controller
            name="purchase_order"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="standard"
                fullWidth
                required
                disabled={disabled}
                sx={{ mb: 2 }}
                error={Boolean(error)}
              >
                <TextField
                  {...field}
                  placeholder={t(i18n)`Add number`}
                  fullWidth
                  error={Boolean(error)}
                />
              </FormControl>
            )}
          />
        </>
      )}
      {visibleFields?.isTermsAndConditionsShown && (
        <>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ lineHeight: 2 }}
          >
            {t(i18n)`Terms and conditions`}
          </Typography>
          <Controller
            name="terms_and_conditions"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl
                variant="standard"
                fullWidth
                required
                disabled={disabled}
                error={Boolean(error)}
              >
                <TextField
                  {...field}
                  placeholder={t(i18n)`Add text`}
                  multiline
                  minRows={2}
                  fullWidth
                  error={Boolean(error)}
                />
              </FormControl>
            )}
          />
        </>
      )}
    </Box>
  );
};
