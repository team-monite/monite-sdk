import { fetchToken } from '@/services/fetch-token';
import { getLoginEnvData } from '@/services/login-env-data';
import { MoniteDropin } from '@monite/sdk-drop-in';
import { useEffect, useMemo, useRef } from 'react';

type AppDropinProvider = {
  component: string;
};

const AppDropinProvider = ({ component }: AppDropinProvider) => {
  const { entityId, entityUserId, clientId, clientSecret, apiUrl } =
    getLoginEnvData();

  const dropinRef = useRef<HTMLDivElement>(null);

  const dropinConfig = useMemo(
    () => ({
      entityId,
      apiUrl,
      fetchToken: () =>
        fetchToken(apiUrl, {
          entity_user_id: entityUserId,
          client_id: clientId,
          client_secret: clientSecret,
        }),
    }),
    [entityId, apiUrl, entityUserId, clientId, clientSecret]
  );

  useEffect(() => {
    const dropin = new MoniteDropin(dropinConfig);
    const componentInstance = dropin.create(component);

    if (dropinRef.current) {
      componentInstance.mount(dropinRef.current);
    }

    return () => {
      componentInstance.unmount();
    };
  }, [component, dropinRef, dropinConfig]);

  return <div ref={dropinRef} />;
};

export { AppDropinProvider };
