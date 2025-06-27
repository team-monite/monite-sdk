import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { AISidebarIconButton } from '@/components/aiAssistant/components/AISidebarIconButton/AISidebarIconButton';
import { AISidebarSkeleton } from '@/components/aiAssistant/components/AISidebarSkeleton/AISidebarSkeleton';
import { SearchChatModal } from '@/components/aiAssistant/components/SearchChatModal/SearchChatModal';
import { Conversation } from '@/components/aiAssistant/types';
import { createConversationGroups } from '@/components/aiAssistant/utils/aiAssistant';
import { Dialog } from '@/components/Dialog';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsMobile } from '@/core/hooks/useMobile';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Folder, PanelLeft, Search, SquarePen } from 'lucide-react';

import type { AIPages } from '../../types';
import { SidebarMenuItem } from '../AISidebarMenuButton/AISidebarMenuButton';
import { AISidebarWrapper } from '../AISidebarWrapper/AISidebarWrapper';

interface AISidebarProps {
  page: AIPages;
  setPage: (page: AIPages) => void;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  setIsNewChat: (isNewChat: boolean) => void;
}

export const AISidebar: FC<AISidebarProps> = ({
  page,
  setPage,
  conversationId,
  setConversationId,
  setIsNewChat,
}) => {
  const isMobile = useIsMobile();
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const [open, setOpen] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = api.ai.fetchConversations.useQuery<{
    data: Conversation[];
  }>();

  const { data: conversations = [] } = data || {};

  const handleOpenSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const conversationGroups = useMemo(() => {
    return createConversationGroups(conversations, i18n);
  }, [conversations, i18n]);

  const handleClickDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSetStartPage = () => {
    setPage('start');
    setConversationId(null);
    setIsNewChat(true);
  };

  const handleSetPromptsPage = () => {
    setPage('prompt');
    setConversationId(null);
    setIsNewChat(true);
  };

  const handleSetChatPage = useCallback((id: string) => {
    setPage('chat');
    setConversationId(id);
    setIsNewChat(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    setOpen(false);
  }, [isMobile]);

  return (
    <AISidebarWrapper open={open}>
      <div
        className={cn(
          'mtw:px-5 mtw:flex mtw:flex-row mtw:items-center mtw:justify-between mtw:-ml-1',
          open && 'mtw:border-b mtw:border-solid mtw:border-gray-200 mtw:pb-6',
          !open && 'mtw:gap-4'
        )}
      >
        <div className="mtw:flex mtw:items-center mtw:gap-3">
          <AISidebarIconButton
            onClick={handleSetStartPage}
            aria-label={t(i18n)`New chat`}
          >
            <SquarePen size={24} />
          </AISidebarIconButton>

          <AISidebarIconButton
            className={cn(!open && 'mtw:hidden')}
            aria-label={t(i18n)`Search chats`}
          >
            <Search onClick={handleClickDialogOpen} size={24} />
          </AISidebarIconButton>

          <Dialog
            closeAfterTransition
            className="mtw:p-0"
            open={isDialogOpen}
            onClose={handleDialogClose}
            sx={{
              padding: '0px',
            }}
          >
            <SearchChatModal
              handleDialogClose={handleDialogClose}
              conversationGroups={conversationGroups}
              handleSetChatPage={handleSetChatPage}
            />
          </Dialog>
        </div>

        <AISidebarIconButton
          onClick={handleOpenSidebar}
          aria-label={t(i18n)`Close AI Sidebar`}
        >
          <PanelLeft size={24} />
        </AISidebarIconButton>
      </div>

      <div
        className={cn(
          'mtw:flex mtw:flex-col mtw:gap-3 mtw:text-sm',
          'mtw:border-b mtw:border-solid mtw:border-gray-200 mtw:pb-4',
          !open && 'mtw:hidden'
        )}
      >
        <h5 className="mtw:px-5 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
          {t(i18n)`Explore`}
        </h5>

        <ul>
          <SidebarMenuItem
            onClick={handleSetPromptsPage}
            isActive={page === 'prompt'}
          >
            <Folder className="mtw:!w-5 mtw:!h-5" size={20} />

            <span>{t(i18n)`Prompt Library`}</span>
          </SidebarMenuItem>
        </ul>
      </div>

      <div
        className={cn(
          'mtw:min-h-0 mtw:overflow-auto',
          'mtw:text-sm mtw:flex mtw:flex-1 mtw:flex-col mtw:gap-4',
          !open && 'mtw:hidden'
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
                      onClick={() => handleSetChatPage(id)}
                      isActive={page === 'chat' && conversationId === id}
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
    </AISidebarWrapper>
  );
};
