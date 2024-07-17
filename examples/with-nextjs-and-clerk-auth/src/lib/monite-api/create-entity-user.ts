import { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

import { paths } from './schema';

export const createEntityUser = async (
  {
    entity_id,
    user,
  }: {
    entity_id: string;
    user: paths['/entity_users']['post']['requestBody']['content']['application/json'];
  },
  token: AccessToken
) => {
  if (!entity_id) throw new Error('entity_id is empty');
  if (!user.login) throw new Error('user.login is empty');

  const { POST } = createMoniteClient(token);

  const { data, error, response } = await POST('/entity_users', {
    params: {
      header: {
        'x-monite-version': getMoniteApiVersion(),
        'x-monite-entity-id': entity_id,
      },
    },
    body: user,
  });

  if (error) {
    console.error(
      `Failed to create Entity User for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Entity User create failed: ${JSON.stringify(error)}`);
  }

  if (!data) throw new Error('Failed to create entity user: no data returned');

  return data;
};
