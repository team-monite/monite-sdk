import createClient from 'openapi-fetch';
import apiPackage from 'sdk-demo-with-nextjs-and-clerk-auth/package.json' assert { type: 'json' };

import { paths } from '@/lib/monite-api/schema';

const apiVersion = apiPackage.apiVersion;

export const createMoniteClient = (
  clientOptions?: Parameters<typeof createClient>[0]
) => {
  return createClient<paths>({
    ...clientOptions,
    headers: {
      'x-monite-version': getMoniteApiVersion(),
      ...clientOptions?.headers,
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
