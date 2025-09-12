import type { Services } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { keepPreviousData } from '@tanstack/react-query';
import { useMemo } from 'react';

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

export const useInfiniteGetReceipts = (
  query: Services['receipts']['getReceipts']['types']['parameters']['query'],
  enabled: boolean = true
) => {
  const { api } = useMoniteContext();

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.receipts.getReceipts.useInfiniteQuery(
    {
      query: query,
    },
    {
      enabled: enabled,
      initialPageParam: { query: { pagination_token: undefined } },
      getNextPageParam: (currentPage) => {
        if (!currentPage.next_pagination_token) return undefined;
        return {
          query: { pagination_token: currentPage.next_pagination_token },
        };
      },
    }
  );

  // Flatten all pages data for display
  const receipts = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  return {
    response: data,
    receipts,
    isLoading,
    error,
    refetch,
    hasNextPage: hasNextPage || false,
    isFetchingNextPage,
    fetchNextPage,
  };
};
