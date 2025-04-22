'use client';

import { FC } from 'react';

import { AIPrompts } from '@monite/sdk-react';

import { AIAssistantWrapper } from '@/components/AIAssistant/AIAssistantWrapper';

interface AIPromptsContentProps {
  conversationId: string;
}

export const AIPromptsContent: FC<AIPromptsContentProps> = ({
  conversationId,
}) => (
  <AIAssistantWrapper conversationId={conversationId} messages={[]}>
    <AIPrompts />
  </AIAssistantWrapper>
);
