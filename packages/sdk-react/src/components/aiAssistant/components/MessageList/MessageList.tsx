import { useCallback, useEffect, useRef } from 'react';

import { useIsMobile } from '@/core/hooks/useMobile';
import { cn } from '@/ui/lib/utils';
import type { UIMessage } from '@ai-sdk/ui-utils';
import { useVirtualizer } from '@tanstack/react-virtual';

import clsx from 'clsx';

import { useAIAssistantChat } from '../../context/AIAssistantChatContext';
import { getChatTotalHeight } from '../../utils/aiAssistant';
import { AssistantMessage } from '../AssistantMessage/AssistantMessage';
import { ChatMessage } from '../ChatMessage/ChatMessage';

const POSSIBLE_ITEM_SIZE = 100;
const MESSAGE_ID = 'message-id';
const MOCK_MESSAGE = {
  content: '',
  id: MESSAGE_ID,
  role: 'assistant',
  parts: [],
} as UIMessage;

export const MessageList = () => {
  const parentRef = useRef<null | HTMLDivElement>(null);
  const isReady = useRef(false);

  const { messages, status, setMessages } = useAIAssistantChat();
  const isMobile = useIsMobile();

  const isSubmitted = status === 'submitted';
  const isStreaming = status === 'streaming';
  const isError = status === 'error';

  const virtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: messages.length,
    estimateSize: () => POSSIBLE_ITEM_SIZE,
    overscan: 25,
    getItemKey: useCallback((index: number) => messages[index]?.id, [messages]),
  });
  const virtualMessages = virtualizer.getVirtualItems();

  const height = virtualizer.getTotalSize();
  const totalHeight = getChatTotalHeight({
    isMobile,
    isSubmitted,
    isError,
    height,
  });
  const messagesLength = messages.length;

  useEffect(() => {
    if (!height) {
      return;
    }

    requestAnimationFrame(() => {
      virtualizer.scrollToIndex(messagesLength - 1, {
        align: isReady.current ? 'start' : 'end',
        behavior: isReady.current ? 'smooth' : undefined,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }

    isReady.current = true;
    virtualizer.scrollToIndex(messages.length - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  useEffect(() => {
    if (!isStreaming) {
      return;
    }

    setMessages((prev) => [...prev, MOCK_MESSAGE]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStreaming]);

  return (
    <div
      ref={parentRef}
      className="mtw:h-[calc(100vh-250px)] mtw:w-full mtw:overflow-y-auto mtw:mt-3"
    >
      <div
        className={cn(
          'mtw:max-w-sm mtw:sm:max-w-md mtw:md:max-w-lg mtw:lg:max-w-2xl mtw:xl:max-w-3xl',
          'mtw:mx-auto mtw:w-full'
        )}
      >
        <div
          className="mtw:relative mtw:flex mtw:w-full mtw:flex-col"
          style={{
            height: totalHeight,
          }}
        >
          {virtualMessages.map(({ index, start }) => {
            const message = messages[index];

            const { id, role } = message;
            const isLast =
              messages.length - 1 === index && role === 'assistant';

            return (
              <div
                key={id}
                data-index={index}
                ref={virtualizer.measureElement}
                className={cn([
                  'mtw:absolute mtw:top-0 mtw:flex mtw:justify-start mtw:gap-3',
                  'mtw:p-4 mtw:[&_li]:pb-2 mtw:text-sm mtw:font-normal',
                  role === 'user'
                    ? 'mtw:right-0 mtw:max-w-[70%] mtw:self-end'
                    : 'mtw:left-0 mtw:max-w-full',
                ])}
                style={{
                  transform: `translateY(${start}px)`,
                }}
              >
                <ChatMessage message={message} isLast={isLast} />
              </div>
            );
          })}

          {isError && (
            <div
              className={clsx([
                'mtw:absolute mtw:bottom-0 mtw:left-0 mtw:max-w-full mtw:px-4 mtw:pt-5',
                'mtw:flex mtw:justify-start mtw:gap-3',
              ])}
            >
              <AssistantMessage
                isLast
                isStreaming={isStreaming}
                isError={isError}
                content=""
                id={MESSAGE_ID}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
