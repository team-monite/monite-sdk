import type { FC } from 'react';

import { cn } from '@/ui/lib/utils';

import DOMPurify from 'isomorphic-dompurify';

import { useAIAssistantChat } from '../../context/AIAssistantChatContext';

interface PromptCardProps {
  content: string;
}

export const PromptCard: FC<PromptCardProps> = ({ content }) => {
  const { input, setInput } = useAIAssistantChat();

  const isSelected = input === content;
  const html = DOMPurify.sanitize(content);

  const handleSubmitPrompt = () => {
    setInput(html);
  };

  return (
    <div
      onClick={handleSubmitPrompt}
      className={cn([
        'mtw:p-4 mtw:text-xs mtw:h-[87px] mtw:cursor-pointer',
        'mtw:border mtw:border-solid mtw:border-border mtw:rounded-xl',
        !isSelected && 'mtw:hover:bg-primary-95 mtw:hover:border-neutral-90',
        isSelected && 'mtw:border-primary-50 mtw:bg-primary-95',
      ])}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
