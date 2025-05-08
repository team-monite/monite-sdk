import { MessageList } from '@/components/aiAssistant/components/MessageList/MessageList';
import { useAIAssistantChat } from '@/components/aiAssistant/context/AIAssistantChatContext';

export const AIChat = () => {
  const { id } = useAIAssistantChat();

  return <MessageList key={id} />;
};
