import React, { memo } from 'react';
import { type FC } from 'react';

import { LoaderDots } from '@/components/aiAssistant/components/LoaderDots/LoaderDots';
import { cn } from '@/ui/lib/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { splitByTags } from '../../utils/aiAssistant';
import { AssistantButtons } from '../AssistantButtons/AssistantButtons';
import { AssistantMessageContent } from '../AssistantMessageContent/AssistantMessageContent';
import { AssistantMessageWrapper } from '../AssistantMessageWrapper/AssistantMessageWrapper';

interface AssistantMessageProps {
  content: string;
  id: string;
  isLast: boolean;
  isStreaming: boolean;
  isError?: boolean;
  isSubmitted?: boolean;
}

const ChatMessageContainer: FC<AssistantMessageProps> = ({
  content,
  id,
  isLast,
  isStreaming,
  isError = false,
  isSubmitted = false,
}) => {
  const { i18n } = useLingui();

  const parts = splitByTags(content);
  const showActionButtons = !isStreaming || (isStreaming && !isLast);
  const isAnswerLoading = isSubmitted && isLast;
  const textPart = parts
    .filter(({ type }) => type === 'text')
    .map(({ content }) => content)
    .join('/n');

  if (isAnswerLoading) {
    return (
      <AssistantMessageWrapper>
        <LoaderDots />
      </AssistantMessageWrapper>
    );
  }

  if (isError) {
    return (
      <AssistantMessageWrapper>
        <div
          className={cn(
            'mtw:border mtw:border-solid mtw:border-danger-40 mtw:bg-danger-95',
            'mtw:rounded-lg mtw:px-4 mtw:py-3 mtw:mb-4'
          )}
        >
          {t(
            i18n
          )`Something went wrong. If this issue persists please contact us through
            the chat icon in the bottom right or email us at help@getargon.ai`}
        </div>
      </AssistantMessageWrapper>
    );
  }

  return (
    <AssistantMessageWrapper>
      <div className="mtw:flex mtw:flex-col mtw:gap-4 mtw:overflow-x-auto">
        <div
          className={cn(
            'mtw:transition-[height] mtw:ease-in-out mtw:duration-3000',
            'mtw:h-full mtw:overflow-y-hidden',
            isLast && isStreaming && 'mtw:h-0'
          )}
        >
          {parts.map((part) => {
            const { id } = part;

            return <AssistantMessageContent key={id} part={part} />;
          })}
        </div>

        <AssistantButtons
          showActionButtons={showActionButtons}
          id={id}
          content={textPart}
        />
      </div>
    </AssistantMessageWrapper>
  );
};

export const AssistantMessage = memo(ChatMessageContainer);
