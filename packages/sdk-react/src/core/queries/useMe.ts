import { useMoniteContext } from '@/core/context/MoniteContext';

export const useMyEntity = () => {
  const { api } = useMoniteContext();

  const queryProps = api.entityUsers.getEntityUsersMyEntity.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const isUSEntity = Boolean(
    queryProps.data?.address && queryProps.data?.address.country === 'US'
  );

  return {
    ...queryProps,
    isUSEntity,
  };
};
