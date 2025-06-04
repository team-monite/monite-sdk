import createClient from 'openapi-fetch';
import apiPackage from 'sdk-demo-with-nextjs-and-clerk-auth/package.json' assert { type: 'json' };

import { AccessToken } from '@/lib/monite-api/fetch-token';
import { paths } from '@/lib/monite-api/schema';

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

const isBuildTime = () => {
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

  if (isBuild) {
    return true;
  }

  const isCiBuild =
    process.env.NODE_ENV === 'production' &&
    typeof window === 'undefined' &&
    (!process.env.CLERK_SECRET_KEY || !process.env.MONITE_API_URL);

  if (isCiBuild) {
    return true;
  }

  return false;
};

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
