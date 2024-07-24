import React from 'react';

import { Dialog } from '@/components';
import { MoniteDialogProps } from '@/components/Dialog/DialogProps.types';
import { CreateBeforeDueDateReminder } from '@/components/receivables/InvoiceDetails/CreateReceivable/sections/components/CreateBeforeDueDateReminder/CreateBeforeDueDateReminder';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert } from '@mui/material';

interface ReminderDetailsDialog extends MoniteDialogProps {
  reminderId: string;
  reminderType: 'payment' | 'overdue' | undefined;
}

export const EditInvoiceReminderDialog = ({
  reminderType,
  open,
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
      <CreateBeforeDueDateReminder />
    </Dialog>
  );
};
