import { SidebarMenuItem } from '../AISidebarMenuButton/AISidebarMenuButton';
import { AISidebarSkeleton } from '@/components/aiAssistant/components/AISidebarSkeleton/AISidebarSkeleton';
import { AIView, Conversation } from '@/components/aiAssistant/types';
import { createConversationGroups } from '@/components/aiAssistant/utils/aiAssistant';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React, { FC, useCallback, useMemo } from 'react';

interface AIChatHistoryProps {
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  setIsNewChat: (isNewChat: boolean) => void;
  setView: (view: AIView) => void;
  isEnlarged: boolean;
}

export const AIChatHistory: FC<AIChatHistoryProps> = ({
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

  const handleSetConversation = useCallback((id: string) => {
    setView('chat');
    setConversationId(id);
    setIsNewChat(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        'mtw:min-h-0 mtw:h-full mtw:overflow-auto',
        'mtw:text-sm mtw:flex mtw:flex-1 mtw:flex-col mtw:gap-4'
      )}
    >
      {isLoading && <AISidebarSkeleton />}

      {conversationGroups.map(({ title, conversations }) => {
        return (
          <div key={title} className="mtw:flex mtw:flex-col mtw:gap-3">
            <h5 className="mtw:px-5 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
              {title}
            </h5>

            <ul className="mtw:flex mtw:flex-col mtw:items-start">
              {conversations.map(({ title, id }) => {
                return (
                  <SidebarMenuItem
                    className="mtw:truncate mtw:w-full mtw:inline-block"
                    onClick={() => handleSetConversation(id)}
                    isActive={isEnlarged && conversationId === id}
                    key={id}
                  >
                    <span key={id} className="mtw:truncate">
                      {title || t(i18n)`Chat ${id}`}
                    </span>
                  </SidebarMenuItem>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
