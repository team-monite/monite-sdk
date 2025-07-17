import { useEffect, useRef } from 'react';

import { fetchToken } from '@/services/fetch-token';
import { getLoginEnvData } from '@/services/login-env-data';
import { MoniteDropin } from '@monite/sdk-drop-in';

type AppDropinProvider = {
  component: string;
};

const AppDropinProvider = ({ component }: AppDropinProvider) => {
  const { entityId, entityUserId, clientId, clientSecret, apiUrl } =
    getLoginEnvData();

  const dropinRef = useRef<HTMLDivElement>(null);

  const dropinConfig = {
    entityId,
    apiUrl,
    fetchToken: () =>
      fetchToken(apiUrl, {
        entity_user_id: entityUserId,
        client_id: clientId,
        client_secret: clientSecret,
      }),
  };

  const dropin = new MoniteDropin(dropinConfig);
  const componentInstance = dropin.create(component);

  useEffect(() => {
    if (dropinRef.current) {
      componentInstance.mount(dropinRef.current);
    }

    return () => {
      componentInstance.unmount();
    };
  }, [componentInstance, dropinRef]);

  return <div ref={dropinRef} />;
};

export { AppDropinProvider };
