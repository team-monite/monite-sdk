import React, { type FC, type RefObject, useMemo } from 'react';

import { getDefaultPrompts } from '@/components/aiAssistant/consts';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { cn } from '@/ui/lib/utils';
import { useLingui } from '@lingui/react';
import { Popover } from '@mui/material';

import { Prompt } from '../../types';
import { PromptsPopoverItem } from '../PromptsPopoverItem/PromptsPopoverItem';

interface PromptsPopoverProps {
  editorRef: RefObject<HTMLDivElement | null>;
  popoverAnchorEl: HTMLDivElement | null;
  showPrompts: boolean;
  closePrompts: () => void;
  onPromptInsert: (template: string) => void;
}

export const PromptsPopover: FC<PromptsPopoverProps> = ({
  editorRef,
  popoverAnchorEl,
  showPrompts,
  closePrompts,
  onPromptInsert,
}) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { data } = api.ai.getAiPrompts.useQuery<{
    data: Prompt[];
  }>();

  const { data: userPrompts = [] } = data || {};

  const defaultPrompts = useMemo(() => getDefaultPrompts(i18n), [i18n]);

  const handlePreserveInputFocus = () => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
  };

  const promptList = useMemo(
    () => [...defaultPrompts, ...userPrompts],
    [defaultPrompts, userPrompts]
  );

  return (
    <Popover
      anchorEl={popoverAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          className: cn(
            'mtw:!w-[20rem] mtw:2xl:!w-[56rem] mtw:lg:!w-[42rem]',
            'mtw:md:!w-[32rem] mtw:sm:!w-[28rem] mtw:!shadow-md',
            'mtw:!border mtw:!border-solid mtw:!border-gray-200'
          ),
        },
      }}
      open={showPrompts}
      onClose={closePrompts}
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
