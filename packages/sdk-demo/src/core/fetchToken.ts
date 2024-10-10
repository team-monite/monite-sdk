import { GrantType } from '@monite/sdk-api';

export async function fetchToken(
  apiUrl: string,
  {
    entity_user_id,
    client_id,
    client_secret,
  }: Pick<AuthCredentials, 'entity_user_id' | 'client_id' | 'client_secret'>
) {
  const res = await fetch(`${apiUrl}/auth/token`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'x-monite-version': '2023-04-12',
    },
    body: JSON.stringify({
      grant_type: GrantType.ENTITY_USER,
      entity_user_id,
      client_id,
      client_secret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch token: ${await res.text()}`);
  }

  return await res.json();
}

export type AuthCredentials = {
  entity_user_id: string;
  client_id: string;
  client_secret: string;
};
