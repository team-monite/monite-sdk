'use client';

import { FC } from 'react';

import { useRouter } from 'next/navigation';

import { AIAssistant, AIStartScreen } from '@monite/sdk-react';

import { AIAssistantWrapper } from '@/components/AIAssistant/AIAssistantWrapper';

interface AIAssistantProps {
  conversationId: string;
}

export const AIStartPageContent: FC<AIAssistantProps> = ({
  conversationId,
}) => {
  const router = useRouter();

  const handleStartConversation = () => {
    router.push(`/ai-assistant/${conversationId}/`);
  };

  return (
    <AIAssistant>
      <AIAssistantWrapper conversationId={conversationId} messages={[]}>
        <AIStartScreen onStartConversation={handleStartConversation} />
      </AIAssistantWrapper>
    </AIAssistant>
  );
};
