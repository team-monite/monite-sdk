import {
  ComponentProps,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator';
import { MoniteProvider } from '@monite/sdk-react';

type AccessToken = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export const useMoniteIframeAppSlots = () => {
  const [slots, setSlots] = useState<
    Partial<Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>>
  >({});

  const slotStateRef = useRef<{
    fetchToken?:
      | {
          resolve: (value: AccessToken) => void;
          reject: () => void;
        }
      | { promise: Promise<AccessToken> };
  }>({});

  const [iframeCommunicator] = useState(
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
      iframeCommunicator.pingSlot('fetch-token');
    }).finally(() => {
      slotState.fetchToken = undefined;
    });
  }, [iframeCommunicator]);

  useEffect(
    function subscribe() {
      const slotState = slotStateRef.current;

      iframeCommunicator.on('locale', (locale) => {
        // @ts-expect-error - payload is not a valid theme object
        setSlots((prevSlots) => ({ ...prevSlots, locale }));
      });

      iframeCommunicator.on('theme', (theme) => {
        // @ts-expect-error - payload is not a valid theme object
        setSlots((prevSlots) => ({ ...prevSlots, theme }));
      });

      iframeCommunicator.on('fetch-token', (data) => {
        if (!validateToken(data))
          return void console.error('Invalid token data');

        if (slotState.fetchToken && 'resolve' in slotState.fetchToken) {
          slotState.fetchToken.resolve(data);
        } else {
          slotState.fetchToken = { promise: Promise.resolve(data) };
        }
      });

      iframeCommunicator.connect();

      return () => {
        iframeCommunicator.disconnect();
      };
    },
    [iframeCommunicator, fetchToken]
  );

  return { ...slots, fetchToken };
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
