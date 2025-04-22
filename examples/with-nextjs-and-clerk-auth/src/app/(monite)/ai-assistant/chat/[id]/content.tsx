'use client';

import { FC } from 'react';

import { AIChat, AIMessage } from '@monite/sdk-react';

import { AIAssistantWrapper } from '@/components/AIAssistant/AIAssistantWrapper';

interface AIAssistantWrapperProps {
  conversationId: string;
  messages: AIMessage[];
}

export const AIChatContent: FC<AIAssistantWrapperProps> = ({
  conversationId,
  messages,
}) => (
  <AIAssistantWrapper conversationId={conversationId} messages={messages}>
    <AIChat />
  </AIAssistantWrapper>
);
