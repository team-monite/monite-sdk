import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  OnboardingIndividualResponse,
  OnboardingDataPayload,
} from '@team-monite/sdk-api';

import { LocalRequirements } from 'components/onboarding/hooks/useOnboardingRequirements';

import { useComponentsContext } from '../context/ComponentsContext';

const ONBOARDING_QUERY = 'onboarding';

export const onboardingQueryKeys = {
  all: () => [ONBOARDING_QUERY],
  detail: () => [...onboardingQueryKeys.all(), 'detail'],
  requirement: () => [...onboardingQueryKeys.all(), 'requirement'],
};

export const useOnboarding = (linkId: string) => {
  const { monite, t } = useComponentsContext();

  return useQuery<OnboardingIndividualResponse | undefined, Error>(
    onboardingQueryKeys.detail(),
    () =>
      !!linkId
        ? monite.api.onboarding
            .getRequirements(linkId)
            .then((response) => response)
        : undefined,
    {
      onError: () => {
        toast.error(
          t('counterparts:notifications.loadError', {
            type: 'Onboarding',
          })
        );
      },
      enabled: !!linkId,
    }
  );
};

export const useUpdateOnboarding = (linkId: string) => {
  const { monite, t } = useComponentsContext();
  const queryClient = useQueryClient();

  return useMutation<
    OnboardingIndividualResponse,
    Error,
    Partial<OnboardingDataPayload>
  >((payload) => monite.api.onboarding.updateRequirements(linkId, payload), {
    onSuccess: (onboarding) => {
      queryClient.setQueryData(onboardingQueryKeys.detail(), onboarding);
      toast.success('Saved');
    },
    onError: () => {
      toast.error(
        t('counterparts:notifications.updateError', {
          type: 'Onboarding',
        })
      );
    },
  });
};

/**
 * This is a query to store the onboarding requirement to support the edit flow
 */
export const useOnboardingRequirement = () => {
  return useQuery<LocalRequirements | undefined, Error>(
    onboardingQueryKeys.requirement(),
    () => undefined
  );
};

/**
 * This is a mutation to set the onboarding requirement
 */
export const useSetOnboardingRequirement = () => {
  const queryClient = useQueryClient();

  return useMutation<
    LocalRequirements | undefined,
    undefined,
    LocalRequirements | undefined
  >((requirement) => new Promise((resolve) => resolve(requirement)), {
    onSuccess: (requirement) => {
      queryClient.setQueryData(onboardingQueryKeys.requirement(), requirement);
    },
  });
};
