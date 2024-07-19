import {
  getMoniteApiVersion,
  MoniteClient,
} from '@/lib/monite-api/monite-client';
import { components } from '@/lib/monite-api/schema';

export const getEntity = async (
  moniteClient: MoniteClient,
  entity_id: string
): Promise<components['schemas']['EntityOrganizationResponse']> => {
  const entityResponse = await moniteClient.GET(`/entities/{entity_id}`, {
    params: {
      path: { entity_id },
      header: {
        'x-monite-version': getMoniteApiVersion(),
      },
    },
  });

  if (entityResponse.error) {
    console.error(
      `Failed to fetch entity details when creating a Bank Account for the entity_id: "${entity_id}"`,
      `x-request-id: ${entityResponse.response.headers.get('x-request-id')}`
    );

    throw entityResponse.error;
  }

  const entity =
    entityResponse.data as components['schemas']['EntityOrganizationResponse'];
  if (entity.type != 'organization')
    throw new Error(`Cannot fetch an individual entity`);
  return entity;
};
