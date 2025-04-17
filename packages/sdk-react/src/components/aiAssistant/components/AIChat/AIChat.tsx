import { ChatInput } from '@/components/aiAssistant/components/ChatInput/ChatInput';
import { MessageList } from '@/components/aiAssistant/components/MessageList/MessageList';
import { useAIAssistantChat } from '@/components/aiAssistant/context/AIAssistantChatContext';

export const AIChat = () => {
  const { id } = useAIAssistantChat();

  return (
    <>
      <MessageList key={id} />

      <ChatInput />
    </>
  );
};
