'use client';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

import { useOnboardingRequirementsContext } from '../context';
import { useOnboardingPersonList } from '../hooks';
import { OnboardingFormActions } from '../OnboardingFormActions';
import {
  OnboardingForm,
  OnboardingStepContent,
  OnboardingSubTitle,
} from '../OnboardingLayout';
import { findEmptyRequiredFields } from '../transformers';
import { OnboardingPersonView } from './OnboardingPersonView';

export const OnboardingPersonsReview = () => {
  const { i18n } = useLingui();

  const { enablePersonEditMode } = useOnboardingRequirementsContext();

  const {
    personsWithErrors,
    submitPersonsReview,
    form: {
      methods: { handleSubmit },
    },
  } = useOnboardingPersonList();

  return (
    <OnboardingForm
      onSubmit={handleSubmit(submitPersonsReview)}
      actions={<OnboardingFormActions />}
    >
      {personsWithErrors.map((person) => (
        <OnboardingStepContent key={person.id}>
          <OnboardingSubTitle
            action={
              <Button
                variant="text"
                onClick={() => {
                  enablePersonEditMode(person.id);
                }}
              >
                {t(i18n)`Edit`}
              </Button>
            }
          >{`${person.first_name.value} ${person.last_name.value}`}</OnboardingSubTitle>

          <OnboardingPersonView
            {...person}
            emptyFields={findEmptyRequiredFields(person)}
          />
        </OnboardingStepContent>
      ))}

      {personsWithErrors.length === 0 && (
        <OnboardingStepContent>{t(
          i18n
        )`The review for the persons has been completed. You can proceed to the next step.`}</OnboardingStepContent>
      )}
    </OnboardingForm>
  );
};
