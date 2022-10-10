import { useQuery } from 'react-query';
import { EntityUserResponse } from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

export const useEntityUserById = (id: string | undefined) => {
  const { monite } = useComponentsContext();

  return useQuery<EntityUserResponse | undefined, Error>(
    ['entity-user', { id }],
    () => {
      return id ? monite.api!.entityUser.getById(id) : undefined;
    },
    {
      enabled: !!id,
      onError: (error) => {
        toast.error(`Entity User ${error.message}`);
      },
    }
  );
};
