import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetMailboxes = (enabled: boolean = true) => {
  const { api } = useMoniteContext();

  const { data, isLoading, error } = api.mailboxes.getMailboxes.useQuery(
    {},
    {
      enabled: enabled,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
};
