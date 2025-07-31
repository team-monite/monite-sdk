import { AISidebarWrapper } from './components/AISidebarWrapper/AISidebarWrapper';
import { AIChat } from '@/components/aiAssistant/components/AIChat/AIChat';
import { AIChatHistory } from '@/components/aiAssistant/components/AIChatHistory/AIChatHistory';
import { AssistantHeader } from '@/components/aiAssistant/components/AssistantHeader/AssistantHeader';
import { AssistantLogo } from '@/components/aiAssistant/components/AssistantLogo/AssistantLogo';
import { ChatInput } from '@/components/aiAssistant/components/ChatInput/ChatInput';
import { AIAssistantChatProvider } from '@/components/aiAssistant/context/AIAssistantChatContext';
import { AIView } from '@/components/aiAssistant/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useIsMobile } from '@/core/hooks';
import { Button } from '@/ui/components/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/components/popover';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ChevronDownIcon } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export const AIAssistant = () => (
  <MoniteScopedProviders>
    <AIAssistantBase />
  </MoniteScopedProviders>
);

const AIAssistantBase = () => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const isMobile = useIsMobile();

  const [conversationId, setConversationId] = useState<string | null>('');
  const [view, setView] = useState<AIView>('start');
  const [isNewChat, setIsNewChat] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const withOverlay = open && isEnlarged;

  const { mutateAsync: fetchConversationId } =
    api.ai.postAiConversations.useMutation();

  const getConversationId = useCallback(async () => {
    const { id: conversationId } = await fetchConversationId({});

    if (!conversationId) {
      return;
    }

    setConversationId(conversationId);
  }, [fetchConversationId]);

  const handleStartConversation = useCallback(() => {
    setView('chat');
  }, []);

  useEffect(() => {
    if (conversationId) {
      return;
    }

    getConversationId();
  }, [conversationId, getConversationId]);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'mtw:absolute mtw:bottom-0 mtw:right-6 mtw:bg-black',
            'mtw:rounded-t-xl  mtw:text-white mtw:hover:bg-black  mtw:rounded-b-none'
          )}
          variant="default"
          size="lg"
        >
          {open ? (
            <ChevronDownIcon className="size-6" size={24} />
          ) : (
            <>
              <AssistantLogo sx={{ fontSize: 28 }} />
              <span> {t(i18n)`Ask AI`}</span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className={cn(
          'mtw:rounded-3xl mtw:shadow-xl mtw:p-0 mtw:border-border',
          'mtw:flex mtw:w-[400px] mtw:h-[640px] mtw:!z-[1205]',
          'mtw:transition-[width,height] mtw:duration-150 mtw:ease-linear',
          isEnlarged && 'mtw:w-[calc(100vw-50px)] mtw:h-[calc(100vh-64px)]'
        )}
      >
        {isEnlarged && !isMobile && (
          <AISidebarWrapper>
            <AIChatHistory
              isEnlarged
              conversationId={conversationId}
              setConversationId={setConversationId}
              setIsNewChat={setIsNewChat}
              setView={setView}
            />
          </AISidebarWrapper>
        )}

        <div className="mtw:grow mtw:flex mtw:flex-col mtw:gap-6 mtw:w-full">
          {conversationId && (
            <AIAssistantChatProvider
              isNewChat={isNewChat}
              setIsNewChat={setIsNewChat}
              conversationId={conversationId}
            >
              <AssistantHeader
                isEnlarged={isEnlarged}
                setIsEnlarged={setIsEnlarged}
                view={view}
                setView={setView}
                setConversationId={setConversationId}
                setIsNewChat={setIsNewChat}
              />

              {view === 'chat' && <AIChat isEnlarged={isEnlarged} />}

              {view === 'history' && (
                <AIChatHistory
                  conversationId={conversationId}
                  setConversationId={setConversationId}
                  setIsNewChat={setIsNewChat}
                  setView={setView}
                  isEnlarged={false}
                />
              )}

              <ChatInput
                view={view}
                isEnlarged={isEnlarged}
                isNewChat={isNewChat}
                onStartConversation={handleStartConversation}
              />
            </AIAssistantChatProvider>
          )}
        </div>
      </PopoverContent>

      {withOverlay && (
        <div className="mtw:absolute mtw:w-screen mtw:h-screen mtw:bg-black mtw:opacity-30 mtw:z-[1204]" />
      )}
    </Popover>
  );
};
