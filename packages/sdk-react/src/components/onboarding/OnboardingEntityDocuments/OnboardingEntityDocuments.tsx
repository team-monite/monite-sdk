import { useCallback } from 'react';

import { useMyEntity } from '@/core/queries/useEntities';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import {
  useCreateEntityDocuments,
  useDocumentDescriptions,
} from '@/core/queries/useOnboardingDocuments';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { AllowedFileTypes, OnboardingRequirement } from '@monite/sdk-api';

import { useOnboardingForm } from '../hooks';
import { OnboardingFile } from '../OnboardingFile';
import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { enrichFieldsByValues } from '../transformers';
import { EntityDocumentsSchema } from '../validators';

export const OnboardingEntityDocuments = () => {
  const { i18n } = useLingui();

  const { data: onboarding } = useOnboardingRequirementsData();

  const { data: entity } = useMyEntity();

  const { data: descriptions } = useDocumentDescriptions(
    entity?.address.country
  );

  const { mutateAsync, isPending: isLoading } = useCreateEntityDocuments();

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const fields = onboarding?.data?.entity_documents;

  const { defaultValues, methods, checkValue, handleSubmit } =
    useOnboardingForm<EntityDocumentsSchema, EntityDocumentsSchema>(
      fields,
      'entityDocuments'
    );

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
      actions={<OnboardingFormActions isLoading={isLoading} />}
      onSubmit={handleSubmit(async (values) => {
        const response = await mutateAsync(values);

        patchOnboardingRequirements({
          requirements: [OnboardingRequirement.ENTITY_DOCUMENTS],
          data: {
            entity_documents: enrichFieldsByValues(fields, values),
          },
        });

        return response;
      })}
    >
      {checkValue('verification_document_front') && (
        <OnboardingStepContent>
          <OnboardingFile
            control={control}
            name={'verification_document_front'}
            label={t(i18n)`Front of your identity document`}
            fileType={AllowedFileTypes.IDENTITY_DOCUMENTS}
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
            fileType={AllowedFileTypes.IDENTITY_DOCUMENTS}
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
            fileType={AllowedFileTypes.ADDITIONAL_IDENTITY_DOCUMENTS}
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
            fileType={AllowedFileTypes.ADDITIONAL_IDENTITY_DOCUMENTS}
            description={getDocumentDescriptions(true)}
          />
        </OnboardingStepContent>
      )}
    </OnboardingForm>
  );
};
