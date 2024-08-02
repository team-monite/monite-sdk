import { useCallback } from 'react';

import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import { useDocumentDescriptions } from '@/core/queries/useOnboardingDocuments';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useOnboardingForm } from '../hooks';
import { OnboardingFile } from '../OnboardingFile';
import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { enrichFieldsByValues } from '../transformers';
import { EntityDocumentsSchema } from '../validators';

export const OnboardingEntityDocuments = () => {
  const { i18n } = useLingui();

  const { data: onboarding } = useOnboardingRequirementsData();

  const { api } = useMoniteContext();

  const { data: entity } = api.entityUsers.getEntityUsersMyEntity.useQuery();

  const { data: descriptions } = useDocumentDescriptions(
    entity?.address.country
  );
  const { mutateAsync, isPending } =
    api.onboardingDocuments.postOnboardingDocuments.useMutation(undefined);

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const fields = onboarding?.data?.entity_documents;

  const { defaultValues, methods, checkValue, handleSubmit } =
    useOnboardingForm<EntityDocumentsSchema, void>(fields, 'entityDocuments');

  const { control } = methods;

  const isOrganization = entity?.type === 'organization';
  const isIndividual = entity?.type === 'individual';

  const getDocumentDescriptions = useCallback(
    (isAdditional: boolean = false) => {
      if (isOrganization) {
        return descriptions?.entity_verification;
      }

      if (isIndividual) {
        if (isAdditional) return descriptions?.additional_verification;

        return descriptions?.verification;
      }

      return undefined;
    },
    [isOrganization, isIndividual, descriptions]
  );

  if (!defaultValues || !fields) return null;

  return (
    <OnboardingForm
      actions={<OnboardingFormActions isLoading={isPending} />}
      onSubmit={handleSubmit(async (values) => {
        await mutateAsync({
          body: values,
        });

        patchOnboardingRequirements({
          requirements: ['entity_documents'],
          data: {
            entity_documents: enrichFieldsByValues(fields, values),
          },
        });
      })}
    >
      {checkValue('verification_document_front') && (
        <OnboardingStepContent>
          <OnboardingFile
            control={control}
            name={'verification_document_front'}
            label={t(i18n)`Front of your identity document`}
            fileType={'identity_documents'}
            description={getDocumentDescriptions()}
          />
        </OnboardingStepContent>
      )}

      {checkValue('verification_document_back') && (
        <OnboardingStepContent>
          <OnboardingFile
            name={'verification_document_back'}
            control={control}
            label={t(i18n)`Back of your identity document`}
            fileType={'identity_documents'}
            description={getDocumentDescriptions()}
          />
        </OnboardingStepContent>
      )}

      {checkValue('additional_verification_document_front') && (
        <OnboardingStepContent>
          <OnboardingFile
            control={control}
            name={'additional_verification_document_front'}
            label={t(i18n)`Front of your additional identity document`}
            fileType={'additional_identity_documents'}
            description={getDocumentDescriptions(true)}
          />
        </OnboardingStepContent>
      )}

      {checkValue('additional_verification_document_back') && (
        <OnboardingStepContent>
          <OnboardingFile
            control={control}
            name={'additional_verification_document_back'}
            label={t(i18n)`Back of your additional identity document`}
            fileType={'additional_identity_documents'}
            description={getDocumentDescriptions(true)}
          />
        </OnboardingStepContent>
      )}
    </OnboardingForm>
  );
};
