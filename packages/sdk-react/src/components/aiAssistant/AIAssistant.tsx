import { AIChat } from '@/components/aiAssistant/components/AIChat/AIChat';
import { AIPrompts } from '@/components/aiAssistant/components/AIPrompts/AIPrompts';
import { AISidebar } from '@/components/aiAssistant/components/AISidebar/AISidebar';
import { AIStartScreen } from '@/components/aiAssistant/components/AIStartScreen/AIStartScreen';
import { ChatInput } from '@/components/aiAssistant/components/ChatInput/ChatInput';
import { AIAssistantChatProvider } from '@/components/aiAssistant/context/AIAssistantChatContext';
import { AIPages } from '@/components/aiAssistant/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { PageHeader } from '@/ui/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import React, { useCallback, useEffect, useState } from 'react';

export const AIAssistant = () => (
  <MoniteScopedProviders>
    <AIAssistantBase />
  </MoniteScopedProviders>
);

const AIAssistantBase = () => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [page, setPage] = useState<AIPages>('start');
  const [isNewChat, setIsNewChat] = useState(true);

  const { mutateAsync: fetchConversationId, isPending } =
    api.ai.postAiConversations.useMutation();

  const getConversationId = useCallback(async () => {
    const { id: conversationId } = await fetchConversationId({});

    if (!conversationId) {
      return;
    }

    setConversationId(conversationId);
  }, [fetchConversationId]);

  const handleStartConversation = useCallback(() => {
    setPage('chat');
  }, []);

  useEffect(() => {
    if (conversationId) {
      return;
    }

    getConversationId();
  }, [conversationId, getConversationId]);

  return (
    <>
      <PageHeader
        className="mtw:border-solid mtw:border-b mtw:border-gray-200 mtw:pb-3 mtw:!mb-0 mtw:px-8"
        title={t(i18n)`AI Assistant`}
      />

      <div className="mtw:flex mtw:grow">
        <div className="mtw:grow mtw:flex mtw:flex-col mtw:gap-5 mtw:pt-3">
          {isPending && (
            <>
              {page === 'start' && <AIStartScreen isConversationIdLoading />}

              {page === 'prompt' && <AIPrompts isConversationIdLoading />}
            </>
          )}

          {!isPending && conversationId && (
            <AIAssistantChatProvider
              isNewChat={isNewChat}
              setIsNewChat={setIsNewChat}
              conversationId={conversationId}
            >
              {page === 'start' && <AIStartScreen />}

              {page === 'chat' && <AIChat />}

              {page === 'prompt' && <AIPrompts />}

              <ChatInput
                isNewChat={isNewChat}
                onStartConversation={handleStartConversation}
              />
            </AIAssistantChatProvider>
          )}
        </div>

        <AISidebar
          page={page}
          setPage={setPage}
          conversationId={conversationId}
          setConversationId={setConversationId}
          setIsNewChat={setIsNewChat}
        />
      </div>
    </>
  );
};
