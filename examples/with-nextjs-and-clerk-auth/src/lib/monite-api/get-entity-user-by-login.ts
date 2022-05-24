import { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

export const getEntityUserByLogin = async (
  {
    login,
    entity_id,
  }: {
    login: string;
    entity_id: string;
  },
  token: AccessToken
) => {
  if (!login) throw new Error('login is empty');

  const { GET } = createMoniteClient({
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const { data, error, response } = await GET('/entity_users', {
    params: {
      header: {
        'x-monite-version': getMoniteApiVersion(),
        'x-monite-entity-id': entity_id,
      },
      query: {
        login,
      },
    },
  });

  if (error) {
    console.error(
      `Failed to get Entity User for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Entity User fetch failed: ${JSON.stringify(error)}`);
  }

  if (data.data.length > 1) {
    console.error(
      `More than one Entity User found for the login: "${login}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(
      `More than one Entity User found for the login: "${login}"`
    );
  }

  return data.data.at(0);
};
