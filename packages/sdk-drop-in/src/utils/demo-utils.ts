import { createAPIClient } from '@monite/sdk-react';
import { createSecureRequestFn } from '@openapi-qraft/react/Unstable_QraftSecureRequestFn';
import { QueryClient } from '@tanstack/react-query';

type EntityIdLoaderBaseProps = {
  apiUrl: string;
  fetchToken: () => Promise<{
    access_token: string;
    expires_in: number;
    token_type: string;
  }>;
};

export const createEntityUsersMyEntityRequestFn = (
  fetchToken: EntityIdLoaderBaseProps['fetchToken']
) => {
  const { requestFn: moniteRequestFn } = createAPIClient();

  return createSecureRequestFn(
    {
      async HTTPBearer() {
        const { access_token } = await fetchToken();
        return {
          token: access_token,
          refreshInterval: Infinity,
        };
      },
    },
    moniteRequestFn,
    new QueryClient()
  );
};
