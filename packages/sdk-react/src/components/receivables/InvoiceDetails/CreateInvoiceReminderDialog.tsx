import { Dialog } from '@/components';
import { MoniteDialogProps } from '@/components/Dialog/DialogProps.types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';

import { BeforeDueDateReminderForm } from './CreateReceivable/sections/components/ReminderForm/BeforeDueDateReminderForm';
import { OverdueReminderForm } from './CreateReceivable/sections/components/ReminderForm/OverdueReminderForm';

interface ReminderDetailsDialog extends MoniteDialogProps {
  /** Invoice Reminder type */
  reminderType: 'payment' | 'overdue' | undefined;
  /** Callback that is called when the reminder is created */
  onCreate?(props: {
    reminderId: string;
    reminderType: 'payment' | 'overdue';
  }): void;
  onClose(): void;
}

export const CreateInvoiceReminderDialog = ({
  reminderType,
  open,
  onCreate,
  onClose,
  ...restProps
}: ReminderDetailsDialog) => {
  const { i18n } = useLingui();

  return (
    <Dialog alignDialog="right" open={open} {...restProps}>
      {open && !reminderType && (
        <Alert severity="error">
          {t(i18n)`Invoice Reminder type is not provided`}
        </Alert>
      )}
      {reminderType === 'payment' && (
        <BeforeDueDateReminderForm
          onClose={onClose}
          onCreate={(reminderId) => {
            if (!reminderType) throw new Error('Reminder type is not provided');
            onClose();
            onCreate?.({
              reminderId,
              reminderType,
            });
          }}
        />
      )}
      {reminderType === 'overdue' && (
        <OverdueReminderForm
          onClose={onClose}
          onCreate={(reminderId) => {
            if (!reminderType) throw new Error('Reminder type is not provided');
            onClose();
            onCreate?.({
              reminderId,
              reminderType,
            });
          }}
        />
      )}
    </Dialog>
  );
};
