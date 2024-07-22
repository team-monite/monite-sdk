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
  Card,
  CardContent,
  Grid,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';

import type { SectionGeneralProps } from '../../Section.types';
import { SelectFieldWithEdit } from './SelectFieldWithEdit';
import { useReminderPermissions } from './useReminderPermissions';

export const ReminderSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<CreateReceivablesFormProps>();

  const { root } = useRootElements();
  const { api } = useMoniteContext();

  const {
    isReadPaymentReminderAllowedLoading,
    isReadOverdueReminderAllowedLoading,
  } = useReminderPermissions();

  const { data: paymentReminders, isLoading: isPaymentRemindersLoading } =
    api.paymentReminders.getPaymentReminders.useQuery({});
  const { data: overdueReminders, isLoading: isOverdueRemindersLoading } =
    api.overdueReminders.getOverdueReminders.useQuery({});

  const handleSelectChange =
    (field: ControllerRenderProps<FieldValues, string>) =>
    (event: SelectChangeEvent<string | number>) => {
      const value = event.target.value;
      if (value === 'create') {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        alert('You have selected Create a reminder preset');
      } else {
        field.onChange(value);
      }
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

    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="payment_terms_id"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectFieldWithEdit
                field={field}
                error={error}
                label={t(i18n)`Before due date`}
                options={paymentReminders?.data || []}
                noOptionsText={t(i18n)`No payment reminders available`}
                disabled={disabled}
                root={root as HTMLElement}
                handleSelectChange={handleSelectChange}
                control={control}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name={'overdue_reminder_id' as keyof CreateReceivablesFormProps}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <SelectFieldWithEdit
                field={field}
                error={error}
                label={t(i18n)`Overdue reminders`}
                options={overdueReminders?.data || []}
                noOptionsText={t(i18n)`No overdue reminders available`}
                disabled={disabled}
                root={root as HTMLElement}
                handleSelectChange={handleSelectChange}
                control={control}
              />
            )}
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
