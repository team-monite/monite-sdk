import { useQuery } from 'react-query';
import {
  CounterpartPaginationResponse,
  CounterpartsService,
} from '@monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

export const useCounterpartList = (
  ...args: Parameters<CounterpartsService['getList']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartPaginationResponse, Error>(
    ['counterpart'],
    () => {
      return monite.api!.counterparts.getList(...args);
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
