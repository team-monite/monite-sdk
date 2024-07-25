import React from 'react';
import { Control } from 'react-hook-form';

import { components } from '@/api';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, InputLabel, Stack, Typography } from '@mui/material';

interface ReminderFormProps {
  control: Control<components['schemas']['PaymentReminder']>;
  termKey: 'term_1_reminder' | 'term_2_reminder' | 'term_final_reminder';
  onDelete: () => void;
}

const mapTermKeyToName = (i18n: I18n) => ({
  term_1_reminder: t(i18n)`Discount date 1`,
  term_2_reminder: t(i18n)`Discount date 2`,
  term_final_reminder: t(i18n)`Due date`,
});

export const ReminderForm = ({
  control,
  termKey,
  onDelete,
}: ReminderFormProps) => {
  const { i18n } = useLingui();

  return (
    <Stack spacing={2} mt={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle2">
          {mapTermKeyToName(i18n)[termKey]}
        </Typography>
        <Button
          aria-label="delete"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={onDelete}
          // disabled={}
        >
          {t(i18n)`Delete`}
        </Button>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <InputLabel htmlFor={`${termKey}.days_before`}>
          <Typography>{t(i18n)`Remind`}</Typography>
        </InputLabel>
        <RHFTextField
          name={`${termKey}.days_before`}
          // todo::add min max logic on input (???) inputProps.inputProps.min={1} seem not working
          type="number"
          control={control}
          size="small"
          sx={{ width: 60 }}
        />
        <Typography variant="body1" color="text.secondary">{t(
          i18n
        )`days before`}</Typography>
      </Box>
      <Box>
        <RHFTextField
          label={t(i18n)`Subject`}
          name={`${termKey}.subject`}
          control={control}
          fullWidth
          required
        />
      </Box>
      <Box>
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
