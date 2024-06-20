import { useCallback, useRef, useSyncExternalStore } from 'react';

import { IframeAppManager } from '@/lib/IframeClassManager';

export const useMoniteIframeAppSlots = () => {
  const iframeAppManager = useRef(new IframeAppManager()).current;
  const snapshotRef = useRef(iframeAppManager.state);

  const subscribe = (onStoreChange: () => void) => {
    iframeAppManager.on('fetch-token', (payload) => {
      console.log('fetch-token', payload);
      onStoreChange();
    });

    iframeAppManager.connectWithRetry();

    const handleConnectMessage = (event: MessageEvent) => {
      iframeAppManager.handleConnectMessage(event);
    };

    window.addEventListener('message', handleConnectMessage);

    return () => {
      window.removeEventListener('message', handleConnectMessage);
    };
  };

  const getSnapshot = useCallback(() => {
    const currentState = iframeAppManager.state;
    if (JSON.stringify(snapshotRef.current) !== JSON.stringify(currentState)) {
      snapshotRef.current = currentState;
    }
    return snapshotRef.current;
  }, [iframeAppManager.state]);

  const state = useSyncExternalStore(subscribe, getSnapshot);

  const fetchTokenResolver = useRef<{
    promise?: Promise<string>;
    resolve?: (value: string) => void;
  }>({});

  const fetchToken = useCallback(() => {
    if (fetchTokenResolver.current?.promise) {
      return fetchTokenResolver.current.promise;
    }

    fetchTokenResolver.current = {
      promise: new Promise<string>((resolve) => {
        fetchTokenResolver.current!.resolve = resolve;
        iframeAppManager.port?.postMessage({ type: 'fetch-token' });
      }).finally(() => {
        fetchTokenResolver.current = {};
      }),
      resolve: undefined,
    };

    return fetchTokenResolver.current.promise!;
  }, [iframeAppManager]);

  return { ...state, fetchToken };
};
