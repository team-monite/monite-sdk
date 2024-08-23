import React from 'react';
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, FormControlLabel, Switch, Typography } from '@mui/material';

export const CounterpartReminderToggle = <T extends FieldValues>(
  props: UseControllerProps<T>
) => {
  const { i18n } = useLingui();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      padding={2}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography variant="subtitle1">
          {t(i18n)`Enable email reminders`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t(
            i18n
          )`You can change this setting if you wish to forbid sending any payment reminders to this counterpart.`}
        </Typography>
      </Box>
      <Controller
        {...props}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                color="primary"
              />
            }
            label=""
            labelPlacement="start"
          />
        )}
      />
    </Box>
  );
};
