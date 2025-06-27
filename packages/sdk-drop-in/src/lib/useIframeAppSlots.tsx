import {
  ComponentProps,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';

import { MoniteIframeAppCommunicator } from '@/lib/MoniteIframeAppCommunicator';
import { type APISchema, type MoniteProvider } from '@monite/sdk-react';

type MoniteProviderProps = ComponentProps<typeof MoniteProvider>;

type MoniteProviderSlots = {
  locale?: MoniteProviderProps['locale'];
  theme?: MoniteProviderProps['theme'];
  componentSettings?: MoniteProviderProps['componentSettings'];
};

export const useMoniteIframeAppSlots = (): {
  locale?: MoniteProviderProps['locale'];
  theme?: MoniteProviderProps['theme'];
  componentSettings?: MoniteProviderProps['componentSettings'];
  fetchToken: () => Promise<
    APISchema.components['schemas']['AccessTokenResponse']
  >;
} => {
  const isTestEnvironment = useMemo(() => {
    if (typeof window === 'undefined') return false;

    return (
      window.location.search.includes('test=playwright') ||
      window.location.search.includes('test=e2e') ||
      navigator.userAgent.includes('Playwright') ||
      navigator.userAgent.includes('HeadlessChrome')
    );
  }, []);

  const [slots, setSlots] = useState<Partial<MoniteProviderSlots>>({});

  const [iframeCommunicator] = useState(
    () => new MoniteIframeAppCommunicator(window.parent)
  );

  const fetchToken = useCallback(() => {
    if (isTestEnvironment) {
      return Promise.resolve({
        access_token: 'mocked_access_token_for_e2e_tests',
        token_type: 'Bearer' as const,
        expires_in: 3600,
      });
    }

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
  }, [iframeCommunicator, isTestEnvironment]);

  useEffect(
    function subscribe() {
      if (isTestEnvironment) {
        return;
      }

      iframeCommunicator.on('locale', (locale) => {
        // @ts-expect-error - payload is not a valid locale object
        setSlots((prevSlots) => ({ ...prevSlots, locale }));
      });

      iframeCommunicator.on('theme', (theme) => {
        // @ts-expect-error - payload is not a valid theme object
        setSlots((prevSlots) => ({ ...prevSlots, theme }));
      });

      iframeCommunicator.on('component-settings', (componentSettings) => {
        // @ts-expect-error - payload is not a valid componentSettings object
        setSlots((prevSlots) => ({ ...prevSlots, componentSettings }));
      });

      iframeCommunicator.connect();

      return () => {
        iframeCommunicator.disconnect();
      };
    },
    [iframeCommunicator, fetchToken, isTestEnvironment]
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
