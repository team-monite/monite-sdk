import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  CounterpartPaginationResponse,
  CounterpartsService,
  CounterpartResponse,
} from '@monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';
import { getName } from 'components/counterparts/helpers';

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

export const useDeleteCounterpartById = (
  counterpart: CounterpartResponse,
  entityId: string
) => {
  const queryClient = useQueryClient();
  const { monite, t } = useComponentsContext();

  const useDeleteCounterpart = useMutation(
    () =>
      monite.api!.counterparts.deleteCounterpartById(counterpart.id, entityId),
    {
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
    }
  );

  return useDeleteCounterpart;
};
