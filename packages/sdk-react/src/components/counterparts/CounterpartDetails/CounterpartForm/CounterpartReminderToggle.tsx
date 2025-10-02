import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Paper, Switch, Typography } from '@mui/material';
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form';

export const CounterpartReminderToggle = <T extends FieldValues>(
  props: UseControllerProps<T>
) => {
  const { i18n } = useLingui();
  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      <Box sx={{ maxWidth: '70%' }}>
        <Typography variant="subtitle2" color="textPrimary">
          {t(i18n)`Enable email reminders`}
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          {t(
            i18n
          )`Payment reminders will be sent automatically to this counterpart.`}
        </Typography>
      </Box>
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
          <Switch
            {...field}
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            color="primary"
            aria-label={t(i18n)`Enable email reminders`}
          />
        )}
      />
    </Paper>
  );
};
