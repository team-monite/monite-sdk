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
  pathname?: string;
  LocationLink?: LocationLinkType;
}

export const AISidebar: FC<AISidebarProps> = ({ pathname, LocationLink }) => {
  const isMobile = useIsMobile();
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const [open, setOpen] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = api.ai.fetchConversations.useQuery<{
    data: Conversation[];
  }>();

  const { data: conversations = [] } = data || {};

  const Link = LocationLink || MuiLink;

  const handleOpenSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const conversationGroups = useMemo(() => {
    return createConversationGroups(conversations);
  }, [conversations]);

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
          'mtw:px-7 mtw:flex mtw:flex-row mtw:items-center mtw:justify-between mtw:-ml-1',
          open && 'mtw:border-b mtw:border-solid mtw:border-gray-200 mtw:pb-6',
          !open && 'mtw:gap-4'
        )}
      >
        <div className="mtw:flex mtw:items-center mtw:gap-3">
          <AISidebarIconButton aria-label={t(i18n)`New chat`}>
            <Link href={'/ai-assistant'}>
              <SquarePen size={24} />
            </Link>
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
              LocationLink={LocationLink}
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
        <h5 className="mtw:px-7 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
          {t(i18n)`Explore`}
        </h5>

        <ul>
          <SidebarMenuItem isActive={pathname === '/assistant/prompts'}>
            <Link
              className="mtw:flex mtw:items-center mtw:gap-2"
              href={'/ai-assistant/prompts'}
            >
              <Folder className="mtw:!w-5 mtw:!h-5" size={20} />

              <span>{t(i18n)`Prompt Library`}</span>
            </Link>
          </SidebarMenuItem>
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

        {conversationGroups.map(({ title, conversations }) => {
          return (
            <div
              key={title}
              className="mtw:flex mtw:flex-col mtw:gap-3 mtw:overflow-y-auto"
            >
              <h5 className="mtw:px-7 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
                {title}
              </h5>

              <ul className="mtw:flex mtw:flex-col mtw:items-start">
                {conversations.map(({ title, id }) => (
                  <SidebarMenuItem
                    isActive={pathname?.includes(`/ai-assistant/${id}`)}
                    key={id}
                  >
                    <Link
                      className="mtw:truncate mtw:w-full mtw:inline-block"
                      href={`/ai-assistant/${id}`}
                    >
                      <span key={id} className="mtw:truncate">
                        {title || t(i18n)`Chat ${id}`}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </AISidebarWrapper>
  );
};
