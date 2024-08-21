import { useCallback } from 'react';

import { components } from '@/api';

import { useMoniteContext } from '../context/MoniteContext';

export const useOnboardingRequirementsData = () => {
  const { api } = useMoniteContext();

  return api.frontend.getFrontendOnboardingRequirements.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
};

export const useOnboardingPersonMask = (
  relationships: components['schemas']['Relationship'][],
  country?: AllowedCountries
) => {
  const { api } = useMoniteContext();

  const onlyDirector =
    relationships.includes('director') && relationships.length === 1;

  const enabled = !!(
    !!relationships.length &&
    (onlyDirector || (!onlyDirector && country))
  );

  return api.frontend.getFrontendPersonMask.useQuery(
    {
      query: {
        relationships,
        country,
      },
    },
    {
      enabled,
      retry: false,
      staleTime: Infinity,
    }
  );
};

export const useOnboardingBankAccountMask = () => {
  const { api } = useMoniteContext();

  return api.frontend.getFrontendBankAccountMasks.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
    }
  );
};

export const usePatchOnboardingRequirementsData = () => {
  const { api, queryClient } = useMoniteContext();

  return useCallback(
    ({
      data,
      requirements = [],
    }: Partial<InternalOnboardingRequirementsResponse>) => {
      api.frontend.getFrontendOnboardingRequirements.setQueryData(
        {},
        (onboarding) => {
          if (!onboarding) return;

          return {
            ...onboarding,
            data: {
              ...onboarding.data,
              ...data,
            },
            requirements: onboarding.requirements.filter(
              (item) => !requirements?.includes(item)
            ),
          };
        },
        queryClient
      );
    },
    [api, queryClient]
  );
};

export const useOnboardingCurrencyToCountries = () => {
  const { api } = useMoniteContext();

  return api.frontend.getFrontendBankAccountsCurrencyToSupportedCountries.useQuery(
    {},
    {
      retry: false,
      staleTime: Infinity,
    }
  );
};

type AllowedCountries = components['schemas']['AllowedCountries'];
type InternalOnboardingRequirementsResponse =
  components['schemas']['InternalOnboardingRequirementsResponse'];
