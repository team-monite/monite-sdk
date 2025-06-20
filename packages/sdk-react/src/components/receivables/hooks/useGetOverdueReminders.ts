import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetOverdueReminders = () => {
  const { api } = useMoniteContext();

  return api.overdueReminders.getOverdueReminders.useQuery(undefined, {
    select: (data) =>
      data.data.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
  });
};
