import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

type OrganizationType = { organization: OptionalOrganizationSchema };

type OnboardingEntityOrganizationProps = {
  defaultValues: OptionalOrganizationSchema;
  isLoading: boolean;
};

export const OnboardingEntityOrganization = ({
  defaultValues,
  isLoading,
}: OnboardingEntityOrganizationProps) => {
  const { i18n } = useLingui();
  const { control } = useFormContext<OrganizationType>();

  const checkField = (key: keyof OptionalOrganizationSchema) =>
    defaultValues.hasOwnProperty(key);

  if (!checkField('legal_name')) return null;

  return (
    <RHFTextField
      disabled={isLoading}
      label={t(i18n)`Legal business name`}
      name="organization.legal_name"
      control={control}
    />
  );
};

type OptionalOrganizationSchema =
  components['schemas']['OptionalOrganizationSchema'];
