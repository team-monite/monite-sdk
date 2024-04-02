import { useCallback, useMemo } from 'react';

import { useUpdateEntityOnboardingData } from '@/core/queries/useEntitiyOnboardingData';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import {
  EntityOnboardingDataRequest,
  type EntityOnboardingDataResponse,
  OnboardingRequirement,
} from '@monite/sdk-api';

import { generateFieldsByValues } from '../transformers';
import { type OnboardingAgreementsSchema } from '../validators';
import {
  type OnboardingFormType,
  useOnboardingForm,
} from './useOnboardingForm';

type OnboardingAgreementsReturnType = {
  isLoading: boolean;

  form: OnboardingFormType<
    OnboardingAgreementsSchema,
    EntityOnboardingDataResponse | undefined
  >;

  /**
   * handleSubmitAgreements: a function that takes in the values of the agreements and
   * patches the onboarding data with the values.
   * @param values
   */
  handleSubmitAgreements: (
    values: OnboardingAgreementsSchema
  ) => Promise<EntityOnboardingDataResponse>;
};

export const useOnboardingAgreements = (): OnboardingAgreementsReturnType => {
  const { data: onboarding } = useOnboardingRequirementsData();
  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const { mutateAsync, isPending: isLoading } = useUpdateEntityOnboardingData();

  const requirements = useMemo(() => {
    if (!onboarding?.requirements) return [];

    return onboarding.requirements.filter((item) =>
      [
        OnboardingRequirement.TOS_ACCEPTANCE,
        OnboardingRequirement.OWNERSHIP_DECLARATION,
      ].includes(item)
    );
  }, [onboarding?.requirements]);

  const values: OnboardingAgreementsSchema = useMemo(
    () =>
      requirements.reduce(
        (acc, requirement) => ({
          ...acc,
          [requirement]: false,
        }),
        {}
      ),
    [requirements]
  );

  const form = useOnboardingForm<
    OnboardingAgreementsSchema,
    EntityOnboardingDataResponse | undefined
  >(values, 'agreements');

  const handleSubmitAgreements = useCallback(
    async (values: OnboardingAgreementsSchema) => {
      const date = new Date().toISOString();

      const data = Object.entries(values).reduce<EntityOnboardingDataRequest>(
        (acc, [requirement]) => ({
          ...acc,
          [requirement]: {
            date,
          },
        }),
        {}
      );

      const response = await mutateAsync(data);

      patchOnboardingRequirements({
        requirements,
        data: generateFieldsByValues({ values: data }),
      });

      return response;
    },
    [mutateAsync, patchOnboardingRequirements, requirements]
  );

  return {
    isLoading,
    handleSubmitAgreements,
    form,
  };
};
