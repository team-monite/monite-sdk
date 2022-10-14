import { useQuery } from 'react-query';
import { EntityResponse } from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

export const useEntityById = (id: string | undefined) => {
  const { monite } = useComponentsContext();

  return useQuery<EntityResponse | undefined, Error>(
    ['entity', { id }],
    () => (id ? monite.api.entity.getById(id) : undefined),
    {
      enabled: !!id,
      onError: (error) => {
        toast.error(`Entity ${error.message}`);
      },
    }
  );
};
