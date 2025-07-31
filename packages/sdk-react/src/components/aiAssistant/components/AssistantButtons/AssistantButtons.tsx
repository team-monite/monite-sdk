import { Feedback } from '../../types';
import { removeTags } from '../../utils/aiAssistant';
import { AIButtonTooltip } from '../AIButtonTooltip/AIButtonTooltip';
import { FeedbackForm } from '../FeedbackForm/FeedbackForm';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import copy from 'copy-to-clipboard';
import { Copy, ThumbsDown, ThumbsUp } from 'lucide-react';
import * as React from 'react';
import { type FC, type MouseEvent, useEffect, useRef, useState } from 'react';

interface AssistantButtonsProps {
  showActionButtons: boolean;
  id: string;
  content: string;
}

export const AssistantButtons: FC<AssistantButtonsProps> = ({
  showActionButtons,
  id,
  content,
}) => {
  const { i18n } = useLingui();
  const buttonsContainerRef = useRef<HTMLDivElement>(null);

  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const { api } = useMoniteContext();

  const { mutate: postFeedback } = api.ai.postAiMessageFeedbacks.useMutation();

  const handleCopyToClipboard = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (typeof content === 'undefined') {
      return;
    }

    const text = removeTags(content);

    copy(text);
    setIsCopied(true);
  };

  const handleGiveFeedback = (feedback: Feedback) => {
    postFeedback({
      body: {
        message_id: id,
        action: feedback,
      },
    });
  };

  const handleLike = () => {
    handleGiveFeedback('like');
    setFeedback('like');
  };

  const handleDislike = () => {
    handleGiveFeedback('dislike');
    setFeedback('dislike');
    setIsFeedbackFormOpen(true);
  };

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isCopied]);

  useEffect(() => {
    if (!isFeedbackFormOpen) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!buttonsContainerRef.current) {
        return;
      }

      buttonsContainerRef.current.scrollIntoView();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isFeedbackFormOpen]);

  return (
    <>
      <div
        ref={buttonsContainerRef}
        className={cn(
          'mtw:flex mtw:items-center mtw:gap-2.5 mtw:invisible',
          'mtw:opacity-0 mtw:transition-[opacity] mtw:duration-300 mtw:delay-2500',
          showActionButtons && 'mtw:visible mtw:opacity-100'
        )}
      >
        <AIButtonTooltip
          icon={<Copy size={16} className="mtw:text-gray-500" />}
          onClick={handleCopyToClipboard}
          ariaLabel={t(i18n)`copy text`}
        >
          <span>{isCopied ? t(i18n)`Copied!` : t(i18n)`Copy`}</span>
        </AIButtonTooltip>

        {feedback !== 'dislike' && (
          <AIButtonTooltip
            icon={
              <ThumbsUp
                size={16}
                className={cn(
                  ' mtw:text-gray-500',
                  feedback === 'like' && 'mtw:fill-gray-500'
                )}
              />
            }
            onClick={handleLike}
            ariaLabel={t(i18n)`thumb up`}
          >
            <span>{t(i18n)`Good response`}</span>
          </AIButtonTooltip>
        )}

        {feedback !== 'like' && (
          <AIButtonTooltip
            icon={
              <ThumbsDown
                size={16}
                className={cn(
                  'mtw:text-gray-500',
                  feedback === 'dislike' && 'mtw:fill-gray-500'
                )}
              />
            }
            onClick={handleDislike}
            ariaLabel={t(i18n)`thumb down`}
          >
            <span>{t(i18n)`Bad response`}</span>
          </AIButtonTooltip>
        )}
      </div>

      <div
        className={cn(
          'mtw:transition-[height] mtw:ease-in-out mtw:duration-1000 mtw:mt-4 mtw:h-[320px]',
          !isFeedbackFormOpen && 'mtw:h-0 mtw:overflow-y-hidden'
        )}
      >
        <FeedbackForm id={id} setIsFeedbackFormOpen={setIsFeedbackFormOpen} />
      </div>
    </>
  );
};
