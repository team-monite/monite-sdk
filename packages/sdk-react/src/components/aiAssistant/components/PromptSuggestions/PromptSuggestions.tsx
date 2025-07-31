import { PromptSuggestion } from '@/components/aiAssistant/components/PromptSuggestion/PromptSuggestion';
import { getDefaultPrompts } from '@/components/aiAssistant/consts';
import { cn } from '@/ui/lib/utils';
import { useLingui } from '@lingui/react';
import { FC, useMemo } from 'react';

interface PromptSuggestionsProps {
  isEnlarged: boolean;
}

export const PromptSuggestions: FC<PromptSuggestionsProps> = ({
  isEnlarged,
}) => {
  const { i18n } = useLingui();

  const suggestions = useMemo(() => getDefaultPrompts(i18n), [i18n]);

  return (
    <ul
      className={cn(
        'mtw:flex mtw:flex-col mtw:gap-2.5 mtw:justify-end mtw:size-full mtw:p-4 mtw:pt-0 mtw:items-center',
        isEnlarged &&
          'mtw:flex-row mtw:flex-wrap mtw:items-end mtw:justify-start'
      )}
    >
      {suggestions.map(({ content, id }) => (
        <PromptSuggestion key={id} content={content} />
      ))}
    </ul>
  );
};
