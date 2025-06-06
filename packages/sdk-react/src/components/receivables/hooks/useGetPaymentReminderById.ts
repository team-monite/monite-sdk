import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetPaymentReminderById = (id?: string | null) => {
  const { api } = useMoniteContext();

  return api.paymentReminders.getPaymentRemindersId.useQuery(
    { path: { payment_reminder_id: id ?? '' } },
    { enabled: !!id }
  );
};
