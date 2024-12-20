import { Controller, useFormContext } from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, FormControl, TextField } from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

interface EntitySectionProps extends SectionGeneralProps {
  /**
   * Describes which fields should be hidden from the user
   *  (example: `purchaise_order` is not available for editing
   *   and we want to hide it. But for [CREATE] request it should be sent)
   */
  hidden?: ['purchase_order'];
}

export const EntitySection = ({ disabled }: EntitySectionProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  return (
    <Box>
      <Controller
        name="memo"
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
    </Box>
  );
};
