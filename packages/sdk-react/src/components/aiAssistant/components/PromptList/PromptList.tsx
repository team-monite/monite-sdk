import { type FC, useMemo } from 'react';

import { getDefaultPrompts } from '@/components/aiAssistant/consts';
import { cn } from '@/ui/lib/utils';
import { useLingui } from '@lingui/react';

import { Prompt } from '../../types';
import { PromptCard } from '../PromptCard/PromptCard';

interface PromptListProps {
  divider?: number;
  userPrompts: Prompt[];
}

export const PromptList: FC<PromptListProps> = ({ divider, userPrompts }) => {
  const { i18n } = useLingui();

  const defaultPrompts = useMemo(() => getDefaultPrompts(i18n), [i18n]);

  const prompts = useMemo(() => {
    const promptList = [...defaultPrompts, ...userPrompts];
    const remainder = divider ? promptList.length % divider : 0;
    const newLength = promptList.length - remainder;

    return promptList.filter((_, index) => index < newLength);
  }, [defaultPrompts, divider, userPrompts]);

  return (
    <div className="mtw:size-full mtw:overflow-y-auto">
      <div
        className={cn(
          'mtw:lg:max-w-2xl mtw:md:max-w-md mtw:sm:max-w-sm mtw:max-w-xs mtw:mx-auto mtw:w-full',
          'mtw:grid mtw:grid-cols-1 mtw:sm:grid-cols-2 mtw:lg:grid-cols-3 mtw:gap-4'
        )}
      >
        {prompts.map(({ content, id }) => (
          <PromptCard key={id} content={content} />
        ))}
      </div>
    </div>
  );
};
