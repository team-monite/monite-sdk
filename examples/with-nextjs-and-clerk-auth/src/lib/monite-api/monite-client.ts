import createClient from 'openapi-fetch';
import apiPackage from 'sdk-demo-with-nextjs-and-clerk-auth/package.json' assert { type: 'json' };

import { AccessToken } from '@/lib/monite-api/fetch-token';
import { paths } from '@/lib/monite-api/schema';
import { isBuildTime } from '@/lib/utils/build-time-detection';

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

/**
 * Get the Monite API URL, with build-time fallback to prevent errors during static generation
 */
export const getMoniteApiUrl = (): string => {
  if (isBuildTime()) {
    return 'https://api.mock.monite.com/v1';
  }

  const moniteApiUrl = process.env.MONITE_API_URL;
  if (!moniteApiUrl) throw new Error('MONITE_API_URL is not set');
  return moniteApiUrl;
};

export const getMoniteApiVersion = (): string => {
  const moniteApiVersion = apiVersion;
  if (!moniteApiVersion)
    throw new Error('apiVersion is not exists in "@monite/sdk-react"');
  return moniteApiVersion;
};
