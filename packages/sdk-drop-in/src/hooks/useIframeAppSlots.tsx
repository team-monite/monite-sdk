import { useCallback, useEffect, useState } from 'react';

import { IframeAppManager } from '@/lib/IframeClassManager';

const iframeAppManager = new IframeAppManager();

export const useMoniteIframeAppSlots = () => {
  const [theme, setTheme] = useState<string | null>(null);
  const [locale, setLocale] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'connect') {
        const port = event.ports[0];
        port.onmessage = ({ data }) => {
          if (data.type === 'theme') {
            setTheme(data.payload);
          }
          if (data.type === 'locale') {
            setLocale(data.payload);
          }
        };
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const fetchToken = useCallback(() => {
    return new Promise<string>((resolve) => {
      iframeAppManager.fetchTokenResolve = resolve;
      window.parent.postMessage({ type: 'fetch-token' }, '*');
    });
  }, []);

  return { theme, locale, fetchToken };
};
