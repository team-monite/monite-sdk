import { useCallback, useEffect, useRef, useState } from 'react';

import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator.ts';

type AccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export const useMoniteIframeAppSlots = () => {
  const slotStateRef = useRef<{
    fetchToken?:
      | {
          resolve: (value: AccessToken) => void;
          reject: () => void;
        }
      | { promise: Promise<AccessToken> };
  }>({});

  const [channelPortManager] = useState(
    () => new MoniteIframeAppCommunicator(window.parent)
  );

  const fetchToken = useCallback(() => {
    const slotState = slotStateRef.current;

    return new Promise<AccessToken>((resolve, reject) => {
      if (slotState.fetchToken && 'promise' in slotState.fetchToken) {
        return void slotState.fetchToken.promise.then(resolve);
      }

      if (slotState.fetchToken && 'reject' in slotState.fetchToken)
        slotState.fetchToken.reject();

      slotState.fetchToken = { resolve, reject };
      channelPortManager.pingSlot('fetch-token');
    }).finally(() => {
      slotState.fetchToken = undefined;
    });
  }, [channelPortManager]);

  useEffect(
    function subscribe() {
      const slotState = slotStateRef.current;

      // todo::add locale slot handling
      /*channelPortManager.on('locale', (payload) => {
        console.log('locale', payload);
      });*/

      channelPortManager.on('fetch-token', (data) => {
        if (!validateToken(data))
          return void console.error('Invalid token data');

        if (slotState.fetchToken && 'resolve' in slotState.fetchToken) {
          slotState.fetchToken.resolve(data);
        } else {
          slotState.fetchToken = { promise: Promise.resolve(data) };
        }
      });

      channelPortManager.connect();

      return () => {
        channelPortManager.disconnect();
      };
    },
    [channelPortManager, fetchToken]
  );

  return { fetchToken };
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
