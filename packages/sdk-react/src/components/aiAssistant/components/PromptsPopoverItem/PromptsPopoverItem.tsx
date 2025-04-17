import React, { type FC } from 'react';

import DOMPurify from 'isomorphic-dompurify';

interface PromptsPopoverItemProps {
  content: string;
  onPromptInsert: (template: string) => void;
}

export const PromptsPopoverItem: FC<PromptsPopoverItemProps> = ({
  content,
  onPromptInsert,
}) => {
  const html = DOMPurify.sanitize(content);

  const handlePromptInsert = () => {
    onPromptInsert(html);
  };

  return (
    <li
      className="mtw:py-2 mtw:px-3 mtw:cursor-pointer mtw:hover:bg-primary-90 mtw:text-sm mtw:truncate"
      onClick={handlePromptInsert}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
