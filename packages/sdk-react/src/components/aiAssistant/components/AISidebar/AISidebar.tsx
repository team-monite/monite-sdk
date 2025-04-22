import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Dialog, LocationLinkType } from '@/components';
import { AISidebarIconButton } from '@/components/aiAssistant/components/AISidebarIconButton/AISidebarIconButton';
import { AISidebarSkeleton } from '@/components/aiAssistant/components/AISidebarSkeleton/AISidebarSkeleton';
import { SearchChatModal } from '@/components/aiAssistant/components/SearchChatModal/SearchChatModal';
import { Conversation } from '@/components/aiAssistant/types';
import { createConversationGroups } from '@/components/aiAssistant/utils/aiAssistant';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useIsMobile } from '@/core/hooks/useMobile';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Link as MuiLink } from '@mui/material';

import { Folder, PanelLeft, Search, SquarePen } from 'lucide-react';

import { SidebarMenuItem } from '../AISidebarMenuButton/AISidebarMenuButton';
import { AISidebarWrapper } from '../AISidebarWrapper/AISidebarWrapper';

interface AISidebarProps {
  LocationLink?: LocationLinkType;
  linkProps: {
    pathname?: string;
    startPage?: {
      isVisible: boolean;
      href: string;
    };
    promptsPage?: {
      isVisible: boolean;
      href: string;
    };
    chatPage?: {
      isVisible: boolean;
      href: string;
    };
  };
}

export const AISidebar: FC<AISidebarProps> = ({ LocationLink, linkProps }) => {
  const isMobile = useIsMobile();
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const [open, setOpen] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = api.ai.fetchConversations.useQuery<{
    data: Conversation[];
  }>();

  const { data: conversations = [] } = data || {};

  const { pathname, startPage, promptsPage, chatPage } = linkProps;
  const { href: startPageHref, isVisible: isStartPageVisible } =
    startPage || {};
  const { href: promptsPageHref, isVisible: isPromptsPageVisible } =
    promptsPage || {};
  const { href: chatPageHref, isVisible: isChatPageVisible } = chatPage || {};

  const Link = LocationLink || MuiLink;

  const handleOpenSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const conversationGroups = useMemo(() => {
    return createConversationGroups(conversations, i18n);
  }, [conversations, i18n]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    setOpen(false);
  }, [isMobile]);

  const handleClickDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

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
          {startPageHref && isStartPageVisible && (
            <AISidebarIconButton aria-label={t(i18n)`New chat`}>
              <Link href={startPageHref}>
                <SquarePen size={24} />
              </Link>
            </AISidebarIconButton>
          )}

          <AISidebarIconButton
            className={cn(!open && 'mtw:hidden')}
            aria-label={t(i18n)`Search chats`}
          >
            <Search onClick={handleClickDialogOpen} size={24} />
          </AISidebarIconButton>

          {chatPageHref && (
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
                LocationLink={LocationLink}
                chatPageHref={chatPageHref}
              />
            </Dialog>
          )}
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
          {promptsPageHref && isPromptsPageVisible && (
            <SidebarMenuItem isActive={pathname === promptsPageHref}>
              <Link
                className="mtw:flex mtw:items-center mtw:gap-2"
                href={promptsPageHref}
              >
                <Folder className="mtw:!w-5 mtw:!h-5" size={20} />

                <span>{t(i18n)`Prompt Library`}</span>
              </Link>
            </SidebarMenuItem>
          )}
        </ul>
      </div>

      <div
        className={cn(
          'mtw:min-h-0 mtw:overflow-auto',
          'mtw:text-sm mtw:flex mtw:flex-1 mtw:flex-col mtw:gap-2',
          !open && 'mtw:hidden'
        )}
      >
        {isLoading && <AISidebarSkeleton />}

        {chatPageHref &&
          isChatPageVisible &&
          conversationGroups.map(({ title, conversations }) => {
            return (
              <div key={title} className="mtw:flex mtw:flex-col mtw:gap-3">
                <h5 className="mtw:px-5 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
                  {title}
                </h5>

                <ul className="mtw:flex mtw:flex-col mtw:items-start">
                  {conversations.map(({ title, id }) => {
                    const href = `${chatPageHref}/${id}`;

                    return (
                      <SidebarMenuItem
                        isActive={pathname?.includes(href)}
                        key={id}
                      >
                        <Link
                          className="mtw:truncate mtw:w-full mtw:inline-block"
                          href={href}
                        >
                          <span key={id} className="mtw:truncate">
                            {title || t(i18n)`Chat ${id}`}
                          </span>
                        </Link>
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
