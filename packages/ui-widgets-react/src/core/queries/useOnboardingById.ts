import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  OnboardingIndividualResponse,
  OnboardingDataPayload,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';

const ONBOARDING_QUERY = 'onboarding';

export const onboardingQueryKeys = {
  all: () => [ONBOARDING_QUERY],
  detail: () => [...onboardingQueryKeys.all(), 'detail'],
};

export const useOnboardingById = (linkId: string) => {
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
    OnboardingDataPayload
  >((payload) => monite.api.onboarding.updateRequirements(linkId, payload), {
    onSuccess: (onboarding) => {
      queryClient.setQueryData(onboardingQueryKeys.detail(), onboarding);
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
