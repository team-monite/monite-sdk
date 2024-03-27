import {
  getMoniteApiUrl,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

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
  const response = await fetch(`${getMoniteApiUrl()}/auth/token`, {
    method: 'POST',
    headers: {
      'X-Monite-Version': getMoniteApiVersion(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      grant_type: params.grant_type,
      ...(params.grant_type === 'entity_user'
        ? {
            entity_user_id: params.entity_user_id,
          }
        : {}),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    console.error(
      `Failed fetch token for the 'client_id' "${client_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(
      await response
        .json()
        .catch(() => ({ message: response.text() }))
        .then(({ error: { message } }) => `Failed to fetch token: ${message}`)
        .catch(() => 'Failed to fetch token')
    );
  }

  return response.json();
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
