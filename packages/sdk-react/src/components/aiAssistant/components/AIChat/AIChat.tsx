import { MessageList } from '@/components/aiAssistant/components/MessageList/MessageList';
import { useAIAssistantChat } from '@/components/aiAssistant/context/AIAssistantChatContext';
import { FC } from 'react';

interface AIChatProps {
  isEnlarged: boolean;
}

export const AIChat: FC<AIChatProps> = ({ isEnlarged }) => {
  const { id } = useAIAssistantChat();

  return <MessageList isEnlarged={isEnlarged} key={id} />;
};
