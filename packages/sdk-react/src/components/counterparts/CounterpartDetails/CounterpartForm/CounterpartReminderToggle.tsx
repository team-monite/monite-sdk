import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Switch, Typography } from '@mui/material';

export const CounterpartReminderToggle = <T extends FieldValues>(
  props: UseControllerProps<T>
) => {
  const { i18n } = useLingui();

  return (
    <Box display="flex" alignItems="start" justifyContent="space-between">
      <Box>
        <Typography variant="body2" color=" rgba(0, 0, 0, 0.84)">
          {t(i18n)`Enable email reminders`}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ maxWidth: '70%' }}
        >
          {t(
            i18n
          )`Disabling reminders prevents sending any payment reminders to this counterpart.`}
        </Typography>
      </Box>
      <Controller
        {...props}
        render={({ field }) => (
          <Switch
            checked={field.value}
            onChange={(event) => field.onChange(event.target.checked)}
            color="primary"
            aria-label={t(i18n)`Enable email reminders`}
          />
        )}
      />
    </Box>
  );
};
