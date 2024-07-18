import createClient from 'openapi-fetch';
import apiPackage from 'sdk-demo-with-nextjs-and-clerk-auth/package.json' assert { type: 'json' };

import { AccessToken } from '@/lib/monite-api/fetch-token';
import { components, paths } from '@/lib/monite-api/schema';

const apiVersion = apiPackage.apiVersion;

export type MoniteClient = ReturnType<typeof createMoniteClient>;

export const createMoniteClient = (token: AccessToken) => {
  return createClient<paths>({
    headers: {
      'x-monite-version': getMoniteApiVersion(),
      Authorization: `${token.token_type} ${token.access_token}`,
    },
    baseUrl: getMoniteApiUrl(),
  });
};

export const getMoniteApiUrl = (): string => {
  const moniteApiUrl = process.env.MONITE_API_URL;
  if (!moniteApiUrl) throw new Error('MONITE_API_URL is not set');
  return moniteApiUrl;
};

export const getMoniteApiVersion = (): string => {
  const moniteApiVersion = apiVersion;
  if (!moniteApiVersion)
    throw new Error('apiVersion is not exists in "@monite/sdk-api"');
  return moniteApiVersion;
};

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
