import { createAPIClient } from '@monite/sdk-react';

import { getMoniteApiUrl } from '@/lib/monite-api/monite-client';

export const fetchToken = async ({
  client_id,
  client_secret,
  ...params
}: { client_id: string; client_secret: string } & (
  | {
      grant_type: 'entity_user';
      entity_user_id: string;
    }
  | {
      grant_type: 'client_credentials';
    }
)): Promise<AccessToken> => {
  const { api, requestFn } = createAPIClient();

  try {
    return await api.auth.postAuthToken(
      {
        parameters: {},
        baseUrl: getMoniteApiUrl(),
        body: {
          client_id,
          client_secret,
          grant_type: params.grant_type,
          entity_user_id:
            params.grant_type === 'entity_user'
              ? params.entity_user_id
              : undefined,
        },
      },
      requestFn
    );
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`Failed to fetch token: ${error.message}`);

    throw new Error(`Failed to fetch token ${JSON.stringify(error)}`);
  }
};

export const fetchTokenServer = async (
  params:
    | {
        grant_type: 'entity_user';
        entity_user_id: string;
      }
    | {
        grant_type: 'client_credentials';
      }
): Promise<AccessToken> => {
  if (!process.env.MONITE_PROJECT_CLIENT_ID)
    throw new Error('MONITE_PROJECT_CLIENT_ID is not set');
  if (!process.env.MONITE_PROJECT_CLIENT_SECRET)
    throw new Error('MONITE_PROJECT_CLIENT_SECRET is not set');

  return fetchToken({
    client_id: process.env.MONITE_PROJECT_CLIENT_ID,
    client_secret: process.env.MONITE_PROJECT_CLIENT_SECRET,
    ...params,
  });
};

export type AccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};
