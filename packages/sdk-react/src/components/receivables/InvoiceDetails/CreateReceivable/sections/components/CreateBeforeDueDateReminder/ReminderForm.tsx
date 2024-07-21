import React from 'react';
import { Control } from 'react-hook-form';

import { RHFTextField } from '@/components/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Stack, Typography } from '@mui/material';

import { CreateBeforeDueDateReminderFormFields } from './types';

interface ReminderFormProps {
  control: Control<CreateBeforeDueDateReminderFormFields>;
  termKey: 'term_1_reminder' | 'term_2_reminder' | 'term_final_reminder';
}

export const ReminderForm = ({ control, termKey }: ReminderFormProps) => {
  const { i18n } = useLingui();

  return (
    <Stack spacing={2} mt={2}>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography>{t(i18n)`Remind`}</Typography>
        <RHFTextField
          name={`${termKey}.days_before`}
          type="number"
          size="small"
          sx={{ width: 60 }}
        />
        <Typography>{t(i18n)`days before`}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" mb={1}>
          {t(i18n)`Subject`}
        </Typography>
        <RHFTextField
          label={t(i18n)`Subject`}
          name={`${termKey}.subject`}
          control={control}
          fullWidth
          required
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" mb={1}>
          {t(i18n)`Body`}
        </Typography>
        <RHFTextField
          label={t(i18n)`Body`}
          name={`${termKey}.body`}
          control={control}
          fullWidth
          required
          multiline
          rows={5}
        />
      </Box>
    </Stack>
  );
};
