import { getConfig } from '@/lib/ConfigLoader';
import { createAPIClient } from '@monite/sdk-react';

export async function fetchTokenDev() {
  const { entity_user_id, client_id, client_secret, api_url } =
    await getConfig();

  if (
    process.env.NODE_ENV === 'development' &&
    (client_id === 'mocked_client_id' ||
      entity_user_id === 'mocked_entity_id' ||
      client_secret === 'mocked_client_secret')
  ) {
    return {
      access_token: 'mocked_access_token_for_development',
      token_type: 'Bearer' as const,
      expires_in: 3600,
    };
  }

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
