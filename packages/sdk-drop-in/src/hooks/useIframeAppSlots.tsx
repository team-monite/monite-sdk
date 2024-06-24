import { useCallback, useRef, useSyncExternalStore } from 'react';

import { MoniteIframeAppMessageChannel } from '@/lib/IframeClassManager';

type AccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export const useMoniteIframeAppSlots = () => {
  const slotHandler = useRef<{
    ['fetchToken']?: () => Promise<AccessToken>;
  }>({});

  const subscribe = useCallback((onStoreChange: () => void) => {
    const iframeAppManager = new MoniteIframeAppMessageChannel(window);

    const slotState: {
      ['fetch-token']?:
        | {
            resolve: (value: AccessToken) => void;
            reject: () => void;
          }
        | { promise: Promise<AccessToken> };
    } = {};

    iframeAppManager.on('fetch-token', (data) => {
      if (!validateToken(data)) return void console.error('Invalid token data');

      const slot = slotState['fetch-token'];

      if (slot && 'resolve' in slot) {
        slot?.resolve(data);
      } else {
        slotState['fetch-token'] = { promise: Promise.resolve(data) };
      }
      onStoreChange();
    });

    iframeAppManager.connect();

    slotHandler.current = {
      ['fetchToken']: () =>
        new Promise<AccessToken>((resolve, reject) => {
          const slot = slotState['fetch-token'];
          if (slot && 'promise' in slot) {
            return void slot.promise.then((data) => {
              slotState['fetch-token'] = undefined;
              resolve(data);
            });
          }
          if (slot && 'resolve' in slot) slot.reject();
          slotState['fetch-token'] = { resolve, reject };
          iframeAppManager.requestSlot('fetch-token');
        }),
    };

    return () => {
      iframeAppManager.destroy();
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => slotHandler.current as Required<typeof slotHandler.current>
  );
};

function validateToken(token: unknown): token is {
  access_token: string;
  token_type: string;
  expires_in: number;
} {
  return (
    !!token &&
    typeof token === 'object' &&
    'access_token' in token &&
    'token_type' in token &&
    'expires_in' in token
  );
}
