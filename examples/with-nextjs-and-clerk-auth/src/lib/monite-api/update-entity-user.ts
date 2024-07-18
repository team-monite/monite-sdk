import type { AccessToken } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

import { paths } from './schema';

export const updateEntityUser = async (
  {
    entity_id,
    entity_user_id,
    user,
  }: {
    entity_id: string;
    entity_user_id: string;
    user: paths['/entity_users/{entity_user_id}']['patch']['requestBody']['content']['application/json'];
  },
  token: AccessToken
) => {
  if (!entity_id) throw new Error('entity_id is empty');

  const { PATCH } = createMoniteClient(token);

  const { data, error } = await PATCH('/entity_users/{entity_user_id}', {
    params: {
      path: { entity_user_id },
      header: {
        'x-monite-version': getMoniteApiVersion(),
        'x-monite-entity-id': entity_id,
      },
    },
    body: user,
  });

  if (error) {
    console.error('Failed to create entity user', error);
    throw new Error('Failed to create entity user');
  }

  if (!data) throw new Error('Failed to create entity user: no data returned');

  return data;
};
