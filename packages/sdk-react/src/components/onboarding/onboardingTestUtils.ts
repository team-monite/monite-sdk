import { createRenderWithClient } from '@/utils/test-utils';
import { renderHook } from '@testing-library/react';
import type { ZodObject, ZodRawShape } from 'zod';

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
  const schema = result.current as ZodObject<ZodRawShape> | undefined;

  if (!schema) return undefined;

  return {
    isValidSync: (values: unknown) => {
      try {
        schema.parse(values);
        return true;
      } catch {
        return false;
      }
    },
  } as const;
};
