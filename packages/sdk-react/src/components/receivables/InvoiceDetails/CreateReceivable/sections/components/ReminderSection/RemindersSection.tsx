import { useEffect, useState } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';

import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Grid,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';

import type { SectionGeneralProps } from '../../Section.types';
import { useReminderPermissions } from './hooks/useReminderPermissions';
import { useValidateCounterpart } from './hooks/useValidateCounterpart';
import { SelectFieldWithEdit } from './SelectFieldWithEdit';

const usePaymentReminderById = (id: string | undefined) => {
  const { api } = useMoniteContext();

  return api.paymentReminders.getPaymentRemindersId.useQuery(
    {
      path: { payment_reminder_id: id ?? '' },
    },
    {
      enabled: !!id,
    }
  );
};

const useOverdueReminderById = (id: string | undefined) => {
  const { api } = useMoniteContext();

  return api.overdueReminders.getOverdueRemindersId.useQuery(
    {
      path: { overdue_reminder_id: id ?? '' },
    },
    {
      enabled: !!id,
    }
  );
};

export const ReminderSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { watch } = useFormContext<CreateReceivablesFormProps>();
  const { api } = useMoniteContext();

  const [payment_reminder_id, overdue_reminder_id] = [
    watch('payment_reminder_id'),
    watch('overdue_reminder_id'),
  ];

  useEffect(() => {
    console.log({ payment_reminder_id, overdue_reminder_id });
  }, [payment_reminder_id, overdue_reminder_id]);

  const {
    isReadPaymentReminderAllowedLoading,
    isReadOverdueReminderAllowedLoading,
  } = useReminderPermissions();

  const [
    selectedPaymentIDReminderDetails,
    setSelectedPaymentIDReminderDetails,
  ] = useState<string | undefined>(undefined);

  const [
    selectedOverdueIDReminderDetails,
    setSelectedOverdueIDReminderDetails,
  ] = useState<string | undefined>(undefined);

  const { isEmailValid, areRemindersEnabled } = useValidateCounterpart();

  const { data: paymentReminders, isLoading: isPaymentRemindersLoading } =
    api.paymentReminders.getPaymentReminders.useQuery({});
  const { data: overdueReminders, isLoading: isOverdueRemindersLoading } =
    api.overdueReminders.getOverdueReminders.useQuery({});

  const { data: paymentIDReminder } = usePaymentReminderById(
    selectedPaymentIDReminderDetails
  );
  const { data: overdueIDReminder } = useOverdueReminderById(
    selectedOverdueIDReminderDetails
  );

  const handleSelectChangeAsync = async (
    field: ControllerRenderProps<FieldValues, string>,
    type: 'payment' | 'overdue',
    value: string | number
  ) => {
    field.onChange(value);

    if (value === 'create') {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      alert('You have selected Create a reminder preset');
      field.onChange('');
      return;
    }

    try {
      if (type === 'payment') {
        setSelectedPaymentIDReminderDetails(value as string);
      } else if (type === 'overdue') {
        setSelectedOverdueIDReminderDetails(value as string);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectChange =
    (
      field: ControllerRenderProps<FieldValues, string>,
      type: 'payment' | 'overdue'
    ) =>
    async (event: SelectChangeEvent<string | number>) => {
      await handleSelectChangeAsync(field, type, event.target.value);
    };

  const renderRemindersSection = () => {
    if (
      isReadPaymentReminderAllowedLoading ||
      isReadOverdueReminderAllowedLoading ||
      isPaymentRemindersLoading ||
      isOverdueRemindersLoading
    ) {
      return <Typography>{t(i18n)`Loading...`}</Typography>;
    }

    if (!areRemindersEnabled) {
      return (
        <Alert severity="warning">
          {t(i18n)`Reminders are disabled for this counterpart.`}
        </Alert>
      );
    }

    return (
      <>
        {!isEmailValid && (
          <Alert severity="warning">
            {t(
              i18n
            )`No default email for selected Counterpart. Reminders will not be sent.`}
          </Alert>
        )}
        <Box mt={2} />
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <SelectFieldWithEdit
              name="payment_reminder_id"
              label={t(i18n)`Before due date`}
              options={paymentReminders?.data || []}
              noOptionsText={t(i18n)`No payment reminders available`}
              disabled={disabled}
              details={paymentIDReminder}
              createOptionLabel={t(i18n)`Create a reminder preset`}
              /*handleSelectChange={(event) =>
                    handleSelectChange(event, 'payment')
                  }*/
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectFieldWithEdit
              name="overdue_reminder_id"
              label={t(i18n)`Overdue reminders`}
              options={overdueReminders?.data || []}
              noOptionsText={t(i18n)`No overdue reminders available`}
              disabled={disabled}
              details={overdueIDReminder}
              createOptionLabel={t(i18n)`Create a reminder preset`}
              /*handleSelectChange={(event) =>
                    handleSelectChange(event, 'overdue')
                  }*/
            />
          </Grid>
        </Grid>
      </>
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
