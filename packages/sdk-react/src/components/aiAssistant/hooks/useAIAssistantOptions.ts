import { ChatOptions } from '@/components/aiAssistant/types';
import { useChat as useAIChat } from '@ai-sdk/react';

export const useAIAssistantOptions = (options: ChatOptions) => {
  return useAIChat({
    ...options,
    experimental_prepareRequestBody: ({ messages }) => {
      const { content } = messages[messages.length - 1];

      return { text_prompt: content, attachment: null };
    },
  });
};
