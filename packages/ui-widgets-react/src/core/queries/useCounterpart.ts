import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  CounterpartCreatePayload,
  CounterpartPaginationResponse,
  CounterpartResponse,
  CounterpartUpdatePayload,
} from '@monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

const COUNTERPARTS_QUERY_ID = 'counterparts';

export const useCounterpartList = () => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartPaginationResponse, Error>(
    [COUNTERPARTS_QUERY_ID, 'list'],
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

export const useCounterpartById = (id: string) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartResponse, Error>(
    [COUNTERPARTS_QUERY_ID, { id }],
    () => monite.api!.counterparts.getById(id),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCreateCounterpart = () => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<CounterpartResponse, Error, CounterpartCreatePayload>(
    (body) => monite.api!.counterparts.create(body),
    {
      onSuccess: (counterpart) => {
        queryClient.setQueryData(
          [COUNTERPARTS_QUERY_ID, { id: counterpart.id }],
          counterpart
        );
        toast.success('Created');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useUpdateCounterpart = (id: string) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<CounterpartResponse, Error, CounterpartUpdatePayload>(
    (body) => monite.api!.counterparts.update(id, body),
    {
      onSuccess: (counterpart) => {
        queryClient.setQueryData(
          [COUNTERPARTS_QUERY_ID, { id: counterpart.id }],
          counterpart
        );
        toast.success('Updated');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
