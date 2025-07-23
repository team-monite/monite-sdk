import { CreateReceivablesFormProps } from '@/components/receivables/InvoiceDetails/CreateReceivable/validation';
import { ReminderSelectLayout } from '@/components/receivables/components/ReminderSelectLayout';
import {
  useGetOverdueReminderById,
  useGetOverdueReminders,
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
  onUpdateOverdueReminder: () => void;
  disabled: boolean;
};

export const ReminderOverdue = ({
  handleCreate,
  onUpdateOverdueReminder,
  disabled,
}: Props) => {
  const { data: overdueReminders } = useGetOverdueReminders();

  const { i18n } = useLingui();

  const { data: isUpdateOverdueReminderAllowed } = useIsActionAllowed({
    method: 'overdue_reminder',
    action: 'update',
  });

  const { data: isCreateOverdueReminderAllowed } = useIsActionAllowed({
    method: 'overdue_reminder',
    action: 'create',
  });

  const { control, watch } = useFormContext<CreateReceivablesFormProps>();
  const counterpartId = watch('counterpart_id');
  const overdueReminderId = watch('overdue_reminder_id');
  const { data: overdueReminder, isLoading: isOverdueReminderLoading } =
    useGetOverdueReminderById(overdueReminderId);

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
    <ReminderSelectLayout
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
        disabled={disabled || !counterpartId}
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
        renderOption={(props, option) => (
          <MenuItem
            {...props}
            key={option.value}
            value={option.value}
            onClick={(event) => {
              if (option.value === 'create') {
                event.stopPropagation();
                handleCreate('overdue');
              } else {
                props?.onClick?.(event);
              }
            }}
            disabled={!isCreateOverdueReminderAllowed}
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
