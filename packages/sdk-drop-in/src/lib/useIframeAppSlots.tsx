import { ComponentProps, useCallback, useEffect, useState } from 'react';

import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator';
import { MoniteProvider, type APISchema } from '@monite/sdk-react';

export const useMoniteIframeAppSlots = () => {
  const [slots, setSlots] = useState<
    Partial<Pick<ComponentProps<typeof MoniteProvider>, 'locale' | 'theme'>>
  >({});

  const [iframeCommunicator] = useState(
    () => new MoniteIframeAppCommunicator(window.parent)
  );

  const fetchToken = useCallback(() => {
    return new Promise<APISchema.components['schemas']['AccessTokenResponse']>(
      (resolve) => {
        iframeCommunicator.on('fetch-token', (data) => {
          if (!validateToken(data))
            throw new Error('Invalid token received from the iframe');

          resolve(data);
        });
        iframeCommunicator.pingSlot('fetch-token');
      }
    ).finally(() => {
      iframeCommunicator.off('fetch-token');
    });
  }, [iframeCommunicator]);

  useEffect(
    function subscribe() {
      iframeCommunicator.on('locale', (locale) => {
        // @ts-expect-error - payload is not a valid theme object
        setSlots((prevSlots) => ({ ...prevSlots, locale }));
      });

      iframeCommunicator.on('theme', (theme) => {
        // @ts-expect-error - payload is not a valid theme object
        setSlots((prevSlots) => ({ ...prevSlots, theme }));
      });

      iframeCommunicator.connect();

      return () => {
        iframeCommunicator.disconnect();
      };
    },
    [iframeCommunicator, fetchToken]
  );

  useEffect(
    function subscribe() {
      const clicker = () => {
        fetchToken();
      };

      document.addEventListener('click', clicker);

      return () => {
        document.removeEventListener('click', clicker);
      };
    },
    [fetchToken]
  );

  return { ...slots, fetchToken };
};

function validateToken(
  token: unknown
): token is APISchema.components['schemas']['AccessTokenResponse'] {
  return (
    !!token &&
    typeof token === 'object' &&
    'access_token' in token &&
    'token_type' in token &&
    'expires_in' in token
  );
}
