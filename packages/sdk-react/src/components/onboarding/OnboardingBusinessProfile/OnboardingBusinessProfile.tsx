import { RHFAutocomplete } from '@/components/RHF/RHFAutocomplete';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useUpdateEntityOnboardingData } from '@/core/queries/useEntitiyOnboardingData';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  BusinessProfile,
  EntityOnboardingDataResponse,
  OnboardingRequirement,
} from '@monite/sdk-api';

import { getMccCodes } from '../dicts/mccCodes';
import { useOnboardingForm } from '../hooks';
import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { enrichFieldsByValues } from '../transformers';

export const OnboardingBusinessProfile = () => {
  const { i18n } = useLingui();
  const { data: onboarding } = useOnboardingRequirementsData();

  const { mutateAsync, isPending: isLoading } = useUpdateEntityOnboardingData();

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const fields = onboarding?.data?.business_profile;

  const { defaultValues, methods, checkValue, handleSubmit } =
    useOnboardingForm<
      BusinessProfile,
      EntityOnboardingDataResponse | undefined
    >(fields, 'businessProfile');

  const { control } = methods;

  if (!defaultValues || !fields) return null;

  return (
    <OnboardingForm
      actions={<OnboardingFormActions isLoading={isLoading} />}
      onSubmit={handleSubmit(async (values) => {
        const response = await mutateAsync({
          business_profile: values,
        });

        patchOnboardingRequirements({
          requirements: [OnboardingRequirement.BUSINESS_PROFILE],
          data: {
            business_profile: enrichFieldsByValues(fields, values),
          },
        });

        return response;
      })}
    >
      <OnboardingStepContent>
        {checkValue('mcc') && (
          <RHFAutocomplete
            disabled={isLoading}
            name="mcc"
            control={control}
            label={t(i18n)`Industry`}
            options={getMccCodes(i18n)}
            optionKey="code"
            labelKey="label"
          />
        )}

        {checkValue('url') && (
          <RHFTextField
            disabled={isLoading}
            label={t(i18n)`Business website`}
            name="url"
            type="url"
            control={control}
          />
        )}
      </OnboardingStepContent>
    </OnboardingForm>
  );
};
