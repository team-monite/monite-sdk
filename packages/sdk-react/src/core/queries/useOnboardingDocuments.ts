import { components } from '@/api';

import { useMoniteContext } from '../context/MoniteContext';

export const useDocumentDescriptions = (
  country: AllowedCountries | undefined
) => {
  const { api } = useMoniteContext();

  return api.frontend.getFrontendDocumentTypeDescriptions.useQuery(
    {
      query: {
        country: country!,
      },
    },
    {
      enabled: !!country,
    }
  );
};

type AllowedCountries = components['schemas']['AllowedCountries'];
