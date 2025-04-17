'use client';

import { FC, useEffect } from 'react';

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
    router.push(`/ai-assistant/chat/${conversationId}/`);
  };

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <AIAssistant>
      <AIAssistantWrapper conversationId={conversationId} messages={[]}>
        <AIStartScreen onStartConversation={handleStartConversation} />
      </AIAssistantWrapper>
    </AIAssistant>
  );
};
