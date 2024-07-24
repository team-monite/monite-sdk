import { Dialog } from '@/components';
import { MoniteDialogProps } from '@/components/Dialog/DialogProps.types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';

import { CreateBeforeDueDateReminder } from './CreateReceivable/sections/components/CreateReminder/CreateBeforeDueDateReminder';
import { CreateOverdueReminder } from './CreateReceivable/sections/components/CreateReminder/CreateOverdueReminder';

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
        <CreateBeforeDueDateReminder
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
        <CreateOverdueReminder
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
