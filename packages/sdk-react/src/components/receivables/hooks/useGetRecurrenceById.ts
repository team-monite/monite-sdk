import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetRecurrenceById = (id?: string | null) => {
  const { api } = useMoniteContext();

  return api.recurrences.getRecurrencesId.useQuery(
    { path: { recurrence_id: id ?? '' } },
    { enabled: !!id }
  );
};
