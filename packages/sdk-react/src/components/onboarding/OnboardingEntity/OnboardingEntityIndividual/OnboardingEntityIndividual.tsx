import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

type IndividualType = { individual: OptionalIndividualSchema };

type OnboardingEntityIndividualProps = {
  defaultValues: OptionalIndividualSchema;
  isLoading: boolean;
};

export const OnboardingEntityIndividual = ({
  defaultValues,
  isLoading,
}: OnboardingEntityIndividualProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<IndividualType>();

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

      {checkField('ssn_last_4') && (
        <RHFTextField
          disabled={isLoading}
          label={t(i18n)`Last 4 digits of Social Security number`}
          name="individual.ssn_last_4"
          control={control}
          type="tel"
        />
      )}

      {checkField('id_number') && (
        <RHFTextField
          disabled={isLoading}
          type="tel"
          label={t(i18n)`Full Social Security Number`}
          name="individual.id_number"
          control={control}
        />
      )}
    </>
  );
};

type OptionalIndividualSchema =
  components['schemas']['OptionalIndividualSchema'];
