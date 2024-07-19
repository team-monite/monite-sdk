import React, { useCallback, useMemo } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button } from '@mui/material';

import { useOnboardingRequirementsContext } from '../context';
import { OnboardingFileDescription } from '../OnboardingFile/OnboardingFileDescription';
import { OnboardingFormActions } from '../OnboardingFormActions';
import {
  OnboardingForm,
  OnboardingStepContent,
  OnboardingSubTitle,
  OnboardingTitle,
} from '../OnboardingLayout';
import {
  generateErrorsByFields,
  generateOnboardingValidationSchema,
  generateValuesByFields,
} from '../transformers';

export const OnboardingPersonDocumentList = () => {
  const { i18n } = useLingui();
  const { data: onboarding } = useOnboardingRequirementsData();

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const { enablePersonEditMode } = useOnboardingRequirementsContext();

  const { api } = useMoniteContext();
  const personsQuery = api.persons.getPersons.useQuery({});
  const persons = personsQuery.data?.data;

  const personDocuments = useMemo(
    () => onboarding?.data?.persons_documents ?? [],
    [onboarding?.data?.persons_documents]
  );

  const arePersonDocumentsValid = useCallback(
    (personDocuments: OnboardingPersonDocuments) => {
      const errors = generateErrorsByFields(personDocuments);
      const values = generateValuesByFields(personDocuments);

      const validationSchema = generateOnboardingValidationSchema({
        fields: personDocuments,
        type: 'personDocuments',
        i18n,
      });

      const areFieldsValid = errors.length === 0;
      const areValuesValid = validationSchema.isValidSync(values);

      return areFieldsValid && areValuesValid;
    },
    [i18n]
  );

  const filteredPersonDocuments = useMemo(
    () =>
      personDocuments.filter(
        (personDocuments) => !arePersonDocumentsValid(personDocuments)
      ),
    [personDocuments, arePersonDocumentsValid]
  );

  return (
    <OnboardingForm
      actions={<OnboardingFormActions />}
      onSubmit={(event) => {
        event.preventDefault();

        if (filteredPersonDocuments.length > 0) return;

        patchOnboardingRequirements({
          requirements: ['persons_documents'],
        });
      }}
    >
      {filteredPersonDocuments.length === 0 && (
        <OnboardingTitle
          title={t(i18n)`All documents are provided`}
          description={t(i18n)`You can continue to the next step`}
          icon={
            <CheckCircleIcon
              sx={{ color: 'success.light', fontSize: '2rem' }}
            />
          }
        />
      )}

      {filteredPersonDocuments.map(
        ({
          id,
          verification_document_front,
          verification_document_back,
          additional_verification_document_front,
          additional_verification_document_back,
        }) => {
          const person = persons?.find((person) => person.id === id);

          const descriptions = [
            {
              existed: verification_document_front,
              description: t(i18n)`Front of your identity document`,
            },
            {
              existed: verification_document_back,
              description: t(i18n)`Back of your identity document`,
            },
            {
              existed: additional_verification_document_front,
              description: t(i18n)`Front of your additional document`,
            },
            {
              existed: additional_verification_document_back,
              description: t(i18n)`Back of your additional document`,
            },
          ]
            .filter(({ existed }) => !!existed)
            .map(({ description }) => description);

          if (!person) return null;

          return (
            <OnboardingStepContent
              key={id}
              title={
                <OnboardingSubTitle>
                  {t(
                    i18n
                  )`Please provide the following documents for the person`}
                  &nbsp;{`'${person.first_name} ${person.last_name}':`}
                </OnboardingSubTitle>
              }
            >
              <OnboardingFileDescription descriptions={descriptions} />

              <Button
                onClick={() => enablePersonEditMode(id)}
                variant="contained"
              >{t(i18n)`Provide documents`}</Button>
            </OnboardingStepContent>
          );
        }
      )}
    </OnboardingForm>
  );
};

type OnboardingPersonDocuments =
  components['schemas']['OnboardingPersonDocuments'];
