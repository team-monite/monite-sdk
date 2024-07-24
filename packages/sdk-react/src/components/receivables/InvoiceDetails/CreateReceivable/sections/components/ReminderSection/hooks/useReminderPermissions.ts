import { useIsActionAllowed } from '@/core/queries/usePermissions';

export const useReminderPermissions = () => {
  const {
    data: isReadPaymentReminderAllowed,
    isLoading: isReadPaymentReminderAllowedLoading,
  } = useIsActionAllowed({ method: 'payment_reminder', action: 'read' });
  const {
    data: isReadOverdueReminderAllowed,
    isLoading: isReadOverdueReminderAllowedLoading,
  } = useIsActionAllowed({ method: 'overdue_reminder', action: 'read' });
  const {
    data: isCreatePaymentReminderAllowed,
    isLoading: isCreatePaymentReminderAllowedLoading,
  } = useIsActionAllowed({ method: 'payment_reminder', action: 'create' });
  const {
    data: isCreateOverdueReminderAllowed,
    isLoading: isCreateOverdueReminderAllowedLoading,
  } = useIsActionAllowed({ method: 'overdue_reminder', action: 'create' });

  return {
    isReadPaymentReminderAllowed,
    isReadPaymentReminderAllowedLoading,
    isReadOverdueReminderAllowed,
    isReadOverdueReminderAllowedLoading,
    isCreatePaymentReminderAllowed,
    isCreatePaymentReminderAllowedLoading,
    isCreateOverdueReminderAllowed,
    isCreateOverdueReminderAllowedLoading,
  };
};
