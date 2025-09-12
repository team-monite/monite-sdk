import type { SectionGeneralProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/types';
import { CreatePurchaseOrderFormProps } from '../validation';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, FormControl, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

interface EntitySectionProps extends SectionGeneralProps {
  visibleFields?: {
    isMessageShown?: boolean;
    isFooterShown?: boolean;
  };
}

export const EntitySection = ({
  disabled,
  visibleFields,
}: EntitySectionProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreatePurchaseOrderFormProps>();

  return (
    <Box>
      {visibleFields?.isMessageShown && (
        <>
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
                  placeholder={t(i18n)`Add a message for the vendor...`}
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

      {visibleFields?.isFooterShown && (
        <>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ lineHeight: 2 }}
          >
            {t(i18n)`Note to vendor`}
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
    </Box>
  );
};
