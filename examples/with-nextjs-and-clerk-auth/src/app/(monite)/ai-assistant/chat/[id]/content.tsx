'use client';

import { FC } from 'react';

import { AIAssistant, AIChat, AIMessage } from '@monite/sdk-react';

import { AIAssistantWrapper } from '@/components/AIAssistant/AIAssistantWrapper';

interface AIAssistantWrapperProps {
  conversationId: string;
  messages: AIMessage[];
}

export const AIChatContent: FC<AIAssistantWrapperProps> = ({
  conversationId,
  messages,
}) => {
  return (
    <AIAssistant>
      <AIAssistantWrapper conversationId={conversationId} messages={messages}>
        <AIChat />
      </AIAssistantWrapper>
    </AIAssistant>
  );
};
