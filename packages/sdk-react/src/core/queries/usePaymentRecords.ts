import { useMemo, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import type { Services } from '@/api';
import { type PaymentRecordWithIntent } from '@/components/payables/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const usePaymentRecords = (
  query: Services['paymentRecords']['getPaymentRecords']['types']['parameters']['query'],
  enabled = true
) => {
  const { api } = useMoniteContext();

  return api.paymentRecords.getPaymentRecords.useQuery(
    {
      query,
    },
    { enabled }
  );
};

/**
 * Hook to fetch payment records for a list of payables.
 * Sorts the payment records by paid_at in descending order.
 *
 * @param payableIds - Array of payable IDs to fetch payment records for
 * @returns {Object}
 *  - payablesPaymentIntentsRecord: Payment intents with most recent record per intent, grouped by payable ID
 *  - isLoading: Loading state boolean
 *  - error: Error state if request fails
 *
 * Example data returned in payablesPaymentIntentsRecord:
 * ```
 * {
 *    "payable-id-1": [
 *      { intent: "payment-intent-id-1", record: record2 },
 *      { intent: "payment-intent-id-2", record: record3 }
 *    ],
 *    "payable-id-2": [
 *      { intent: "payment-intent-id-3", record: record6 },
 *      { intent: "payment-intent-id-4", record: record8 }
 *    ]
 * }
 * ```
 */
export const usePayablePaymentIntentsAndRecords = (
  payableIds: string[] = []
) => {
  const { api, queryClient } = useMoniteContext();

  // Memoize payable IDs to prevent unnecessary re-renders
  const memoizedPayableIds = useMemo(() => payableIds, [payableIds]);

  // Query page by page to fetch all payment records for the given payables
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.paymentRecords.getPaymentRecords.useInfiniteQuery(
    {
      query: {
        object_id__in: memoizedPayableIds,
        sort: 'paid_at',
        order: 'desc',
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
      enabled: memoizedPayableIds.length > 0,
    }
  );

  // Automatically fetch next page when available
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage().catch((error) => {
        console.error('Error fetching next page:', error);
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Optimized processing of payment records
  const payablesPaymentIntentsRecord = useMemo(() => {
    if (!data?.pages?.length || !memoizedPayableIds.length) {
      return {};
    }

    const result: Record<string, PaymentRecordWithIntent[]> = {};

    // Pre-initialize result structure
    memoizedPayableIds.forEach((id) => {
      result[id] = [];
    });

    // Use Map for faster lookups of processed intents
    const processedIntents = new Map<string, Set<string>>();
    memoizedPayableIds.forEach((id) => {
      processedIntents.set(id, new Set());
    });

    // Process records from all pages
    for (const page of data.pages) {
      if (!page.data?.length) continue;

      for (const record of page.data) {
        const payableId = record.object?.id;
        const paymentIntentId = record.payment_intent_id;

        // Skip if not a valid payable record or missing payment intent ID
        if (
          record.object?.type !== 'payable' ||
          !payableId ||
          !paymentIntentId ||
          !result[payableId]
        ) {
          continue;
        }

        const payableIntents = processedIntents.get(payableId);

        // Only add if we haven't seen this payment intent for this payable
        if (payableIntents && !payableIntents.has(paymentIntentId)) {
          result[payableId].push({
            intent: paymentIntentId,
            record: record,
          });
          payableIntents.add(paymentIntentId);
        }
      }
    }

    return result;
  }, [data?.pages, memoizedPayableIds]);

  return {
    allPaymentRecords: data?.pages.flatMap((page) => page.data),
    payablesPaymentIntentsRecord,
    isLoading:
      memoizedPayableIds.length > 0 && (isLoading || isFetchingNextPage),
    error,
    refetch: () => {
      api.paymentRecords.getPaymentRecords.invalidateQueries(queryClient);
    },
  };
};

export const useCreatePaymentRecord = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.paymentRecords.postPaymentRecords.useMutation(
    {},
    {
      onSuccess: async () => {
        await api.paymentRecords.getPaymentRecords.invalidateQueries(
          queryClient
        );

        return toast.success(t(i18n)`Payment record was created`);
      },
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        toast.error(t(i18n)`Failed to create payment record: ${errorMessage}`);
      },
    }
  );
};

export const usePaymentRecordById = (payment_record_id: string) => {
  const { api } = useMoniteContext();

  return api.paymentRecords.getPaymentRecordsId.useQuery({
    path: {
      payment_record_id,
    },
  });
};
