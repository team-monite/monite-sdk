import { MessageList } from '@/components/aiAssistant/components/MessageList/MessageList';
import { FC } from 'react';

interface AIChatProps {
  isEnlarged: boolean;
}

export const AIChat: FC<AIChatProps> = ({ isEnlarged }) => {
  return <MessageList isEnlarged={isEnlarged} />;
};
