import type { components, Services } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMemo } from 'react';

const isReceiptInOCRProcessing = (
  receipt: components['schemas']['ReceiptResponseSchema']
) => {
  return receipt.ocr_status === 'processing';
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
      query,
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
      // Refetch interval is set to 2 seconds if there are any receipts in OCR processing
      refetchInterval: (query) => {
        const pages = query.state.data?.pages;
        if (!pages || pages.length === 0) return undefined;

        // Early exit if no processing receipts found in first few pages
        // This avoids checking all pages when most receipts are likely processed
        for (const page of pages.slice(0, 3)) {
          // Check first 3 pages only
          if (page.data.some(isReceiptInOCRProcessing)) {
            return 2_000;
          }
        }

        // If we have more pages, check them too but limit the search
        if (pages.length > 3) {
          for (const page of pages.slice(3)) {
            if (page.data.some(isReceiptInOCRProcessing)) {
              return 2_000;
            }
          }
        }

        return undefined;
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
