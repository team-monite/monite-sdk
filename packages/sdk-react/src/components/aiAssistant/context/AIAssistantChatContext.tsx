import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { apiVersion } from '@/api/api-version';
import { ConversationHistory, useAIAssistantOptions } from '@/components';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { type UseChatHelpers } from '@ai-sdk/react';

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
  const { apiUrl, fetchToken, api, queryClient } = useMoniteContext();

  const { data: conversation } =
    api.ai.getAiConversationsId.useQuery<ConversationHistory>(
      {
        path: { conversation_id: conversationId },
      },
      { enabled: !isNewChat }
    );

  const { messages } = conversation || {};

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
          Authorization: `${tokenType} ${accessToken}`,
        },
      });
    },
    initialMessages: messages,
    onFinish: async () => {
      if (!isNewChat) {
        return;
      }

      await api.ai.getAiConversations.invalidateQueries(queryClient);
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
