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
  Box,
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

  const { entityId } = useMoniteContext();

  const { data: settings, isLoading: isSettingsLoading } =
    api.entities.getEntitiesIdSettings.useQuery({
      path: { entity_id: entityId },
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

  const isReminderDisabledForEntity =
    !isSettingsLoading && settings?.reminder?.enabled === false;

  const isCounterpartWarningRequired =
    !hasValidReminderEmailLoading &&
    (!hasValidReminderEmail || !counterpart?.reminders_enabled);

  const shouldShowError =
    isReminderDisabledForEntity && isCounterpartWarningRequired && counterpart;

  return (
    <>
      {!isCounterpartLoading &&
        counterpart &&
        !counterpart?.reminders_enabled && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t(i18n)`Reminders are disabled for this Counterpart.`}
          </Alert>
        )}
      {!hasValidReminderEmailLoading &&
        counterpart &&
        !hasValidReminderEmail && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t(
              i18n
            )`No default email for selected Counterpart. Reminders will not be sent.`}
          </Alert>
        )}
      {shouldShowError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t(i18n)`Reminders are disabled for this Entity.`}
        </Alert>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
                return t(i18n)`Create a reminder preset`;
              return option.label || '—';
            }}
            sx={{
              flexWrap: 'nowrap',
              minWidth: '150px',
              flexBasis: '70%',
              marginLeft: '5px',
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
                        paddingLeft: '0',
                      }
                    : {
                        whiteSpace: 'unset',
                        paddingLeft: '0',
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
                return t(i18n)`Create a reminder preset`;
              return option.label || '—';
            }}
            sx={{ minWidth: '150px', flexBasis: '70%' }}
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
                        paddingLeft: '0',
                      }
                    : {
                        whiteSpace: 'unset',
                        paddingLeft: '0',
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
      </Box>
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
    <Grid
      container
      gridAutoFlow="row"
      spacing={1}
      p={1}
      pl={0}
      sx={{ flexBasis: '45%' }}
    >
      <Grid item sx={{ display: 'flex', alignItems: 'start' }}>
        {children}

        {onUpdate && (
          <Grid
            item
            xs={2}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              maxWidth: '33%',
              flexBasis: '33%',
              marginTop: '28px',
            }}
          >
            <Button
              variant="outlined"
              disabled={updateDisabled}
              onClick={(event) => {
                event.preventDefault();
                onUpdate();
              }}
              fullWidth
              size="large"
              sx={{ marginLeft: '.5em' }}
            >
              {t(i18n)`Edit`}
            </Button>
          </Grid>
        )}
      </Grid>
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
    <Box>
      <Typography variant="h3">{t(i18n)`Set reminders`}</Typography>
      <Stack
        spacing={1}
        direction="row"
        sx={{ gap: '24px', alignItems: 'flex-start', mt: 1 }}
        className={className}
      >
        <Card sx={{ width: '100%', boxShadow: 'none', borderRadius: 'unset' }}>
          <CardContent sx={{ padding: 0, mb: 2 }}>
            <ReminderSectionContent {...props} />
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
