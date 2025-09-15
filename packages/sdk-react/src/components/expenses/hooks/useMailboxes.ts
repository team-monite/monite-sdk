import { useMoniteContext } from '@/core/context/MoniteContext';

export const useMailboxes = () => {
  const { api } = useMoniteContext();

  const { data, isLoading, error } = api.mailboxes.getMailboxes.useQuery();

  return {
    data,
    isLoading,
    error,
  };
};
