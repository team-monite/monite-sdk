import { Dialog } from '@/components';
import { MoniteDialogProps } from '@/components/Dialog/DialogProps.types';
import { CreateBeforeDueDateReminder } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CreateBeforeDueDateReminder/CreateBeforeDueDateReminder';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';

interface ReminderDetailsDialog extends MoniteDialogProps {
  /** Invoice Reminder type */
  reminderType: 'payment' | 'overdue' | undefined;
  /** Callback that is called when the reminder is created */
  onCreate(props: {
    reminderId: string;
    reminderType: 'payment' | 'overdue';
  }): void;
}

export const CreateInvoiceReminderDialog = ({
  reminderType,
  open,
  onCreate,
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
      <CreateBeforeDueDateReminder
        onCreate={(reminderId) => {
          if (!reminderType) throw new Error('Reminder type is not provided');

          onCreate({
            reminderId,
            reminderType,
          });
        }}
      />
    </Dialog>
  );
};
