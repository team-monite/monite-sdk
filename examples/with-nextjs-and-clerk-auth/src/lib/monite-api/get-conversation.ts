import { AIMessage, Conversation } from '@monite/sdk-react';

import { getCurrentUserEntity } from '@/lib/clerk-api/get-current-user-entity';
import { fetchTokenServer } from '@/lib/monite-api/fetch-token';
import {
  getMoniteApiUrl,
  getMoniteApiVersion,
} from '@/lib/monite-api/monite-client';

interface ConversationHistory extends Conversation {
  messages: AIMessage[];
}

export async function getConversation(
  conversationId: string
): Promise<ConversationHistory | undefined> {
  const { entity_user_id } = await getCurrentUserEntity();

  if (!entity_user_id) {
    return undefined;
  }

  const token = await fetchTokenServer({
    grant_type: 'entity_user',
    entity_user_id,
  });

  const response = await fetch(
    `${getMoniteApiUrl()}/ai/conversations/${conversationId}`,
    {
      headers: {
        'x-monite-version': getMoniteApiVersion(),
        Authorization: `${token.token_type} ${token.access_token}`,
        'Content-type': 'application/json',
      },
      cache: 'no-cache',
    }
  );

  if (!response.ok) {
    // we do not need to throw error here as initially when there are no messages yet
    // and we redirect to newly created chat backends will return 404 at first and
    // will write data to database only after the first response is finished
    if (response.status === 404) {
      return;
    }

    throw new Error(
      `Failed to fetch conversation ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}
