import { useMoniteContext } from '@/core/context/MoniteContext';

export const useMe = () => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersMe.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};
