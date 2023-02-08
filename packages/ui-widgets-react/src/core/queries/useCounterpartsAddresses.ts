import { useQuery } from 'react-query';
import {
  CounterpartsAddressesService,
  CounterpartAddressResourceList,
  ApiError,
} from '@team-monite/sdk-api';

import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

export const COUNTERPARTS_ADDRESSES_QUERY_ID = 'counterpartsAddresses';

export const useCounterpartsAddresses = (
  ...args: Parameters<CounterpartsAddressesService['getCounterpartAddresses']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartAddressResourceList, ApiError>(
    [COUNTERPARTS_ADDRESSES_QUERY_ID, { variables: args }],
    () => monite.api.counterpartsAddresses.getCounterpartAddresses(...args),
    {
      enabled: !!args[0],
      onError: (error) => {
        console.log('error', error);
        toast.error(error.body.error.message || error.message);
      },
    }
  );
};
