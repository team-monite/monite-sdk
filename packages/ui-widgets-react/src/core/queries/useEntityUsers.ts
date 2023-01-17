import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  ApiError,
  EntityUserPaginationResponse,
  EntityUserService,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';

export const ENTITY_USERS_QUERY_ID = 'entityUsers';
export const useEntityUsersList = (
  ...args: Parameters<EntityUserService['getList']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<EntityUserPaginationResponse, ApiError>(
    [ENTITY_USERS_QUERY_ID, { variables: args }],
    () => monite.api.entityUser.getList(...args),
    {
      onError: (error) => {
        toast.error(error.body.error.message || error.message);
      },
    }
  );
};
