import { ReactNode, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { ReminderDetails } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/ReminderSection/ReminderDetail';
import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { RHFAutocomplete } from '@/components/RHF/RHFAutocomplete';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCounterpartById } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import type { SectionGeneralProps } from '../../Section.types';

const usePaymentReminderById = (id: string | undefined | null) => {
  const { api } = useMoniteContext();
  return api.paymentReminders.getPaymentRemindersId.useQuery(
    { path: { payment_reminder_id: id ?? '' } },
    { enabled: !!id }
  );
};

const useOverdueReminderById = (id: string | undefined | null) => {
  const { api } = useMoniteContext();
  return api.overdueReminders.getOverdueRemindersId.useQuery(
    { path: { overdue_reminder_id: id ?? '' } },
    { enabled: !!id }
  );
};

const ReminderSectionContent = ({
  disabled,
  onUpdateOverdueReminder,
  onUpdatePaymentReminder,
  onCreateReminder,
}: ReminderSectionProps) => {
  const { api } = useMoniteContext();
  const { data: paymentReminders } =
    api.paymentReminders.getPaymentReminders.useQuery(undefined, {
      select: (data) =>
        data.data.map(({ id, name }) => ({
          value: id,
          label: name,
        })),
    });
  const { data: overdueReminders } =
    api.overdueReminders.getOverdueReminders.useQuery(undefined, {
      select: (data) =>
        data.data.map(({ id, name }) => ({
          value: id,
          label: name,
        })),
    });

  const { i18n } = useLingui();

  const { data: isUpdatePaymentReminderAllowed } = useIsActionAllowed({
    method: 'payment_reminder',
    action: 'update',
  });
  const { data: isUpdateOverdueReminderAllowed } = useIsActionAllowed({
    method: 'overdue_reminder',
    action: 'update',
  });
  const { data: isCreatePaymentReminderAllowed } = useIsActionAllowed({
    method: 'payment_reminder',
    action: 'create',
  });
  const { data: isCreateOverdueReminderAllowed } = useIsActionAllowed({
    method: 'overdue_reminder',
    action: 'create',
  });

  const { monite } = useMoniteContext();

  const { data: settings, isLoading: isSettingsLoading } =
    api.entities.getEntitiesIdSettings.useQuery({
      path: { entity_id: monite.entityId },
    });

  const { control, watch, resetField } =
    useFormContext<CreateReceivablesFormProps>();
  const counterpartId = watch('counterpart_id');
  const paymentReminderId = watch('payment_reminder_id');
  const overdueReminderId = watch('overdue_reminder_id');
  const { data: paymentReminder, isLoading: isPaymentReminderLoading } =
    usePaymentReminderById(paymentReminderId);
  const { data: overdueReminder, isLoading: isOverdueReminderLoading } =
    useOverdueReminderById(overdueReminderId);

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);

  const {
    data: hasCounterpartDefaultContactEmail,
    isLoading: isCounterpartDefaultContactEmailLoading,
  } = api.counterparts.getCounterpartsIdContacts.useQuery(
    {
      path: { counterpart_id: counterpartId ?? '' },
    },
    {
      enabled: Boolean(counterpart?.type === 'organization'),
      select: (data) =>
        Boolean(data.data.find((contact) => contact.is_default)?.email),
    }
  );

  const hasValidReminderEmail =
    counterpart && 'individual' in counterpart
      ? Boolean(counterpart.individual.email)
      : hasCounterpartDefaultContactEmail;

  const hasValidReminderEmailLoading =
    isCounterpartLoading || isCounterpartDefaultContactEmailLoading;

  useEffect(() => {
    if (hasValidReminderEmailLoading) return;
    if (hasValidReminderEmail && counterpart?.reminders_enabled) return;
    resetField('payment_reminder_id');
    resetField('overdue_reminder_id');
  }, [
    counterpart?.reminders_enabled,
    hasValidReminderEmail,
    hasValidReminderEmailLoading,
    resetField,
  ]);

  useEffect(() => {
    if (paymentReminderId === 'create') {
      onCreateReminder('payment');

      resetField('payment_reminder_id');
    }

    if (overdueReminderId === 'create') {
      onCreateReminder('overdue');

      resetField('overdue_reminder_id');
    }
  }, [paymentReminderId, overdueReminderId, onCreateReminder, resetField]);

  const paymentReminderOptions = paymentReminders?.some(
    ({ value }) => value === paymentReminder?.id
  )
    ? paymentReminders
    : [
        ...(paymentReminders ?? []),
        ...(paymentReminder
          ? [{ value: paymentReminder.id, label: paymentReminder.name }]
          : []),
      ];

  const overdueReminderOptions = overdueReminders?.some(
    ({ value }) => value === overdueReminder?.id
  )
    ? overdueReminders
    : [
        ...(overdueReminders ?? []),
        ...(overdueReminder
          ? [{ value: overdueReminder.id, label: overdueReminder.name }]
          : []),
      ];

  return (
    <>
      {!isCounterpartLoading && !counterpart?.reminders_enabled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t(i18n)`Reminders are disabled for this Counterpart.`}
        </Alert>
      )}
      {!hasValidReminderEmailLoading && !hasValidReminderEmail && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t(
            i18n
          )`No default email for selected Counterpart. Reminders will not be sent.`}
        </Alert>
      )}
      {!isSettingsLoading && settings?.reminder?.enabled === false && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t(i18n)`Reminders are disabled for this Entity.`}
        </Alert>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <SelectReminderLayout
            reminder={paymentReminder}
            isReminderLoading={isPaymentReminderLoading}
            updateDisabled={
              disabled || !isUpdatePaymentReminderAllowed || !paymentReminder
            }
            onUpdate={onUpdatePaymentReminder}
          >
            <RHFAutocomplete
              control={control}
              name="payment_reminder_id"
              label={t(i18n)`Before due date`}
              options={[
                { value: 'create', label: t(i18n)`Create a reminder preset` },
                ...paymentReminderOptions,
              ]}
              optionKey="value"
              labelKey="label"
              noOptionsText={t(i18n)`No payment reminders available`}
              disabled={
                disabled ||
                !counterpartId ||
                !hasValidReminderEmail ||
                !counterpart?.reminders_enabled
              }
              getOptionDisabled={(option) =>
                option.value === 'create'
                  ? Boolean(!isCreatePaymentReminderAllowed)
                  : false
              }
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;

                if (!option.value) return '';
                if (option.value === 'create')
                  return t(i18n)`Create a reminder preset` ?? '';
                return option.label || '—';
              }}
              renderOption={(props, option) => (
                <MenuItem
                  {...props}
                  key={option.value}
                  value={option.value}
                  disabled={!isCreatePaymentReminderAllowed}
                  sx={
                    option.value === 'create'
                      ? {
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          color: 'primary.main',
                          whiteSpace: 'unset',
                        }
                      : {
                          whiteSpace: 'unset',
                        }
                  }
                >
                  {option.value === 'create' && (
                    <AddIcon sx={{ marginRight: 1 }} />
                  )}
                  {option.label}
                </MenuItem>
              )}
            />
          </SelectReminderLayout>
        </Grid>
        <Grid item xs={12} sm={6}>
          <SelectReminderLayout
            reminder={overdueReminder}
            isReminderLoading={isOverdueReminderLoading}
            updateDisabled={
              disabled || !isUpdateOverdueReminderAllowed || !overdueReminder
            }
            onUpdate={onUpdateOverdueReminder}
          >
            <RHFAutocomplete
              control={control}
              name="overdue_reminder_id"
              label={t(i18n)`Overdue reminders`}
              options={[
                { value: 'create', label: t(i18n)`Create a reminder preset` },
                ...overdueReminderOptions,
              ]}
              optionKey="value"
              labelKey="label"
              noOptionsText={t(i18n)`No overdue reminders available`}
              disabled={
                disabled ||
                !counterpartId ||
                !hasValidReminderEmail ||
                !counterpart?.reminders_enabled
              }
              getOptionDisabled={(option) =>
                option.value === 'create'
                  ? Boolean(!isCreateOverdueReminderAllowed)
                  : false
              }
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;

                if (!option.value) return '';
                if (option.value === 'create')
                  return t(i18n)`Create a reminder preset` ?? '';
                return option.label || '—';
              }}
              renderOption={(props, option) => (
                <MenuItem
                  {...props}
                  key={option.value}
                  value={option.value}
                  disabled={!isCreatePaymentReminderAllowed}
                  sx={
                    option.value === 'create'
                      ? {
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          color: 'primary.main',
                          whiteSpace: 'unset',
                        }
                      : {
                          whiteSpace: 'unset',
                        }
                  }
                >
                  {option.value === 'create' && (
                    <AddIcon sx={{ marginRight: 1 }} />
                  )}
                  {option.label}
                </MenuItem>
              )}
            />
          </SelectReminderLayout>
        </Grid>
      </Grid>
    </>
  );
};

