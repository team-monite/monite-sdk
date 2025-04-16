import React, {
  type FC,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { useDebounceCallback } from '@/core/hooks';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Close } from '@mui/icons-material';
import {
  DialogContent,
  IconButton,
  Input,
  Link as MuiLink,
} from '@mui/material';

import { Conversation, LocationLinkType } from '../../types';
import { createConversationGroups } from '../../utils/aiAssistant';

interface ConversationGroups {
  title: string;
  conversations: Conversation[];
}

interface SearchChatModalProps {
  conversationGroups: ConversationGroups[];
  handleDialogClose: () => void;
  LocationLink?: LocationLinkType;
}

export const SearchChatModal: FC<SearchChatModalProps> = ({
  conversationGroups,
  handleDialogClose,
  LocationLink,
}) => {
  const [_, startTransition] = useTransition();
  const { i18n } = useLingui();

  const [search, setSearch] = useState('');
  const [groups, setGroups] =
    useState<ConversationGroups[]>(conversationGroups);

  const { api } = useMoniteContext();

  const { data } = api.ai.fetchConversations.useQuery<{ data: Conversation[] }>(
    {
      query: {
        title__icontains: search,
      },
    }
  );

  const { data: conversations = [] } = data || {};
  const Link = LocationLink || MuiLink;

  const setSearchValue = useDebounceCallback(async (value: string) => {
    setSearch(value);
  }, 1000);

  const onSearchChange = useCallback(setSearchValue, [setSearchValue]);

  useEffect(() => {
    if (!conversations.length) {
      return;
    }

    startTransition(() => {
      const conversationGroups = createConversationGroups(conversations);

      setGroups(conversationGroups);
    });
  }, [conversations]);

  return (
    <>
      <IconButton
        aria-label="close"
        onClick={handleDialogClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <Close className="mtw:!text-xl mtw:!text-gray-700" />
      </IconButton>

      <DialogContent className="mtw:!p-0">
        <Input
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            'mtw:px-2 mtw:py-4 mtw:w-[calc(100%-50px)] mtw:border-none mtw:ring-0 mtw:ring-offset-0',
            'mtw:focus-visible:ring-0 mtw:focus-visible:ring-offset-0 '
          )}
          placeholder={t(i18n)`Search chats...`}
        />

        <div
          className={cn(
            'mtw:pt-6 mtw:px-1 mtw:mb-6 mtw:w-[32rem] mtw:h-[300px] mtw:overflow-y-auto',
            'mtw:border-t mtw:border-t-border mtw:border-solid'
          )}
        >
          {groups.map(({ title, conversations }) => {
            return (
              <div className="mtw:flex mtw:flex-col mtw:gap-3" key={title}>
                <h5 className="mtw:px-5 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
                  {title}
                </h5>

                <div className="mtw:flex mtw:flex-col mtw:gap-1">
                  {conversations.map(({ title, id }) => (
                    <Link
                      key={id}
                      className={cn(
                        'mtw:truncate mtw:px-5 mtw:py-2 mtw:text-sm mtw:rounded',
                        'mtw:hover:text-sidebar-accent-foreground mtw:hover:bg-sidebar-accent'
                      )}
                      href={`/ai-assistant/${id}`}
                    >
                      {title || t(i18n)`Chat ${id}`}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </>
  );
};
