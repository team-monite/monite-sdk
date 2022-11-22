import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';

import { useComponentsContext } from '../context/ComponentsContext';
import {
  PaginationResponse,
  ReceivableService,
  ReceivableResponse,
} from '@team-monite/sdk-api';

const RECEIVABLE_QUERY_ID = 'receivable';

export const useReceivables = (
  ...args: Parameters<ReceivableService['getAllReceivables']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<PaginationResponse, Error>(
    [RECEIVABLE_QUERY_ID, { variables: args }],
    () => monite.api!.receivable.getAllReceivables(...args)
  );
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
    }
  );
};
