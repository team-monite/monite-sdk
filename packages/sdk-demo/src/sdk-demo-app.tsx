import { createRoot } from 'react-dom/client';

import { SDKDemo } from '@/apps/SDKDemo';
import { GrantType } from '@monite/sdk-api';
import { createChatClient } from '@monite/sdk-react';

(async function () {
  const root = createRoot(document.getElementById('root') as HTMLElement);

  root.render(<SDKDemo />);

  const fetchToken = async () => {
    const res = await fetch(`https://api.sandbox.monite.com/v1/auth/token`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'x-monite-version': '2023-04-12',
      },
      body: JSON.stringify({
        grant_type: GrantType.ENTITY_USER,
        entity_user_id: '51eb4091-f5a7-462c-8e2e-ac42c44d12eb',
        client_id: '463e0b19-0cc4-4f60-9cef-3db0c205c5fa',
        client_secret: '4396bb50-a211-451d-921b-18381fed994e',
      }),
    });

    if (!res.ok) {
      throw new Error(`Could not fetch token: ${await res.text()}`);
    }

    return await res.json();
  };

  console.log('creating chat');
  const chatClient = createChatClient({
    chatApiUrl: 'https://app.sandbox.monite.com/v1/chat',
    entityId: '00c526b3-686e-4ad8-bffd-21d3302b32eb',
    fetchToken,
  });

  const responseStream = await chatClient.sendMessage(
    `What's the biggest invoice amount`,
    ''
  );
  const reader = responseStream.getReader();
  for (let i = 0, maxMessageNumber = 10000; i < maxMessageNumber; i++) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    console.log(value.data.message);
  }
})();
