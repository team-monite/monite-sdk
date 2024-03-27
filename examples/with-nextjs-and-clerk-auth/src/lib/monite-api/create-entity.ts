import { AccessToken, fetchTokenServer } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

import { paths } from './schema';

export const createEntity = async (
  entity: paths['/entities']['post']['requestBody']['content']['application/json'],
  token: AccessToken
) => {
  const { POST } = createMoniteClient({
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });

  const { data, error } = await POST('/entities', {
    params: {
      header: {
        'x-monite-version': getMoniteApiVersion(),
      },
    },
    body: entity,
  });

  if (error) {
    console.error(
      'Failed to create Entity',
      error && 'detail' in error ? error.detail : error
    );
    throw new Error('Failed to create Entity');
  }

  return data;
};
