import { useQuery } from 'react-query';
import { CounterpartPaginationResponse } from '@monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

export const useCounterpartList = () => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartPaginationResponse, Error>(
    ['counterpart'],
    () => {
      return monite.api!.counterparts.getList();
    },
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
