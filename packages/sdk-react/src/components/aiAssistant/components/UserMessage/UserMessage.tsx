import clsx from 'clsx';
import { type FC, memo } from 'react';

interface ChatMessageContainerProps {
  content: string;
}

const ChatMessageContainer: FC<ChatMessageContainerProps> = ({ content }) => {
  return (
    <div
      className={clsx([
        'mtw:flex mtw:flex-col mtw:gap-4 mtw:py-3',
        'mtw:bg-primary-85 mtw:rounded-xl mtw:px-4',
      ])}
    >
      {content}
    </div>
  );
};

export const UserMessage = memo(ChatMessageContainer);
