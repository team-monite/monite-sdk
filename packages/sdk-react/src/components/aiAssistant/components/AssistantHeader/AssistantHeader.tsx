import { AIView } from '@/components';
import { AssistantIconButton } from '@/components/aiAssistant/components/AssistantIconButton/AssistantIconButton';
import { AssistantLogo } from '@/components/aiAssistant/components/AssistantLogo/AssistantLogo';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Maximize2, Menu, Minimize2, SquarePen } from 'lucide-react';
import { FC } from 'react';

interface AssistantHeaderProps {
  isEnlarged: boolean;
  setIsEnlarged: (cb: (isEnlarged: boolean) => boolean) => void;
  view: AIView;
  setView: (view: AIView) => void;
  setConversationId: (conversationId: string) => void;
  setIsNewChat: (isNewChat: boolean) => void;
}

export const AssistantHeader: FC<AssistantHeaderProps> = ({
  isEnlarged,
  setIsEnlarged,
  view,
  setView,
  setConversationId,
  setIsNewChat,
}) => {
  const { i18n } = useLingui();

  const showChatHeader = view === 'start' || view === 'chat';

  const handleSetHistoryView = () => {
    setView('history');
  };

  const handleStartChat = () => {
    setConversationId('');
    setView('start');
    setIsNewChat(true);
  };

  const handleChangeEnlarge = () => {
    if (view === 'history') {
      setView('start');
    }

    setIsEnlarged((prev) => !prev);
  };

  return (
    <div
      className={cn(
        'mtw:flex mtw:items-center mtw:justify-between mtw:relative',
        'mtw:border-b mtw:border-solid mtw:border-border mtw:p-4',
        view === 'history' && 'mtw:justify-end'
      )}
    >
      {showChatHeader && (
        <div className="mtw:gap-2 mtw:flex mtw:items-center">
          {!isEnlarged && (
            <AssistantIconButton
              onClick={handleSetHistoryView}
              aria-label={t(i18n)`Menu`}
            >
              <Menu className="mtw:size-4 mtw:text-gray-500" />
            </AssistantIconButton>
          )}

          <div className="mtw:flex mtw:items-center mtw:gap-1.5">
            <div className="mtw:flex mtw:items-center mtw:gap-3">
              <AssistantLogo sx={{ fontSize: 28 }} />

              <h3 className="mtw:text-base mtw:font-semibold">
                {t(i18n)`AI Assistant`}
              </h3>
            </div>

            <span
              className={cn(
                'mtw:border mtw:border-solid mtw:border-border',
                'mtw:rounded-md mtw:text-xs mtw:py-0.5 mtw:px-2'
              )}
            >
              {t(i18n)`Beta`}
            </span>
          </div>
        </div>
      )}

      {view === 'history' && (
        <h3
          className={cn(
            'mtw:text-base mtw:font-semibold',
            'mtw:absolute mtw:-translate-1/2 mtw:top-1/2 mtw:left-1/2'
          )}
        >
          {t(i18n)`Chat history`}
        </h3>
      )}

      <div className="mtw:flex mtw:items-center">
        <AssistantIconButton
          onClick={handleChangeEnlarge}
          aria-label={isEnlarged ? t(i18n)`Minimize` : t(i18n)`Maximize`}
        >
          {isEnlarged ? (
            <Minimize2 className="mtw:size-4 mtw:text-gray-500" />
          ) : (
            <Maximize2 className="mtw:size-4 mtw:text-gray-500" />
          )}
        </AssistantIconButton>

        <AssistantIconButton
          onClick={handleStartChat}
          aria-label={t(i18n)`New chat`}
        >
          <SquarePen className="mtw:size-4 mtw:text-gray-500" />
        </AssistantIconButton>
      </div>
    </div>
  );
};
