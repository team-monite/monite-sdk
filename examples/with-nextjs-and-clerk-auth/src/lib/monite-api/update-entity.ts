import { fetchTokenServer } from '@/lib/monite-api/fetch-token';
import {
  createMoniteClient,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

import { paths } from './schema';


export const updateEntity = async ({
  entity_id,
  entity,
}: {
  entity_id: string;
  entity: paths['/entities/{entity_id}']['patch']['requestBody']['content']['application/json'];
}) => {
  const token = await fetchTokenServer({
    grant_type: 'client_credentials',
  });

  const { PATCH } = createMoniteClient(token);

  const { data, error, response } = await PATCH('/entities/{entity_id}', {
    params: {
      path: { entity_id },
      header: {
        'x-monite-version': getMoniteApiVersion(),
      },
    },
    body: entity,
  });

  if (error) {
    console.error(
      `Failed to update Entity for the entity_id: "${entity_id}"`,
      `x-request-id: ${response.headers.get('x-request-id')}`
    );

    throw new Error(`Entity update failed: ${JSON.stringify(error)}`);
  }

  return data;
};
