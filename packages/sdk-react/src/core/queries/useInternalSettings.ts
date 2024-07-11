'use client';

import { ApiError, PartnerProjectSettingsResponse } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

export const INTERNAL_SETTINGS_QUERY_ID = 'internalSettings';

export const useInternalSettings = (partnerId?: string, projectId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<PartnerProjectSettingsResponse, ApiError>({
    queryKey: [
      INTERNAL_SETTINGS_QUERY_ID,
      { variables: { partnerId, projectId } },
    ],

    queryFn: () => {
      if (!partnerId || !projectId) {
        throw new Error('partnerId and projectId are required');
      }
      return monite.api.internalSettings.getInternalSettings(
        partnerId,
        projectId
      );
    },

    enabled: !!partnerId && !!projectId,
  });
};
