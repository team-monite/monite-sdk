import { ReactNode } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

export const ConfigLoader = ({
  children,
}: {
  children: (config: {
    apiUrl: string;
    appBasename: string;
    appHostname: string;
  }) => ReactNode;
}) => {
  const configQuery = useSuspenseQuery({
    queryKey: ['application-config'],
    queryFn: () => getConfig(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (!configQuery.data.api_url)
    throw new Error('"api_url" not found in the "config.json"');
  if (!configQuery.data.app_basename)
    throw new Error('"app_basename" not found in the "config.json"');

  return (
    <>
      {children({
        apiUrl: `${configQuery.data.api_url}/v1`,
        appBasename: configQuery.data.app_basename,
        appHostname: configQuery.data.app_hostname,
      })}
    </>
  );
};

export async function getConfig(): Promise<{
  stand: string;
  api_url: string;
  app_basename: string;
  /** @deprecated Dev usage only */
  app_hostname: string;
  /** @deprecated Temporary field */
  client_id: string;
  /** @deprecated Temporary field */
  entity_user_id: string;
  /** @deprecated Temporary field */
  client_secret: string;
}> {
  const res = await fetch('/config.json', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`
      Could not load config.json. Check that "config.json" file exists in the "public" folder.
      Please follow the instructions in the README.md file.
      Or execute this code in the console:
      'cp config.json.example public/config.json'
    `);
  }

  return await res.json();
}
