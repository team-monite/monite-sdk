import { CurrencyDetails, ApiError } from '@team-monite/sdk-api';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';

import { useComponentsContext } from '../context/ComponentsContext';

export const CURRENCY_QUERY_ID = 'currencies';

export const useCurrencyList = () => {
  const { monite } = useComponentsContext();

  return useQuery<Record<string, CurrencyDetails>, ApiError>(
    [CURRENCY_QUERY_ID],
    () => monite.api.currencies.getCurrencies(),
    {
      onError: (error) => {
        toast.error(error.body.error.message || error.message);
      },
    }
  );
};
