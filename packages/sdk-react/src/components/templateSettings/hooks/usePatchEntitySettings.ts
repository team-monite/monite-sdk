import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const usePatchEntitySettings = (entityId: string) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.entities.patchEntitiesIdSettings.useMutation(undefined, {
    onSuccess: () => {
      toast.success(t(i18n)`Settings updated successfully.`);
      api.entities.getEntitiesIdSettings.invalidateQueries(
        {
          parameters: { path: { entity_id: entityId } },
        },
        queryClient
      );
      api.entities.getEntitiesIdSettingsNextDocumentNumbers.invalidateQueries(
        {
          parameters: { path: { entity_id: entityId } },
        },
        queryClient
      );
    },
  });
};
