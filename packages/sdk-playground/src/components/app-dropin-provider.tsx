import { useEffect, useRef } from 'react';

import { fetchToken } from '@/services/fetch-token';
import { MoniteDropin } from '@monite/sdk-drop-in';

type AppDropinProvider = {
  component: string;
};

const AppDropinProvider = ({ component }: AppDropinProvider) => {
  const { entityId, apiUrl } = {
    entityId: import.meta.env.VITE_MONITE_ENTITY_ID,
    apiUrl: import.meta.env.VITE_MONITE_API_URL,
  };

  const dropinRef = useRef<HTMLDivElement>(null);

  const dropinConfig = {
    entityId,
    apiUrl,
    fetchToken: () =>
      fetchToken(apiUrl, {
        entity_user_id: import.meta.env.VITE_MONITE_ENTITY_USER_ID,
        client_id: import.meta.env.VITE_MONITE_PROJECT_CLIENT_ID,
        client_secret: import.meta.env.VITE_MONITE_PROJECT_CLIENT_SECRET,
      }),
  };

  const dropin = new MoniteDropin(dropinConfig);
  const componentInstance = dropin.create(component);

  useEffect(() => {
    if (dropinRef.current) {
      componentInstance.mount(dropinRef.current);
    }
  }, [componentInstance, dropinRef]);

  return <div ref={dropinRef} />;
};

export { AppDropinProvider };
