import { useQuery } from 'react-query';
import { EntityUserResponse } from '@monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

export const useEntityUserById = (id: string | undefined) => {
  const { monite } = useComponentsContext();

  return useQuery<EntityUserResponse, Error>(
    ['entity-user', { id }],
    () => {
      return monite.api!.entityUser.getById(id || '');
    },
    {
      enabled: !!id,
      onError: (error) => {
        toast.error(`Entity User ${error.message}`);
      },
    }
  );
};
