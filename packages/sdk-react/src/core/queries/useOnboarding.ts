import { useCallback } from 'react';

import {
  AllowedCountries,
  ApiError,
  InternalOnboardingRequirementsResponse,
  OnboardingBankAccountMaskResponse,
  OnboardingPersonMask,
  Relationship,
} from '@monite/sdk-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';

type OnboardingRelationshipFilter = {
  country?: AllowedCountries;
  relationship?: Relationship[];
};

const onboardingQueryKeys = {
  all: () => ['onboarding'],
  requirements: () => [...onboardingQueryKeys.all(), 'requirements'],
  personMasks: (filter?: OnboardingRelationshipFilter) =>
    filter
      ? [...onboardingQueryKeys.all(), 'personMasks', filter]
      : [...onboardingQueryKeys.all(), 'personMasks'],
  bankAccountMasks: () => [...onboardingQueryKeys.all(), 'bankAccountMasks'],
  currenciesToCountries: () => [
    ...onboardingQueryKeys.all(),
    'currenciesToCountries',
  ],
};

export const useOnboardingRequirementsData = () => {
  const { monite } = useMoniteContext();

  return useQuery<InternalOnboardingRequirementsResponse, ApiError>({
    queryKey: onboardingQueryKeys.requirements(),

    queryFn: () => monite.api.onboarding.getRequirements(),

    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useOnboardingPersonMask = (
  relationship?: Relationship[],
  country?: AllowedCountries
) => {
  const { monite } = useMoniteContext();

  const onlyDirector =
    relationship?.includes(Relationship.DIRECTOR) && relationship?.length === 1;

  const enabled = !!(
    !!relationship?.length &&
    (onlyDirector || (!onlyDirector && country))
  );

  return useQuery<OnboardingPersonMask | undefined, ApiError>({
    queryKey: onboardingQueryKeys.personMasks(
      enabled ? { country, relationship } : undefined
    ),

    queryFn: () =>
      enabled
        ? monite.api.onboarding.getPersonMask(relationship, country)
        : undefined,

    enabled,
    retry: false,
    staleTime: Infinity,
  });
};

export const useOnboardingBankAccountMask = () => {
  const { monite } = useMoniteContext();

  return useQuery<OnboardingBankAccountMaskResponse | undefined, ApiError>({
    queryKey: onboardingQueryKeys.bankAccountMasks(),

    queryFn: () => monite.api.onboarding.getBankAccountMasks(),

    retry: false,
    staleTime: Infinity,
  });
};

export const usePatchOnboardingRequirementsData = () => {
  const queryClient = useQueryClient();

  return useCallback(
    ({
      data,
      requirements = [],
    }: Partial<InternalOnboardingRequirementsResponse>) => {
      return queryClient.setQueryData<InternalOnboardingRequirementsResponse>(
        onboardingQueryKeys.requirements(),
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
        }
      );
    },
    [queryClient]
  );
};

export const useOnboardingCurrencyToCountries = () => {
  const { monite } = useMoniteContext();

  return useQuery<Record<string, AllowedCountries[]>, ApiError>({
    queryKey: onboardingQueryKeys.currenciesToCountries(),

    queryFn: () =>
      monite.api.onboarding.getBankAccountCurrencyToSupportedCountries(),

    retry: false,
    staleTime: Infinity,
  });
};
