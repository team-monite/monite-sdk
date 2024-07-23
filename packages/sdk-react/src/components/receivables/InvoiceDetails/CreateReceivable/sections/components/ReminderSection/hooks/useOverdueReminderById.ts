import { useMoniteContext } from '@/core/context/MoniteContext';

export const useOverdueReminderById = (id: string | undefined) => {
  const { api } = useMoniteContext();

  return api.overdueReminders.getOverdueRemindersId.useQuery(
    {
      path: { overdue_reminder_id: id ?? '' },
    },
    {
      enabled: !!id,
    }
  );
};
