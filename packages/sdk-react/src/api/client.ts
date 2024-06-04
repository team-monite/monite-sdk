import { apiVersion } from '@/api/api-version';
import { createAPIClient } from '@/api/create-api-client';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteQraftContext } from '@/core/context/QraftProvider';

export const api = createAPIClient({ context: MoniteQraftContext });

export const useMoniteApiClient = () => {
  const { monite } = useMoniteContext();
  return {
    api,
    apiVersion: apiVersion,
    entityId: monite.entityId,
  } as const;
};
