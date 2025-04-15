import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { ChatValues } from '@/components/aiAssistant/types';
import { type UseChatHelpers } from '@ai-sdk/react';

export interface ChatProviderProps extends PropsWithChildren {
  values?: ChatValues;
}

const AIAssistantChatContext = createContext<UseChatHelpers | undefined>(
  undefined
);

export function useAIAssistantChat() {
  const context = useContext(AIAssistantChatContext);

  if (!context) {
    throw new Error('useAIAssistantChat must be used within a ChatProvider');
  }

  return context;
}

export const AIAssistantChatProvider = ({
  children,
  values,
}: ChatProviderProps) => {
  const value = useMemo(() => values, [values]);

  return (
    <AIAssistantChatContext.Provider value={value}>
      {children}
    </AIAssistantChatContext.Provider>
  );
};
