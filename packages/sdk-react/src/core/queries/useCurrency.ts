import { toast } from 'react-hot-toast';

import { CurrencyDetails, ApiError } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

export const CURRENCY_QUERY_ID = 'currencies';

export const useCurrencyList = () => {
  const { monite } = useMoniteContext();

  return useQuery<Record<string, CurrencyDetails>, ApiError>({
    queryKey: [CURRENCY_QUERY_ID],

    queryFn: () => monite.api.currencies.getCurrencies(),
  });
};
