import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { getMccCodes } from '../dicts/mccCodes';
import { useOnboardingForm } from '../hooks';
import { enrichFieldsByValues } from '../transformers';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useMyEntity } from '@/core/queries';
import { useUpdateEntityOnboardingData } from '@/core/queries/useEntitiyOnboardingData';
import { usePatchOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { RHFAutocomplete } from '@/ui/RHF/RHFAutocomplete';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InfoOutlined } from '@mui/icons-material';
import { Alert, Box } from '@mui/material';

export const OnboardingBusinessProfile = () => {
  const { i18n } = useLingui();
  const { data: onboarding } = useOnboardingRequirementsData();

  const { mutateAsync, isPending } = useUpdateEntityOnboardingData();

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const {
    // operating_countries: is not used in the form
    operating_countries: _,
    ...fields
  } = onboarding?.data?.business_profile ?? {};

  const { data: entity } = useMyEntity();
  const { api, queryClient } = useMoniteContext();

  const { defaultValues, methods, checkValue, handleSubmit } =
    useOnboardingForm<
      BusinessProfile,
      EntityOnboardingDataResponse | undefined
    >(fields, 'businessProfile', entity?.address?.country);

  const { control } = methods;

  if (!defaultValues || !fields) return null;

  return (
    <OnboardingForm
      actions={<OnboardingFormActions isLoading={isPending} />}
      onSubmit={handleSubmit(async ({ operating_countries: _, ...values }) => {
        const response = await mutateAsync({
          business_profile: values,
        });

        patchOnboardingRequirements({
          requirements: ['business_profile'],
          data: {
            business_profile: enrichFieldsByValues(fields, values),
          },
        });

        try {
          await api.onboardingRequirements.getOnboardingRequirements.invalidateQueries(
            queryClient
          );
        } catch {
          // Ignore invalidation errors
        }
        try {
          await api.frontend.getFrontendOnboardingRequirements.invalidateQueries(
            queryClient
          );
        } catch {
          // Ignore invalidation errors
        }

        return response;
      })}
    >
      <OnboardingStepContent>
        {checkValue('mcc') && (
          <RHFAutocomplete
            disabled={isPending}
            name="mcc"
            control={control}
            label={t(i18n)`Industry`}
            options={getMccCodes(i18n)}
            optionKey="code"
            labelKey="label"
          />
        )}

        {checkValue('url') && (
          <Box sx={{ width: '100%' }}>
            <RHFTextField
              disabled={isPending}
              label={t(i18n)`Business URL`}
              name="url"
              type="url"
              control={control}
              fullWidth
            />
            <Alert
              icon={<InfoOutlined fontSize="small" />}
              severity="info"
              sx={{
                mt: 1,
              }}
            >
              {t(
                i18n
              )`This can be a website, social media profile link or any other unique reachable URL that describes the account's business nature.`}
            </Alert>
          </Box>
        )}

        {checkValue('description_of_goods_or_services') && (
          <RHFTextField
            disabled={isPending}
            label={t(i18n)`Description of goods or services`}
            name="description_of_goods_or_services"
            control={control}
            fullWidth
            multiline
            minRows={3}
          />
        )}
      </OnboardingStepContent>
    </OnboardingForm>
  );
};

type BusinessProfile = components['schemas']['BusinessProfile-Input'];
type EntityOnboardingDataResponse =
  components['schemas']['EntityOnboardingDataResponse'];
