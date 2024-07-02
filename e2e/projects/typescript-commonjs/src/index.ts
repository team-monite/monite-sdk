import { createAPIClient, MoniteProvider } from '@monite/sdk-react';

const client = createAPIClient();
type PostAuthTokenUrl = typeof client.api.auth.postAuthToken.schema.url;

console.log('Read Exported Structures', client.api.auth.postAuthToken.schema);
console.log('Read Exported Components', MoniteProvider);
