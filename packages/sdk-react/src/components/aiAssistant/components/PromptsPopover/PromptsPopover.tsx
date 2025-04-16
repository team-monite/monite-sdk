import React, { type FC, type RefObject, useMemo } from 'react';

import { DEFAULT_PROMPTS } from '@/components/aiAssistant/consts';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { cn } from '@/ui/lib/utils';
import { Popover } from '@mui/material';

import { Prompt } from '../../types';
import { PromptsPopoverItem } from '../PromptsPopoverItem/PromptsPopoverItem';

interface PromptsPopoverProps {
  editorRef: RefObject<HTMLDivElement | null>;
  showPrompts: boolean;
  onPromptInsert: (template: string) => void;
}

export const PromptsPopover: FC<PromptsPopoverProps> = ({
  editorRef,
  showPrompts,
  onPromptInsert,
}) => {
  const { api } = useMoniteContext();

  const { data } = api.ai.fetchPrompts.useQuery<{
    data: Prompt[];
  }>();

  const { data: userPrompts = [] } = data || {};

  const handlePreserveInputFocus = () => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
  };

  const promptList = useMemo(
    () => [...DEFAULT_PROMPTS, ...userPrompts],
    [userPrompts]
  );

  return (
    <Popover
      anchorEl={editorRef.current}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={showPrompts}
    >
      <div
        onFocus={handlePreserveInputFocus}
        className={cn(
          'mtw:w-[20rem] mtw:p-0 mtw:max-h-40 mtw:overflow-y-auto',
          'mtw:2xl:w-[56rem] mtw:lg:w-[42rem] mtw:md:w-[32rem] mtw:sm:w-[28rem]'
        )}
      >
        <ul className="mtw:m-0 mtw:p-0">
          {promptList.map(({ content, id }) => (
            <PromptsPopoverItem
              key={id}
              content={content}
              onPromptInsert={onPromptInsert}
            />
          ))}
        </ul>
      </div>
    </Popover>
  );
};
