import { OnboardingData, OnboardingRequirement } from '@team-monite/sdk-api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useOnboardingById,
  useUpdateOnboarding,
} from 'core/queries/useOnboardingById';

// import useScrollToError from './useScrollToError';
import useValidation from './useValidation';

export type OnboardingFormProps = {
  requirements: OnboardingRequirement[];
  data: Partial<OnboardingData>;
  linkId: string;
};

export default function useOnboardingForm({
  data,
  requirements,
  linkId,
}: OnboardingFormProps) {
  const validationSchema = useValidation(data, requirements);
  const { isLoading, mutate } = useUpdateOnboarding(linkId);
  const { data: onboarding } = useOnboardingById(linkId);

  // useScrollToError(methods.formState.errors, requirements);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: data,
    mode: 'onTouched',
  });

  const onSave = () => mutate(methods.getValues());
  const onNext = (payload: Partial<OnboardingData>) => mutate(payload);
  const onSubmit = () =>
    mutate({
      ...methods.getValues(),
      tos_acceptance_date: new Date().toISOString(),
    });

  return {
    onboarding,
    methods,
    isLoading,
    onNext,
    onSave,
    onSubmit,
  };
}
