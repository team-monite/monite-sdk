import { Dialog } from '@/components';
import { MoniteDialogProps } from '@/components/Dialog/DialogProps.types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';

import { BeforeDueDateReminderForm } from './CreateReceivable/sections/components/ReminderForm/BeforeDueDateReminderForm';
import { OverdueReminderForm } from './CreateReceivable/sections/components/ReminderForm/OverdueReminderForm';

interface ReminderDetailsDialog extends MoniteDialogProps {
  reminderId: string;
  reminderType: 'payment' | 'overdue' | undefined;
  onUpdate?(props: {
    reminderId: string;
    reminderType: 'payment' | 'overdue';
  }): void;
  onClose(): void;
}

export const EditInvoiceReminderDialog = ({
  reminderType,
  open,
  reminderId,
  onUpdate,
  onClose,
  ...restProps
}: ReminderDetailsDialog) => {
  const { i18n } = useLingui();

  return (
    <Dialog alignDialog="right" open={open} onClose={onClose} {...restProps}>
      {open && !reminderType && (
        <Alert severity="error">
          {t(i18n)`Invoice Reminder type is not provided`}
        </Alert>
      )}
      {reminderType === 'payment' && (
        <BeforeDueDateReminderForm
          reminderId={reminderId}
          onUpdate={(id) => {
            onClose();
            onUpdate?.({
              reminderId: id,
              reminderType,
            });
          }}
          onClose={onClose}
        />
      )}
      {reminderType === 'overdue' && (
        <OverdueReminderForm
          reminderId={reminderId}
          onUpdate={(id) => {
            onClose();
            onUpdate?.({
              reminderId: id,
              reminderType,
            });
          }}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};
