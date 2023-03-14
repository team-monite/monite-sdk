import { OnboardingData } from '@team-monite/sdk-api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useOnboarding,
  useUpdateOnboarding,
  useSetOnboardingRequirement,
} from 'core/queries/useOnboarding';

import useOnboardingValidation from './useOnboardingValidation';

import {
  LocalRequirements,
  useOnboardingRequirements,
} from './useOnboardingRequirements';
import { useCallback } from 'react';

export type OnboardingFormProps = {
  linkId: string;
};

export type OnboardingSubmitAction = 'submit' | 'next' | 'save';

export default function useOnboardingForm(
  linkId: OnboardingFormProps['linkId']
) {
  const { data: onboarding } = useOnboarding(linkId);
  const { mutate: setCurrentRequirement } = useSetOnboardingRequirement();
  const { isLoading, mutateAsync } = useUpdateOnboarding(linkId);
  const { isEditMode, step, requirements } = useOnboardingRequirements(linkId);

  const validationSchema = useOnboardingValidation(
    onboarding?.data,
    requirements
  );

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: onboarding?.data,
    mode: 'onTouched',
  });

  const onSave = useCallback(
    () => mutateAsync(methods.getValues()),
    [mutateAsync, methods.getValues]
  );

  const onCancel = useCallback(
    () => setCurrentRequirement(undefined),
    [setCurrentRequirement]
  );

  const onNext = useCallback(
    (payload: Partial<OnboardingData>) => mutateAsync(payload),
    [mutateAsync]
  );

  const onEdit = useCallback(
    async (payload: Partial<OnboardingData>) => {
      await onNext(payload);
      setCurrentRequirement(undefined);
    },
    [setCurrentRequirement, onNext]
  );

  const onSubmit = useCallback(
    () =>
      mutateAsync({
        ...methods.getValues(),
        tos_acceptance_date: new Date().toISOString(),
      }),
    [mutateAsync, methods.getValues]
  );

  const submitActions: Record<
    OnboardingSubmitAction,
    (payload: Partial<OnboardingData>) => void
  > = {
    save: onEdit,
    next: onNext,
    submit: onSubmit,
  };

  const getSubmitLabel = (): OnboardingSubmitAction => {
    if (step === LocalRequirements.review) return 'submit';
    if (isEditMode) return 'save';
    return 'next';
  };

  const getActions = () => {
    if (isEditMode) return { onCancel };
    return { onSave };
  };

  const actions = getActions();
  const submitLabel = getSubmitLabel();
  const submitAction = submitActions[submitLabel];

  return {
    onSubmit,
    onboarding,
    methods,
    isLoading,
    actions,
    submitLabel,
    submitAction,
    setCurrentRequirement,
  };
}
