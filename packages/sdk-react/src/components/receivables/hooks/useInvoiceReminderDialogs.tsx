import { useCallback, useState } from 'react';

export const useInvoiceReminderDialogs = ({
  getValues,
}: {
  getValues: (
    field: 'payment_reminder_id' | 'overdue_reminder_id'
  ) => string | undefined;
}) => {
  const [createReminderDialog, setCreateReminderDialog] = useState<
    | {
        open: boolean;
        reminderType: 'payment' | 'overdue';
      }
    | {
        open: boolean;
        reminderType?: never;
      }
  >({ open: false });

  const [editReminderDialog, setEditReminderDialog] = useState<
    | {
        open: boolean;
        reminderType: 'payment' | 'overdue';
        reminderId: string;
      }
    | {
        open: boolean;
        reminderType?: never;
        reminderId?: never;
      }
  >({ open: false });

  const onCreateReminder = useCallback((type: 'payment' | 'overdue') => {
    setCreateReminderDialog({
      open: true,
      reminderType: type,
    });
  }, []);

  const onEditOverdueReminder = useCallback(() => {
    const reminderId = getValues('overdue_reminder_id');

    setEditReminderDialog((prev) =>
      reminderId
        ? {
            reminderId,
            open: true,
            reminderType: 'overdue',
          }
        : { ...prev, open: false }
    );
  }, [getValues]);

  const onEditPaymentReminder = useCallback(() => {
    const reminderId = getValues('payment_reminder_id');

    setEditReminderDialog((prev) =>
      reminderId
        ? {
            reminderId,
            open: true,
            reminderType: 'payment',
          }
        : { ...prev, open: false }
    );
  }, [getValues]);

  return {
    createReminderDialog,
    editReminderDialog,
    closeCreateReminderDialog: useCallback(
      () => setCreateReminderDialog((prev) => ({ ...prev, open: false })),
      []
    ),
    closeUpdateReminderDialog: useCallback(
      () => setEditReminderDialog((prev) => ({ ...prev, open: false })),
      []
    ),
    onCreateReminder,
    onEditOverdueReminder,
    onEditPaymentReminder,
  };
};
