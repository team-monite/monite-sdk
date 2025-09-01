import type { Services } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { keepPreviousData } from '@tanstack/react-query';

export const useGetTransactions = (
  query: Services['transactions']['getTransactions']['types']['parameters']['query'],
  enabled: boolean
) => {
  const { api } = useMoniteContext();

  const { data, isLoading, error, refetch } =
    api.transactions.getTransactions.useQuery(
      {
        query,
      },
      {
        enabled: enabled,
        placeholderData: keepPreviousData,
      }
    );

  return {
    response: data,
    transactions: data?.data,
    isLoading,
    error,
    refetch,
  };
};
