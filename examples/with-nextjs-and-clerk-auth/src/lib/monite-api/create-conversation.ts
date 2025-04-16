import { AIMessage } from '@monite/sdk-react';

import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';
import { fetchTokenServer } from '@/lib/monite-api/fetch-token';
import {
  getMoniteApiUrl,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

export async function createConversation(): Promise<AIMessage | undefined> {
  const { entity_user_id } = await getCurrentUserEntity();

  if (!entity_user_id) {
    return undefined;
  }

  const token = await fetchTokenServer({
    grant_type: 'entity_user',
    entity_user_id,
  });

  const response = await fetch(`${getMoniteApiUrl()}/ai/conversations`, {
    method: 'POST',
    headers: {
      'x-monite-version': getMoniteApiVersion(),
      Authorization: `${token.token_type} ${token.access_token}`,
      'Content-type': 'application/json',
    },
    cache: 'no-cache',
  });

  if (!response.ok) {
    return undefined;
  }

  return await response.json();
}
