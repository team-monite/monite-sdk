import { useIsActionAllowed } from '@/core/queries/usePermissions';

type PermissionMethod = 'payment_reminder' | 'overdue_reminder';
type PermissionAction = 'read' | 'create';

interface PermissionData {
  data: boolean | undefined;
  isLoading: boolean;
}

const usePermission = (
  method: PermissionMethod,
  action: PermissionAction
): PermissionData => {
  const { data, isLoading } = useIsActionAllowed({ method, action });
  return { data, isLoading };
};

export const useReminderPermissions = () => {
  const readPaymentReminder = usePermission('payment_reminder', 'read');
  const readOverdueReminder = usePermission('overdue_reminder', 'read');
  const createPaymentReminder = usePermission('payment_reminder', 'create');
  const createOverdueReminder = usePermission('overdue_reminder', 'create');

  return {
    isReadPaymentReminderAllowed: readPaymentReminder.data,
    isReadPaymentReminderAllowedLoading: readPaymentReminder.isLoading,
    isReadOverdueReminderAllowed: readOverdueReminder.data,
    isReadOverdueReminderAllowedLoading: readOverdueReminder.isLoading,
    isCreatePaymentReminderAllowed: createPaymentReminder.data,
    isCreatePaymentReminderAllowedLoading: createPaymentReminder.isLoading,
    isCreateOverdueReminderAllowed: createOverdueReminder.data,
    isCreateOverdueReminderAllowedLoading: createOverdueReminder.isLoading,
  };
};
