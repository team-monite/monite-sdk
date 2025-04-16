'use client';

import { AIAssistant, AIPrompts } from '@monite/sdk-react';

import { AIAssistantWrapper } from '@/components/AIAssistant/AIAssistantWrapper';

export const AIPromptsContent = () => {
  return (
    <AIAssistant>
      <AIAssistantWrapper messages={[]}>
        <AIPrompts />
      </AIAssistantWrapper>
    </AIAssistant>
  );
};
