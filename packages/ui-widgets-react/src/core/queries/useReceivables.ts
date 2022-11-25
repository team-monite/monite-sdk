import { useQuery } from 'react-query';

import { useComponentsContext } from '../context/ComponentsContext';
import { PaginationResponse, ReceivableService } from '@team-monite/sdk-api';

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
