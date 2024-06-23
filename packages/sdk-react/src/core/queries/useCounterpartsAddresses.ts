'use client';

import {
  CounterpartsAddressesService,
  CounterpartAddressResourceList,
  ApiError,
} from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

export const COUNTERPARTS_ADDRESSES_QUERY_ID = 'counterpartsAddresses';

export const useCounterpartsAddresses = (
  ...args: Parameters<CounterpartsAddressesService['getCounterpartAddresses']>
) => {
  const { monite } = useMoniteContext();

  return useQuery<CounterpartAddressResourceList, ApiError>({
    queryKey: [COUNTERPARTS_ADDRESSES_QUERY_ID, { variables: args }],

    queryFn: () =>
      monite.api.counterpartsAddresses.getCounterpartAddresses(...args),

    enabled: !!args[0],
  });
};
