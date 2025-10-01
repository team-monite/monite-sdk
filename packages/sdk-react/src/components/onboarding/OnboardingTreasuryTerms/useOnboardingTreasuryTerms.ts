import {
  type OnboardingFormType,
  useOnboardingForm,
} from '../hooks/useOnboardingForm';
import type { OnboardingRequirementExtended } from '../types';
import { type OnboardingTreasuryTermsSchema } from '../validators';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMyEntity } from '@/core/queries';
import { useUpdateEntityOnboardingData } from '@/core/queries/useEntitiyOnboardingData';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { useCallback, useMemo, useState } from 'react';

type OnboardingTreasuryTermsReturnType = {
  isPending: boolean;

  form: OnboardingFormType<
    OnboardingTreasuryTermsSchema,
    EntityOnboardingDataResponse | undefined
  >;

  /**
   * handleSubmitTreasuryTerms: a function that takes in the values of the treasury terms and
   * patches the onboarding data with the values.
   * @param values
   */
  handleSubmitTreasuryTerms: (
    values: OnboardingTreasuryTermsSchema
  ) => Promise<EntityOnboardingDataResponse>;

  /**
   * Indicates if Treasury terms acceptance is required
   */
  hasTreasuryRequirement: boolean;

  /**
   * Error from the last submission attempt
   */
  error: Error | null;
};

export const useOnboardingTreasuryTerms =
  (): OnboardingTreasuryTermsReturnType => {
    const { data: onboarding } = useOnboardingRequirementsData();
    const [error, setError] = useState<Error | null>(null);

    const { mutateAsync, isPending } = useUpdateEntityOnboardingData();
    const { api, queryClient } = useMoniteContext();

    const hasTreasuryRequirement = useMemo(() => {
      const requirements = onboarding?.requirements as
        | OnboardingRequirementExtended[]
        | undefined;

      return Boolean(requirements?.includes('treasury_tos_acceptance'));
    }, [onboarding?.requirements]);

    const values: OnboardingTreasuryTermsSchema = useMemo(
      () => ({
        treasury_tos_acceptance: false,
      }),
      []
    );

    const { data: entity } = useMyEntity();

    const form = useOnboardingForm<
      OnboardingTreasuryTermsSchema,
      EntityOnboardingDataResponse | undefined
    >(values, 'treasury_terms', entity?.address?.country);

    const handleSubmitTreasuryTerms = useCallback(
      async (values: OnboardingTreasuryTermsSchema) => {
        setError(null);

        try {
          if (!values.treasury_tos_acceptance) {
            const validationError = new Error(
              'Treasury Services Agreement must be accepted to continue'
            );
            setError(validationError);
            throw validationError;
          }

          const date = new Date().toISOString();

          const data = {
            treasury_tos_acceptance: {
              date,
            },
          };

          try {
            api.onboardingRequirements.getOnboardingRequirements.setQueryData(
              {},
              // Optimistic update to remove treasury_tos_acceptance from cache
              // This is a best-effort update; the backend refetch below will ensure consistency
              ((existing: GetOnboardingRequirementsResponse | undefined) => {
                if (!existing?.data) {
                  return existing;
                }

                return {
                  data: existing.data.map(
                    (methodReq: SingleOnboardingRequirementsResponse) => {
                      const currently_due =
                        methodReq.requirements.currently_due.filter(
                          (r: string) => !r.includes('treasury_tos_acceptance')
                        );

                      const requirements_errors =
                        methodReq.requirements_errors.filter(
                          (e: OnboardingRequirementsError) =>
                            !e.requirement.includes('treasury_tos_acceptance')
                        );

                      return {
                        ...methodReq,
                        requirements: {
                          ...methodReq.requirements,
                          currently_due,
                        },
                        requirements_errors,
                      };
                    }
                  ),
                };
              }) as Parameters<
                typeof api.onboardingRequirements.getOnboardingRequirements.setQueryData
              >[1],
              queryClient
            );
          } catch {
            // Ignore cache update errors - backend refetch will fix any issues
          }

          const response = await mutateAsync(data);

          await Promise.allSettled([
            api.onboardingRequirements.getOnboardingRequirements.invalidateQueries(
              queryClient
            ),
            api.frontend.getFrontendOnboardingRequirements.invalidateQueries(
              queryClient
            ),
          ]);
          return response;
        } catch (err) {
          if (!error) {
            const apiError =
              err instanceof Error
                ? err
                : new Error(
                    'Failed to submit Treasury terms. Please try again.'
                  );
            setError(apiError);
          }
          throw err;
        }
      },
      [api, mutateAsync, queryClient, error]
    );

    return {
      error,
      isPending,
      form,
      hasTreasuryRequirement,
      handleSubmitTreasuryTerms,
    };
  };

type EntityOnboardingDataResponse =
  components['schemas']['EntityOnboardingDataResponse'];
type OnboardingRequirementsError =
  components['schemas']['OnboardingRequirementsError'];
type SingleOnboardingRequirementsResponse =
  components['schemas']['SingleOnboardingRequirementsResponse'];
type GetOnboardingRequirementsResponse =
  components['schemas']['GetOnboardingRequirementsResponse'];
