import { OnboardingFieldsType } from '@/components/onboarding/types';
import { useLingui } from '@lingui/react';

import {
  generateOnboardingValidationSchema,
  ValidationSchemasType,
} from '../transformers';

export const useOnboardingValidationSchema = ({
  fields,
  type,
}: {
  fields?: OnboardingFieldsType;
  type: ValidationSchemasType;
}) => {
  const { i18n } = useLingui();

  if (!fields) return undefined;

  return generateOnboardingValidationSchema({
    fields,
    type,
    i18n,
  });
};
