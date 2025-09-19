import type { Services } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { keepPreviousData } from '@tanstack/react-query';

export const useGetReceipts = (
  query: Services['receipts']['getReceipts']['types']['parameters']['query'],
  enabled: boolean = true
) => {
  const { api } = useMoniteContext();

  const { data, isLoading, error, refetch } = api.receipts.getReceipts.useQuery(
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
    receipts: data?.data,
    isLoading,
    error,
    refetch,
  };
};
