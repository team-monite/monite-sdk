import { createRenderWithClient } from '@/utils/test-utils';
import { renderHook } from '@testing-library/react';

import { useOnboardingValidationSchema } from './hooks';
import { ValidationSchemasType } from './transformers';
import type { OnboardingOutputFieldsType } from './types';

export const getOnboardingValidationSchema = (
  fields: OnboardingOutputFieldsType,
  type: ValidationSchemasType
) => {
  const { result } = renderHook(
    () =>
      useOnboardingValidationSchema({
        fields,
        type,
      }),
    {
      wrapper: createRenderWithClient(),
    }
  );

  return result.current;
};
