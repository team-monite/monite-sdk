import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { getIdentificationLabel } from '@/components/onboarding/helpers';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

type IndividualType = {
  individual: OptionalIndividualSchema;
  address?: { country: string };
};

type OnboardingEntityIndividualProps = {
  defaultValues: OptionalIndividualSchema;
  isLoading: boolean;
};

export const OnboardingEntityIndividual = ({
  defaultValues,
  isLoading,
}: OnboardingEntityIndividualProps) => {
  const { i18n } = useLingui();
  const { control, watch } = useFormContext<IndividualType>();

  const addressCountry = watch('address.country');

  const checkField = (key: keyof OptionalIndividualSchema) =>
    defaultValues.hasOwnProperty(key);

  return (
    <>
      {checkField('first_name') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`First name`}
          name="individual.first_name"
          control={control}
        />
      )}

      {checkField('last_name') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`Last name`}
          name="individual.last_name"
          control={control}
        />
      )}

      {checkField('title') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`Job title`}
          name="individual.title"
          control={control}
        />
      )}

      {checkField('date_of_birth') && (
        <RHFDatePicker
          disabled={isLoading}
          label={t(i18n)`Date of birth`}
          name="individual.date_of_birth"
          control={control}
        />
      )}

      {checkField('id_number') && (
        <RHFTextField
          disabled={isLoading}
          type="tel"
          label={t(i18n)`${getIdentificationLabel(
            addressCountry as AllowedCountries
          )}`}
          name="individual.id_number"
          control={control}
        />
      )}
    </>
  );
};

type OptionalIndividualSchema =
  components['schemas']['OptionalIndividualSchema'];
type AllowedCountries = components['schemas']['AllowedCountries'];
