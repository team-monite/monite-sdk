import { type FC, memo } from 'react';

import { AIButtonTooltip } from '@/components/aiAssistant/components/AIButtonTooltip/AIButtonTooltip';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import clsx from 'clsx';
import { BookmarkPlus } from 'lucide-react';

interface ChatMessageContainerProps {
  content: string;
}

const ChatMessageContainer: FC<ChatMessageContainerProps> = ({ content }) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { mutateAsync: savePrompt } = api.ai.savePrompt.useMutation();

  const handleSavePrompt = async () => {
    await savePrompt({ body: { content } });
  };

  return (
    <div className="mtw:flex mtw:gap-3 mtw:items-center">
      <div
        className={clsx([
          'mtw:flex mtw:flex-col mtw:gap-4',
          'mtw:bg-primary-85 mtw:rounded-xl mtw:px-4 mtw:py-3',
        ])}
      >
        {content}
      </div>

      <AIButtonTooltip
        icon={
          <BookmarkPlus className="mtw:h-4 mtw:text-primary-50" size={16} />
        }
        onClick={handleSavePrompt}
        ariaLabel={t(i18n)`Add to prompts`}
      >
        <span>{t(i18n)`Save to prompt library`}</span>
      </AIButtonTooltip>
    </div>
  );
};

export const UserMessage = memo(ChatMessageContainer);
