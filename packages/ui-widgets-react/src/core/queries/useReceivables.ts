import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  ReceivableService,
  PaginationResponse,
  ReceivableResponse,
  ReceivablesReceivableFacadeCreatePayload,
} from '@team-monite/sdk-api';

import { useComponentsContext } from '../context/ComponentsContext';
import { useEntityListCache } from './hooks';

const RECEIVABLE_QUERY_ID = 'receivable';

const useReceivableListCache = () =>
  useEntityListCache<ReceivableResponse>(() => [RECEIVABLE_QUERY_ID, 'list']);

export const useReceivables = (
  ...args: Parameters<ReceivableService['getAllReceivables']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<PaginationResponse, Error>(
    [[RECEIVABLE_QUERY_ID, 'list'], { variables: args }],
    () => monite.api!.receivable.getAllReceivables(...args)
  );
};

export const useCreateReceivable = () => {
  const { monite, t } = useComponentsContext();
  const { invalidate } = useReceivableListCache();

  return useMutation<
    ReceivableResponse,
    Error,
    ReceivablesReceivableFacadeCreatePayload
  >((payload) => monite.api!.receivable.createNewReceivable(payload), {
    onSuccess: (receivable) => {
      invalidate();
      toast.success(
        t('receivables:notifications.createSuccess', {
          name: receivable.counterpart_name,
        })
      );
    },
    onError: () => {
      toast.error(t('receivables:notifications.createError'));
    },
  });
};

export const useReceivableById = (id?: string) => {
  const { monite } = useComponentsContext();

  return useQuery<ReceivableResponse | undefined, Error>(
    [RECEIVABLE_QUERY_ID, { id }],
    () => (id ? monite.api!.receivable.getById(id) : undefined),
    {
      onError: (error) => {
        toast.error(error.message);
      },
      enabled: !!id,
    }
  );
};
