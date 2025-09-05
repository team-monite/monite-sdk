import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { ReminderSelectLayout } from '@/components/receivables/components/ReminderSelectLayout';
import {
  useGetPaymentReminderById,
  useGetPaymentReminders,
} from '@/components/receivables/hooks';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { RHFAutocomplete } from '@/ui/RHF/RHFAutocomplete';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import { MenuItem } from '@mui/material';
import { useFormContext } from 'react-hook-form';

type Props = {
  handleCreate: (type: 'payment' | 'overdue') => void;
  onUpdatePaymentReminder: () => void;
  disabled: boolean;
};

export const ReminderBeforeDueDate = ({
  handleCreate,
  onUpdatePaymentReminder,
  disabled,
}: Props) => {
  const { data: paymentReminders } = useGetPaymentReminders();

  const { i18n } = useLingui();

  const { data: isUpdatePaymentReminderAllowed } = useIsActionAllowed({
    method: 'payment_reminder',
    action: 'update',
  });
  const { data: isCreatePaymentReminderAllowed } = useIsActionAllowed({
    method: 'payment_reminder',
    action: 'create',
  });

  const { control, watch } = useFormContext<CreateReceivablesFormProps>();
  const paymentReminderId = watch('payment_reminder_id');
  const { data: paymentReminder, isLoading: isPaymentReminderLoading } =
    useGetPaymentReminderById(paymentReminderId);

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

  return (
    <ReminderSelectLayout
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
        disabled={disabled}
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
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            key={option.value}
            value={option.value}
            onClick={(event) => {
              if (option.value === 'create') {
                event.stopPropagation();
                handleCreate('payment');
              } else {
                props?.onClick?.(event);
              }
            }}
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
            {option.value === 'create' && <AddIcon sx={{ marginRight: 1 }} />}
            {option.label}
          </MenuItem>
        )}
      />
    </ReminderSelectLayout>
  );
};
