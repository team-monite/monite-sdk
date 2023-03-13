import { OnboardingData } from '@team-monite/sdk-api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useOnboarding,
  useUpdateOnboarding,
  useSetOnboardingRequirement,
} from 'core/queries/useOnboarding';

// import useScrollToError from './useScrollToError';
import useOnboardingValidation from './useOnboardingValidation';
import {
  LocalRequirements,
  useOnboardingRequirements,
} from './useOnboardingRequirements';

export type OnboardingFormProps = {
  linkId: string;
};

type OnboardingSubmitAction = 'submit' | 'next' | 'save';

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

  // useScrollToError(methods.formState.errors, requirements);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: onboarding?.data,
    mode: 'onTouched',
  });

  const onSave = () => mutateAsync(methods.getValues());

  const onCancel = () => setCurrentRequirement(undefined);

  const onNext = (payload: Partial<OnboardingData>) => mutateAsync(payload);

  const onEdit = async (payload: Partial<OnboardingData>) => {
    await onNext(payload);
    setCurrentRequirement(undefined);
  };

  const onSubmit = () =>
    mutateAsync({
      ...methods.getValues(),
      tos_acceptance_date: new Date().toISOString(),
    });

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
    onboarding,
    methods,
    isLoading,
    actions,
    submitLabel,
    submitAction,
    setCurrentRequirement,
  };
}
