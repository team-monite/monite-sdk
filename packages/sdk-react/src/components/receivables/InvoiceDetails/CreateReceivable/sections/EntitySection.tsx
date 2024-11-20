import { Controller, useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, FormControl, TextField } from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

/** All available fields for current component */
const allFields = [
  'entity_vat_id_id',
  'tax_id',
  'fulfillment_date',
  'purchase_order',
] as const;

interface EntitySectionProps extends SectionGeneralProps {
  /**
   * Describes which fields should be hidden from the user
   *  (example: `purchaise_order` is not available for editing
   *   and we want to hide it. But for [CREATE] request it should be sent)
   */
  hidden?: ['purchase_order'];
}

export const EntitySection = ({ disabled, hidden }: EntitySectionProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const visibleFields = allFields.filter((field) =>
    hidden ? field !== 'purchase_order' : true
  );

  return (
    <Box>
      <Controller
        name="memo"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl
            variant="outlined"
            fullWidth
            required
            disabled={disabled}
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
              error={Boolean(error)}
            />
          </FormControl>
        )}
      />
      <Box sx={{ maxWidth: '406px', mt: 2 }}>
        {visibleFields.includes('purchase_order') && (
          <Controller
            name="purchase_order"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                variant="outlined"
                label={t(i18n)`Purchase order`}
                error={Boolean(error)}
                helperText={error?.message}
                disabled={disabled}
              />
            )}
          />
        )}
      </Box>
    </Box>
  );
};
