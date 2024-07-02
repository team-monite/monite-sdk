import { getConfig } from '@/lib/ConfigLoader';
import { createAPIClient } from '@monite/sdk-react';

export async function fetchTokenDev() {
  const { entity_user_id, client_id, client_secret, api_url } =
    await getConfig();
  const { api, requestFn } = createAPIClient();
  return await api.auth.postAuthToken(
    {
      baseUrl: `${api_url}/v1`,
      parameters: {},
      body: {
        grant_type: 'entity_user',
        entity_user_id,
        client_id,
        client_secret,
      },
    },
    requestFn
  );
}
