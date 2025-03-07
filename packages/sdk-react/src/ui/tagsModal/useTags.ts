import { useMoniteContext } from '@/core/context/MoniteContext';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';

export const useTags = () => {
  const { api } = useMoniteContext();
  const { data: user } = useEntityUserByAuthToken();
  const { data: isTagsReadAllowed } = useIsActionAllowed({
    method: 'tag',
    action: 'read',
    entityUserId: user?.id,
  });

  const tagsQuery = api.tags.getTags.useQuery(
    {},
    { enabled: isTagsReadAllowed }
  );

  return {
    tagsQuery,
  };
};
