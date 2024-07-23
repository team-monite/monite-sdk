import { useMoniteContext } from '@/core/context/MoniteContext';

export const usePaymentReminderById = (id: string | undefined) => {
  const { api } = useMoniteContext();

  return api.paymentReminders.getPaymentRemindersId.useQuery(
    {
      path: { payment_reminder_id: id ?? '' },
    },
    {
      enabled: !!id,
    }
  );
};
