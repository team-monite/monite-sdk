import React from 'react';

import { PromptList } from '@/components/aiAssistant/components/PromptList/PromptList';
import { PromptListSkeleton } from '@/components/aiAssistant/components/PromptListSkeleton/PromptListSkeleton';
import { Prompt } from '@/components/aiAssistant/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { ChatInput } from '../ChatInput/ChatInput';

export const AIPrompts = () => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  const { data, isLoading } = api.ai.fetchPrompts.useQuery<{
    data: Prompt[];
  }>();

  const { data: userPrompts = [] } = data || {};

  return (
    <>
      <div className="mtw:h-[calc(100vh-275px)] mtw:mt-10 mtw:flex mtw:flex-col mtw:gap-6">
        <h1 className="mtw:text-center mtw:text-2xl mtw:font-medium">
          {t(i18n)`Prompts`} <br />
        </h1>

        {isLoading ? (
          <PromptListSkeleton />
        ) : (
          <PromptList userPrompts={userPrompts} />
        )}
      </div>

      <ChatInput />
    </>
  );
};
