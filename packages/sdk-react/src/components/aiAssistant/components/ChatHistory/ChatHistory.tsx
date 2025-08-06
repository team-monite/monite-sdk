import { ChatHistoryItem } from '@/components/aiAssistant/components/ChatHistoryItem/ChatHistoryItem';
import { ChatHistorySkeleton } from '@/components/aiAssistant/components/ChatHistorySkeleton/ChatHistorySkeleton';
import { NoHistoryView } from '@/components/aiAssistant/components/NoHistoryView/NoHistoryView';
import { AIView, Conversation } from '@/components/aiAssistant/types';
import { createConversationGroups } from '@/components/aiAssistant/utils/aiAssistant';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { cn } from '@/ui/lib/utils';
import { useLingui } from '@lingui/react';
import React, { FC, useCallback, useMemo } from 'react';

interface ChatHistoryProps {
  conversationId: string | null;
  setConversationId: (id: string) => void;
  setIsNewChat: (isNewChat: boolean) => void;
  setView: (view: AIView) => void;
  isEnlarged: boolean;
}

export const ChatHistory: FC<ChatHistoryProps> = ({
  conversationId,
  setConversationId,
  setIsNewChat,
  setView,
  isEnlarged,
}) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { data, isLoading } = api.ai.getAiConversations.useQuery<{
    data: Conversation[];
  }>();

  const { data: conversations = [] } = data || {};

  const conversationGroups = useMemo(() => {
    return createConversationGroups(conversations, i18n);
  }, [conversations, i18n]);

  const onSetConversation = useCallback((id: string) => {
    setView('chat');
    setConversationId(id);
    setIsNewChat(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoading && !conversations.length) {
    return (
      <NoHistoryView
        isEnlarged={isEnlarged}
        setView={setView}
        setIsNewChat={setIsNewChat}
        setConversationId={setConversationId}
      />
    );
  }

  return (
    <div
      className={cn(
        'mtw:min-h-0 mtw:h-full mtw:overflow-auto',
        'mtw:text-sm mtw:flex mtw:flex-1 mtw:flex-col mtw:gap-4'
      )}
    >
      {isLoading && <ChatHistorySkeleton />}

      {conversationGroups.map(({ title, conversations }) => {
        return (
          <div key={title} className="mtw:flex mtw:flex-col mtw:gap-2 mtw:p-2">
            <h5 className="mtw:px-4 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
              {title}
            </h5>

            <ul className="mtw:flex mtw:flex-col mtw:items-start">
              {conversations.map(({ title, id, messages }) => {
                return (
                  <ChatHistoryItem
                    key={id}
                    isEnlarged={isEnlarged}
                    id={id}
                    conversationId={conversationId}
                    title={title}
                    onSetConversation={onSetConversation}
                    messages={messages}
                  />
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
