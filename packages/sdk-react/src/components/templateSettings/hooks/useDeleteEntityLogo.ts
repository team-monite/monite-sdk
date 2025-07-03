import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useDeleteEntityLogo = (entityId: string) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.entities.deleteEntitiesIdLogo.useMutation(
    {
      path: {
        entity_id: entityId,
      },
    },
    {
      onSuccess: async () => {
        await api.entityUsers.getEntityUsersMyEntity.invalidateQueries(
          queryClient
        );
        toast.success(t(i18n)`Logo was removed.`);
      },

      onError: () => {
        toast.error(t(i18n)`Failed to remove logo.`);
      },
    }
  );
};
