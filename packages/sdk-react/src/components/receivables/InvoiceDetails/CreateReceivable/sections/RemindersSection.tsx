import React, { useMemo } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldValues,
  useFormContext,
} from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';

import type { SectionGeneralProps } from './Section.types';

export const ReminderSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();
  const { api } = useMoniteContext();

  const {
    data: isReadPaymentReminderAllowed,
    isLoading: isReadPaymentReminderAllowedLoading,
  } = useIsActionAllowed({
    method: 'payment_reminder',
    action: 'read',
  });

  const {
    data: isReadOverdueReminderAllowed,
    isLoading: isReadOverdueReminderAllowedLoading,
  } = useIsActionAllowed({
    method: 'overdue_reminder',
    action: 'read',
  });

  const { data: paymentReminders, isLoading: isPaymentRemindersLoading } =
    api.paymentReminders.getPaymentReminders.useQuery({});
  const { data: overdueReminders, isLoading: isOverdueRemindersLoading } =
    api.overdueReminders.getOverdueReminders.useQuery({});

  const noOverdueReminders = useMemo(() => {
    return !overdueReminders?.data?.length && !isOverdueRemindersLoading;
  }, [isOverdueRemindersLoading, overdueReminders]);

  const noPaymentReminders = useMemo(() => {
    return !paymentReminders?.data?.length && !isPaymentRemindersLoading;
  }, [isPaymentRemindersLoading, paymentReminders]);

  const handleSelectChange =
    (field: ControllerRenderProps<FieldValues, string>) =>
    (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      if (value === 'create') {
        alert(t(i18n)`You have selected Create a reminder preset`);
      } else {
        field.onChange(value);
      }
    };

  const renderSelectField = (
    field: ControllerRenderProps<any, any>,
    error: FieldError | undefined,
    label: string,
    options: any[],
    noOptionsText: string
  ) => (
    <FormControl
      variant="outlined"
      fullWidth
      error={Boolean(error)}
      disabled={disabled}
    >
      <InputLabel htmlFor={field.name}>{t(i18n)`${label}`}</InputLabel>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={10}>
          <Select
            {...field}
            id={field.name}
            labelId={field.name}
            label={t(i18n)`${label}`}
            MenuProps={{ container: root }}
            onChange={handleSelectChange(field)}
            fullWidth
          >
            {options.length > 0 ? (
              options.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                {t(i18n)`${noOptionsText}`}
              </MenuItem>
            )}
            <MenuItem
              value="create"
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                color: 'primary.main',
              }}
            >
              <AddIcon sx={{ marginRight: 1 }} />
              {t(i18n)`Create a reminder preset`}
            </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="outlined"
            onClick={() => alert(`You have selected Edit`)}
            fullWidth
          >
            {t(i18n)`Edit`}
          </Button>
        </Grid>
      </Grid>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );

  const renderRemindersSection = () => {
    if (
      isReadPaymentReminderAllowedLoading ||
      isReadOverdueReminderAllowedLoading
    ) {
      return <Typography>{t(i18n)`Loading...`}</Typography>;
    }

    if (!isReadPaymentReminderAllowed && !isReadOverdueReminderAllowed) {
      return (
        <Typography color="error">
          {t(i18n)`You do not have permissions to view reminders.`}
        </Typography>
      );
    }

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="payment_terms_id"
            control={control}
            render={({ field, fieldState: { error } }) =>
              renderSelectField(
                field,
                error,
                t(i18n)`Before due date`,
                paymentReminders?.data || [],
                t(i18n)`No payment reminders available`
              )
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="payment_terms_id"
            control={control}
            render={({ field, fieldState: { error } }) =>
              renderSelectField(
                field,
                error,
                t(i18n)`Overdue reminders`,
                overdueReminders?.data || [],
                t(i18n)`No overdue reminders available`
              )
            }
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t(i18n)`Reminders`}</Typography>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>{renderRemindersSection()}</CardContent>
      </Card>
    </Stack>
  );
};
