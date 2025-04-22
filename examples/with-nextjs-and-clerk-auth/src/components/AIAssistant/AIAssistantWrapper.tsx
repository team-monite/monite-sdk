import React, { FC, PropsWithChildren, useRef } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  AIAssistantChatProvider,
  AISidebar,
  LocationLinkType,
  Message,
  useAIAssistantOptions,
  useMoniteContext,
} from '@monite/sdk-react';

import { getMoniteApiVersion } from '@/lib/monite-api/monite-client';

interface AIAssistantWrapperProps extends PropsWithChildren {
  conversationId: string;
  messages: Message[];
}

export const LocationLink: LocationLinkType = ({
  href,
  children,
  className,
}) => {
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
};

export const AIAssistantWrapper: FC<AIAssistantWrapperProps> = ({
  children,
  messages,
  conversationId,
}) => {
  const isNew = useRef(true);

  const { apiUrl, fetchToken, api, queryClient } = useMoniteContext();
  const pathname = usePathname();

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

  return (
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
  );
};
