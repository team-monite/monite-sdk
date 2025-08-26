import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { keepPreviousData } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

/**
 * Custom hook to fetch receipts for given transaction IDs using infinite pagination.
 *
 * @param transactionIds Array of transaction IDs to fetch receipts for
 * @returns Object containing receipts mapping by transaction ID and loading state
 */
export const useReceiptsByTransactionIds = (transactionIds: string[] = []) => {
  const { api } = useMoniteContext();

  // Memoize transaction IDs to prevent unnecessary re-renders
  const memoizedTransactionIds = useMemo(
    () => transactionIds,
    [transactionIds]
  );

  // Fetch receipts using infinite pagination
  const {
    data: receiptsPages,
    isLoading,
    error,
    fetchNextPage: fetchReceiptsNextPage,
    hasNextPage: hasReceiptsNextPage,
    isFetchingNextPage: isReceiptsFetchingNextPage,
  } = api.receipts.getReceipts.useInfiniteQuery(
    {
      query: {
        transaction_id__in: memoizedTransactionIds,
        limit: 100,
      },
    },
    {
      initialPageParam: { query: { pagination_token: undefined } },
      getNextPageParam: (currentPage) => {
        if (!currentPage.next_pagination_token) return undefined;
        return {
          query: { pagination_token: currentPage.next_pagination_token },
        };
      },
      enabled: memoizedTransactionIds.length > 0,
      placeholderData: keepPreviousData,
    }
  );

  // Automatically fetch next page when available
  useEffect(() => {
    if (hasReceiptsNextPage && !isReceiptsFetchingNextPage) {
      fetchReceiptsNextPage().catch((error) => {
        console.error('Error fetching next page of receipts:', error);
      });
    }
  }, [hasReceiptsNextPage, isReceiptsFetchingNextPage, fetchReceiptsNextPage]);

  // Flatten all receipts from all pages and create mapping by transaction ID
  const receiptsByTransactionId = useMemo(() => {
    if (!receiptsPages?.pages) return {};

    const allReceipts = receiptsPages.pages.flatMap((page) => page.data || []);

    return allReceipts.reduce(
      (acc, receipt) => {
        if (receipt.transaction_id) {
          acc[receipt.transaction_id] = receipt;
        }
        return acc;
      },
      {} as Record<string, components['schemas']['ReceiptResponseSchema']>
    );
  }, [receiptsPages?.pages]);

  return {
    receiptsByTransactionId,
    isLoading,
    error,
    refetch: () => fetchReceiptsNextPage(),
  };
};
