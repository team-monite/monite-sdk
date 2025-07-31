import { AIMessage } from '@/components';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ChevronRight } from 'lucide-react';
import React, { FC, useMemo } from 'react';

interface ChatHistoryItemProps {
  isEnlarged: boolean;
  id: string;
  conversationId: string | null;
  title: string;
  onSetConversation: (id: string) => void;
  messages: AIMessage[];
}

export const ChatHistoryItem: FC<ChatHistoryItemProps> = ({
  isEnlarged,
  id,
  conversationId,
  title,
  onSetConversation,
  messages,
}) => {
  const { i18n } = useLingui();

  const { content = '' } =
    messages.find(({ role }) => role === 'assistant') ?? {};
  const text = content.replace('\n', '');

  const handleSetConversation = () => onSetConversation(id);

  return (
    <li
      onClick={handleSetConversation}
      className={cn(
        'mtw:px-4 mtw:py-3 mtw:flex mtw:gap-4 mtw:items-center  mtw:justify-between',
        'mtw:hover:bg-sidebar-accent mtw:hover:text-sidebar-accent-foreground mtw:rounded',
        'mtw:truncate mtw:w-full mtw:cursor-pointer',
        isEnlarged &&
          conversationId === id &&
          'mtw:text-sidebar-accent-foreground mtw:bg-sidebar-accent'
      )}
      role="button"
    >
      <div>
        <h5 className="mtw:truncate mtw:font-semibold">
          {title || t(i18n)`Chat ${id}`}
        </h5>

        <p className="mtw:line-clamp-2 mtw:font-normal mtw:whitespace-break-spaces mtw:h-10">
          {text}
        </p>
      </div>

      <ChevronRight className="mtw:shrink-0" size={16} />
    </li>
  );
};
