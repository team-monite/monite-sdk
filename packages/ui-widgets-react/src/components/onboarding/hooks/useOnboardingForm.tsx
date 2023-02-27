import { useCallback } from 'react';

import {
  OnboardingData,
  OnboardingDataPayload,
  OnboardingRequirement,
} from '@team-monite/sdk-api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import useScrollToError from './useScrollToError';
import useValidation from './useValidation';
import { LocalRequirements } from '../useOnboardingStep';

export type OnboardingFormProps = {
  onSubmit: (payload: Partial<OnboardingDataPayload>) => void;
  formKey: LocalRequirements;
  requirements: OnboardingRequirement[];
  data: Partial<OnboardingData>;
  isLoading: boolean;
};

export default function useOnboardingForm({
  data,
  requirements,
  onSubmit: onParentSubmit,
}: OnboardingFormProps) {
  const validationSchema = useValidation(data, requirements);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: data,
    mode: 'onTouched',
  });

  useScrollToError(methods.formState.errors, requirements);

  const onSubmit = useCallback(
    (data: Partial<OnboardingDataPayload>) => onParentSubmit(data),
    [onParentSubmit, data]
  );

  return {
    methods,
    onSubmit,
  };
}
