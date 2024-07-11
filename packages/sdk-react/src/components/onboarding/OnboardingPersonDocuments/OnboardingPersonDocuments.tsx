import { useMemo } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import { useDocumentDescriptions } from '@/core/queries/useOnboardingDocuments';
import { usePersonList } from '@/core/queries/usePerson';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { useOnboardingRequirementsContext } from '../context';
import { useOnboardingForm } from '../hooks';
import { OnboardingFile } from '../OnboardingFile';
import { OnboardingFormActions } from '../OnboardingFormActions';
import {
  OnboardingForm,
  OnboardingStepContent,
  OnboardingSubTitle,
} from '../OnboardingLayout';
import { enrichFieldsByValues } from '../transformers';
import { PersonDocumentsSchema } from '../validators';

export const OnboardingPersonDocuments = () => {
  const { i18n } = useLingui();
  const { data: onboarding } = useOnboardingRequirementsData();

  const { personId, disableEditMode } = useOnboardingRequirementsContext();

  const { api } = useMoniteContext();
  const { mutateAsync, isPending } =
    api.persons.postPersonsIdOnboardingDocuments.useMutation(undefined);

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const { data: personsList } = usePersonList();

  const person = useMemo(
    () => personsList?.data?.find(({ id }) => id === personId),
    [personsList?.data, personId]
  );

  const { data: descriptions } = useDocumentDescriptions(
    person?.address?.country as AllowedCountries | undefined
  );

  const personDocuments = useMemo(
    () => onboarding?.data?.persons_documents ?? [],
    [onboarding?.data?.persons_documents]
  );

  const fields = useMemo(() => {
    const fields = personDocuments.find(({ id }) => id === personId);

    if (!fields) return undefined;

    const { id, ...documents } = fields;

    return documents;
  }, [personDocuments, personId]);

  const { defaultValues, methods, checkValue, handleSubmit } =
    useOnboardingForm<PersonDocumentsSchema, void>(fields, 'personDocuments');

  const { control } = methods;

  if (!personId || !person || !defaultValues || !fields) return null;

  return (
    <OnboardingForm
      actions={
        <OnboardingFormActions
          isLoading={isPending}
          onSecondaryAction={disableEditMode}
        />
      }
      onSubmit={handleSubmit(async (payload) => {
        await mutateAsync({
          path: { person_id: personId },
          body: payload,
        });

        patchOnboardingRequirements({
          data: {
            persons_documents: personDocuments.map((person) =>
              person.id === personId
                ? enrichFieldsByValues(person, payload)
                : person
            ),
          },
        });

        disableEditMode();
      })}
    >
      <OnboardingStepContent>
        <OnboardingSubTitle>
          {`${person.first_name} ${person.last_name}`}
        </OnboardingSubTitle>
      </OnboardingStepContent>

      {checkValue('verification_document_front') && (
        <OnboardingStepContent>
          <OnboardingFile
            control={control}
            name="verification_document_front"
            label={t(i18n)`Front of your identity document`}
            fileType={'identity_documents'}
            description={descriptions?.verification}
          />
        </OnboardingStepContent>
      )}

      {checkValue('verification_document_back') && (
        <OnboardingStepContent>
          <OnboardingFile
            name="verification_document_back"
            control={control}
            label={t(i18n)`Back of your identity document`}
            fileType={'identity_documents'}
            description={descriptions?.verification}
          />
        </OnboardingStepContent>
      )}

      {checkValue('additional_verification_document_front') && (
        <OnboardingStepContent>
          <OnboardingFile
            control={control}
            name="additional_verification_document_back"
            label={t(i18n)`Front of your additional identity document`}
            fileType={'additional_identity_documents'}
            description={descriptions?.additional_verification}
          />
        </OnboardingStepContent>
      )}

      {checkValue('additional_verification_document_back') && (
        <OnboardingStepContent>
          <OnboardingFile
            control={control}
            name="additional_verification_document_back"
            label={t(i18n)`Back of your additional identity document`}
            fileType={'additional_identity_documents'}
            description={descriptions?.additional_verification}
          />
        </OnboardingStepContent>
      )}
    </OnboardingForm>
  );
};

type AllowedCountries = components['schemas']['AllowedCountries'];
