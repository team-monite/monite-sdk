import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetOverdueReminderById = (id?: string | null) => {
  const { api } = useMoniteContext();

  return api.overdueReminders.getOverdueRemindersId.useQuery(
    { path: { overdue_reminder_id: id ?? '' } },
    { enabled: !!id }
  );
};
