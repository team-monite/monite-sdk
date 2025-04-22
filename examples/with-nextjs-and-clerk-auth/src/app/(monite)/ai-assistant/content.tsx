'use client';

import { FC } from 'react';

import { useRouter } from 'next/navigation';

import { AIStartScreen } from '@monite/sdk-react';

import { AIAssistantWrapper } from '@/components/AIAssistant/AIAssistantWrapper';

interface AIAssistantProps {
  conversationId: string;
}

export const AIStartPageContent: FC<AIAssistantProps> = ({
  conversationId,
}) => {
  const router = useRouter();

  const handleStartConversation = () => {
    router.push(`/ai-assistant/chat/${conversationId}/`);
  };

  return (
    <AIAssistantWrapper conversationId={conversationId} messages={[]}>
      <AIStartScreen onStartConversation={handleStartConversation} />
    </AIAssistantWrapper>
  );
};