const SelectReminderLayout = ({
  children,
  reminder,
  isReminderLoading,
  updateDisabled,
  onUpdate,
}: {
  children: ReactNode;
  reminder:
    | components['schemas']['OverdueReminderResponse']
    | components['schemas']['PaymentReminderResponse']
    | undefined;
  isReminderLoading: boolean;
  updateDisabled: boolean;
  onUpdate?: () => void;
}) => {
  const { i18n } = useLingui();

  return (
    // Use bottom alignment to correctly align editors with buttons
    <Grid container alignItems="bottom" spacing={1}>
      <Grid item xs={onUpdate ? 10 : 12}>
        {children}
      </Grid>
      {onUpdate && (
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button
            variant="outlined"
            disabled={updateDisabled}
            onClick={(event) => {
              event.preventDefault();
              onUpdate();
            }}
            fullWidth
            size="large"
          >
            {t(i18n)`Edit`}
          </Button>
        </Grid>
      )}
      {(isReminderLoading || reminder) && (
        <Grid item xs={12}>
          {isReminderLoading ? (
            <Skeleton variant="text" width="60%" sx={{ m: 2 }} />
          ) : reminder ? (
            <ReminderDetails reminder={reminder} />
          ) : null}
        </Grid>
      )}
    </Grid>
  );
};

interface ReminderSectionProps extends SectionGeneralProps {
  onCreateReminder: (type: 'payment' | 'overdue') => void;
  onUpdatePaymentReminder: () => void;
  onUpdateOverdueReminder: () => void;
}

export const ReminderSection = (props: ReminderSectionProps) => {
  const { i18n } = useLingui();
  const className = 'Monite-CreateReceivable-ReminderSection';

  return (
    <Stack spacing={1} className={className}>
      <Typography variant="h3">{t(i18n)`Reminders`}</Typography>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <ReminderSectionContent {...props} />
        </CardContent>
      </Card>
    </Stack>
  );
};
