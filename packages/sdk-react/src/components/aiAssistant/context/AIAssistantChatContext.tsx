import { apiVersion } from '@/api/api-version';
import { useAIAssistantOptions } from '@/components/aiAssistant/hooks/useAIAssistantOptions';
import { ConversationHistory } from '@/components/aiAssistant/types';
import { sanitizeEntityName } from '@/components/aiAssistant/utils/aiAssistant';
import { getEntityName } from '@/components/onboarding/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMyEntity } from '@/core/queries';
import { type UseChatHelpers } from '@ai-sdk/react';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

export interface ChatProviderProps extends PropsWithChildren {
  isNewChat: boolean;
  setIsNewChat: (isNewChat: boolean) => void;
  conversationId: string;
}

const AIAssistantChatContext = createContext<UseChatHelpers | undefined>(
  undefined
);

export function useAIAssistantChat() {
  const context = useContext(AIAssistantChatContext);

  if (!context) {
    throw new Error('useAIAssistantChat must be used within a ChatProvider');
  }

  return context;
}

export const AIAssistantChatProvider = ({
  children,
  conversationId,
  isNewChat,
  setIsNewChat,
}: ChatProviderProps) => {
  const { apiUrl, fetchToken, api, queryClient, entityId } = useMoniteContext();
  const { data: entity } = useMyEntity();

  const { data: conversation } =
    api.ai.getAiConversationsId.useQuery<ConversationHistory>(
      {
        path: { conversation_id: conversationId },
      },
      { enabled: !isNewChat }
    );

  const { messages } = conversation || {};

  const entityName = useMemo(() => {
    const name = entity ? getEntityName(entity) : '';
    return sanitizeEntityName(name);
  }, [entity]);

  const values = useAIAssistantOptions({
    id: conversationId,
    fetch: async (_, init) => {
      const token = await fetchToken();
      const { access_token: accessToken, token_type: tokenType } = token;

      return fetch(`${apiUrl}/ai/conversations/${conversationId}/messages`, {
        ...(init || {}),
        method: 'POST',
        headers: {
          ...init?.headers,
          'x-monite-version': apiVersion,
          'x-monite-entity-id': entityId,
          'x-entity-name': entityName,
          Authorization: `${tokenType} ${accessToken}`,
        },
      });
    },
    initialMessages: messages,
    onFinish: async () => {
      if (!isNewChat) {
        return;
      }

      await api.ai.getAiConversationsId.invalidateQueries(queryClient);
      setIsNewChat(false);
    },
  });

  const value = useMemo(() => values, [values]);

  return (
    <AIAssistantChatContext.Provider value={value}>
      {children}
    </AIAssistantChatContext.Provider>
  );
};
