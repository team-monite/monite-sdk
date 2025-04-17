'use client';

import { FC, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { AIAssistant, AIPrompts } from '@monite/sdk-react';

import { AIAssistantWrapper } from '@/components/AIAssistant/AIAssistantWrapper';

interface AIPromptsContentProps {
  conversationId: string;
}

export const AIPromptsContent: FC<AIPromptsContentProps> = ({
  conversationId,
}) => {
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, [router]);

  return (
    <AIAssistant>
      <AIAssistantWrapper conversationId={conversationId} messages={[]}>
        <AIPrompts />
      </AIAssistantWrapper>
    </AIAssistant>
  );
};
