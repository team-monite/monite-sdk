import React from 'react';

import { Prompt } from '@/components';
import { AssistantLogo } from '@/components/aiAssistant/components/AssistantLogo/AssistantLogo';
import { PromptList } from '@/components/aiAssistant/components/PromptList/PromptList';
import { PromptListSkeleton } from '@/components/aiAssistant/components/PromptListSkeleton/PromptListSkeleton';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { SquarePen } from 'lucide-react';

export const AIStartScreen = ({ isConversationIdLoading = false }) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { data, isLoading } = api.ai.fetchPrompts.useQuery<{
    data: Prompt[];
  }>();

  const { data: userPrompts = [] } = data || {};

  return (
    <div className="mtw:flex mtw:flex-col mtw:gap-10 mtw:grow mtw:mb-7 mtw:mx-auto mtw:pt-15">
      <div className="mtw:flex mtw:flex-col mtw:items-center mtw:gap-4">
        <AssistantLogo />

        <h1 className="mtw:text-center mtw:text-2xl mtw:font-medium">
          {t(i18n)`What can I help with?`}
        </h1>
      </div>

      <div className="mtw:flex mtw:flex-col mtw:items-center mtw:gap-2">
        <h3 className="mtw:flex mtw:items-center mtw:gap-1">
          <SquarePen size={17} className="mtw:text-primary-50" />
          <span className="mtw:font-medium mtw:text-sm">{t(
            i18n
          )`Examples`}</span>
        </h3>

        {isLoading || isConversationIdLoading ? (
          <PromptListSkeleton />
        ) : (
          <PromptList userPrompts={userPrompts} divider={3} />
        )}
      </div>
    </div>
  );
};
