import { type FC } from 'react';

import { AssistantMessage } from '@/components/aiAssistant/components/AssistantMessage/AssistantMessage';
import type { UIMessage } from '@ai-sdk/ui-utils';

import { useAIAssistantChat } from '../../context/AIAssistantChatContext';
import { UserMessage } from '../UserMessage/UserMessage';

interface ChatMessageProps {
  message: UIMessage;
  isLast: boolean;
}

export const ChatMessage: FC<ChatMessageProps> = ({ isLast, message }) => {
  const { role, content, id } = message;

  const { status } = useAIAssistantChat();

  switch (role) {
    case 'user': {
      return <UserMessage content={content} />;
    }

    case 'assistant': {
      const isStreaming = isLast && status === 'streaming';
      const isSubmitted = isLast && status === 'submitted';
      const isLoading = isLast && isStreaming && !content;

      return (
        <AssistantMessage
          isStreaming={isStreaming}
          isSubmitted={isSubmitted || isLoading}
          isLast={isLast}
          content={content}
          id={id}
        />
      );
    }

    default: {
      return null;
    }
  }
};
