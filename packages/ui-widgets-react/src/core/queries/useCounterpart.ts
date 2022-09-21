import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  CounterpartCreatePayload,
  CounterpartsService,
  CounterpartPaginationResponse,
  CounterpartResponse,
  CounterpartUpdatePayload,
} from '@monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';
import { getName } from 'components/counterparts/helpers';

const COUNTERPARTS_QUERY_ID = 'counterparts';

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

export const useCounterpartById = (id?: string) => {
  const { monite } = useComponentsContext();

  return useQuery<CounterpartResponse | undefined, Error>(
    [COUNTERPARTS_QUERY_ID, { id }],
    () => (id ? monite.api!.counterparts.getById(id) : undefined),
    {
      enabled: !!id,
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

export const useDeleteCounterpartById = (counterpart: CounterpartResponse) => {
  const queryClient = useQueryClient();
  const { monite, t } = useComponentsContext();

  return useMutation(() => monite.api!.counterparts.delete(counterpart.id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['counterpart']);

      toast(
        t('counterparts:confirmDialogue.successNotification', {
          name: getName(counterpart),
        })
      );
    },
    onError: () => {
      toast.error(
        t('counterparts:confirmDialogue.errorNotification', {
          name: getName(counterpart),
        })
      );
    },
  });
};
