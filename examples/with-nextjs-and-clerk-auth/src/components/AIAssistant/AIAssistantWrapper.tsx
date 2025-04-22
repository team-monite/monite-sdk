import React, { FC, PropsWithChildren, useEffect, useRef } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  AIAssistant,
  AIAssistantChatProvider,
  AISidebar,
  Message,
  useAIAssistantOptions,
  useMoniteContext,
} from '@monite/sdk-react';

import { LocationLink } from '@/components/AIAssistant/LocationLink';
import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';

interface AIAssistantWrapperProps extends PropsWithChildren {
  conversationId: string;
  messages: Message[];
}

const REFRESH_PARAM_ID = 'refreshId';

export const AIAssistantWrapper: FC<AIAssistantWrapperProps> = ({
  children,
  messages,
  conversationId,
}) => {
  const isNew = useRef(true);

  const { apiUrl, fetchToken, api, queryClient } = useMoniteContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const values = useAIAssistantOptions({
    id: conversationId,
    fetch: async (_, init) => {
      const token = await fetchToken();
      const { access_token: accessToken, token_type: tokenType } = token;

      return fetch(`${apiUrl}/ai/conversations/${conversationId}/messages`, {
        ...(init || {}),
        method: 'POST',
        headers: {
          ...init?.headers,
          'x-monite-version': getMoniteApiVersion(),
          Authorization: `${tokenType} ${accessToken}`,
        },
      });
    },
    initialMessages: messages,
    onFinish: async () => {
      if (!isNew.current) {
        return;
      }

      await api.ai.fetchConversations.invalidateQueries(queryClient);
      isNew.current = false;
    },
  });

  useEffect(() => {
    if (!searchParams.has(REFRESH_PARAM_ID)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete(REFRESH_PARAM_ID);

    const newUrl = `${pathname}?${params.toString()}`.replace(/\?$/, '');

    router.replace(newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AIAssistant>
      <div className="mtw:flex mtw:grow">
        <div className="mtw:grow mtw:flex mtw:flex-col mtw:gap-5 mtw:pt-12">
          <AIAssistantChatProvider values={values}>
            {children}
          </AIAssistantChatProvider>
        </div>

        <AISidebar
          linkProps={{
            pathname,
            startPage: { isVisible: true, href: '/ai-assistant' },
            promptsPage: { isVisible: true, href: '/ai-assistant/prompts' },
            chatPage: { isVisible: true, href: `/ai-assistant/chat` },
          }}
          LocationLink={LocationLink}
        />
      </div>
    </AIAssistant>
  );
};
