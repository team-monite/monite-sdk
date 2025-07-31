import { useAIAssistantChat } from '../../context/AIAssistantChatContext';
import { cn } from '@/ui/lib/utils';
import type { FC } from 'react';

interface PromptSuggestionProps {
  content: string;
}

export const PromptSuggestion: FC<PromptSuggestionProps> = ({ content }) => {
  const { setInput } = useAIAssistantChat();

  const handleSubmitPrompt = () => {
    setInput(content);
  };

  return (
    <li
      onClick={handleSubmitPrompt}
      className={cn([
        'mtw:p-4 mtw:text-xs mtw:line-clamp-2 mtw:cursor-pointer mtw:shadow-md mtw:text-center',
        'mtw:border mtw:border-solid mtw:border-border mtw:rounded-xl mtw:w-fit',
      ])}
      role="button"
    >
      {content}
    </li>
  );
};
