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

export const getMoniteChatApiUrl = (): string => {
  const chatbotApiUrl = process.env.MONITE_CHATBOT_API_URL;
  if (!chatbotApiUrl) throw new Error('MONITE_CHATBOT_API_URL is not set');
  return chatbotApiUrl;
};
