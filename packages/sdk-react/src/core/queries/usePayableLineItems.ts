import { ApiError, LineItemPaginationResponse } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useEntityListCache } from './hooks';

const PAYABLE_LINE_ITEM_QUERY_ID = 'payableLineItems';

const payableLineItemQueryKeys = {
  list: (payableId: string) => [PAYABLE_LINE_ITEM_QUERY_ID, payableId],
};

export const usePayableLineItemCache = () =>
  useEntityListCache((payableId?: string) => {
    if (!payableId) {
      return [];
    }

    return payableLineItemQueryKeys.list(payableId);
  });

export const usePayableLineItemsList = (payableId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<LineItemPaginationResponse, ApiError>(
    [PAYABLE_LINE_ITEM_QUERY_ID, payableId],
    () => {
      if (!payableId) {
        throw new Error('payableId is required');
      }

      return monite.api.payableLineItems.getList(payableId);
    },
    {
      enabled: !!payableId,
    }
  );
};
