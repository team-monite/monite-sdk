import { AIView } from '@/components';
import { AssistantLogo } from '@/components/aiAssistant/components/AssistantLogo/AssistantLogo';
import { Button } from '@/ui/components/button';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { SquarePen } from 'lucide-react';
import React, { FC } from 'react';

interface NoHistoryViewProps {
  isEnlarged: boolean;
  setConversationId: (conversationId: string) => void;
  setView: (view: AIView) => void;
  setIsNewChat: (isNewChat: boolean) => void;
}

export const NoHistoryView: FC<NoHistoryViewProps> = ({
  isEnlarged,
  setView,
  setConversationId,
  setIsNewChat,
}) => {
  const { i18n } = useLingui();

  const handleStartChat = () => {
    setConversationId('');
    setView('start');
    setIsNewChat(true);
  };

  if (isEnlarged) {
    return (
      <div
        onClick={handleStartChat}
        className="mtw:text-sm mtw:p-2 mtw:flex mtw:flex-col mtw:gap-2"
      >
        <h5 className="mtw:px-4 mtw:text-sm mtw:text-gray-500 mtw:font-normal">
          {t(i18n)`This month`}
        </h5>

        <div
          role="button"
          className={cn(
            'mtw:w-full mtw:px-4 mtw:py-3 mtw:rounded',
            'mtw:bg-sidebar-accent mtw:text-sidebar-accent-foreground',
            'mtw:truncate mtw:cursor-pointer'
          )}
        >
          <h5 className="mtw:truncate mtw:font-semibold">
            {t(i18n)`New Chat`}
          </h5>

          <p className="mtw:font-normal">{t(i18n)`Ask AI...`}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mtw:flex mtw:flex-col mtw:items-center mtw:h-full mtw:py-6 mtw:px-4">
      <div className="mtw:flex mtw:flex-col mtw:justify-center mtw:items-center mtw:grow">
        <div className="mtw:flex mtw:flex-col mtw:gap-4 mtw:items-center mtw:-mt-20">
          <AssistantLogo sx={{ fontSize: 48 }} />

          <div className="mtw:flex mtw:flex-col mtw:gap-2">
            <h3 className="mtw:text-center mtw:font-semibold mtw:text-base">{t(
              i18n
            )`You have no chats yet`}</h3>

            <p className="mtw:text-center mtw:text-sm">{t(
              i18n
            )`Your AI Assistant chat history will be shown here`}</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleStartChat}
        className="mtw:mt-auto mtw:w-fit mtw:bg-black mtw:hover:bg-black mtw:!px-8 mtw:!py-2"
      >
        <SquarePen className="mtw:size-4 mtw:text-white" />

        {t(i18n)`New Chat`}
      </Button>
    </div>
  );
};
