import React from 'react';
import { FormProvider } from 'react-hook-form';

import { components } from '@/api';
import { RHFCheckbox } from '@/components/RHF/RHFCheckbox';
import { RHFDatePicker } from '@/components/RHF/RHFDatePicker';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { RHFTextFieldPhone } from '@/components/RHF/RHFTextFieldPhone';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { FormGroup, FormHelperText } from '@mui/material';

import { useOnboardingRequirementsContext } from '../context';
import {
  isEditingPerson,
  isExecutives,
  isPersonList,
  isRepresentative,
  requirementToRelationship,
} from '../helpers';
import { useOnboardingPerson } from '../hooks';
import { OnboardingAddress } from '../OnboardingAddress';
import { OnboardingFormActions } from '../OnboardingFormActions';
import {
  OnboardingForm,
  OnboardingStepContent,
  OnboardingSubTitle,
} from '../OnboardingLayout';
import type { OnboardingRelationshipCode } from '../types';
import { OnboardingRepresentativeRole } from './OnboardingRepresentativeRole';

export function OnboardingPerson() {
  const { i18n } = useLingui();

  const { currentRequirement, personId } = useOnboardingRequirementsContext();

  const {
    isPending,
    primaryAction,
    secondaryAction,

    relationships: {
      roles,
      ownerState: [isOwnerProvided, setOwnerProvided],
      directorState: [isDirectorProvided, setDirectorProvided],
      onboardingForm: { methods, checkValue, defaultValues, handleSubmit },
      isRoleProvided,
    },
  } = useOnboardingPerson();

  const representative = isRoleProvided('representative');
  const owner = isRoleProvided('owners');
  const director = isRoleProvided('directors');

  const { control, getFieldState } = methods;

  const relationshipError = getFieldState('relationship')?.error;

  const filteredRelationships = roles.filter(
    ({ requirement }) =>
      isPersonList(requirement) &&
      !(representative && isExecutives(requirement))
  );

  const checkRelationshipField = (key: keyof OnboardingPersonRelationship) =>
    defaultValues?.relationship && key in defaultValues.relationship;

  const shouldRenderRelationships =
    filteredRelationships.length > 0 && isEditingPerson(personId);

  const shouldRenderRepresentativeRoles =
    isRepresentative(currentRequirement) &&
    (checkRelationshipField('owner') || checkRelationshipField('director'));

  return (
    <FormProvider {...methods}>
      <OnboardingForm
        onSubmit={handleSubmit(primaryAction)}
        actions={
          <OnboardingFormActions
            isLoading={isPending}
            onSecondaryAction={secondaryAction}
          />
        }
      >
        <OnboardingStepContent>
          <OnboardingSubTitle>
            {t(i18n)`Legal name of person`}
          </OnboardingSubTitle>

          {checkValue('first_name') && (
            <RHFTextField
              disabled={isPending}
              label={t(i18n)`First name`}
              name="first_name"
              control={control}
            />
          )}

          {checkValue('last_name') && (
            <RHFTextField
              disabled={isPending}
              label={t(i18n)`Last name`}
              name="last_name"
              control={control}
            />
          )}

          {checkValue('email') && (
            <RHFTextField
              disabled={isPending}
              label={t(i18n)`Email address`}
              name="email"
              type="email"
              control={control}
            />
          )}
        </OnboardingStepContent>

        {shouldRenderRelationships && (
          <OnboardingStepContent>
            <FormGroup
              sx={{
                gap: 2,
                '& label': {
                  alignItems: 'flex-start',
                },
              }}
            >
              {filteredRelationships.map(({ requirement }) => {
                const relationship = requirementToRelationship(requirement);

                return (
                  <RHFCheckbox
                    key={relationship}
                    name={`relationship.${relationship}`}
                    label={translateMask(relationship, i18n)}
                    control={control}
                  />
                );
              })}
            </FormGroup>

            {relationshipError && (
              <FormHelperText error>{relationshipError.message}</FormHelperText>
            )}
          </OnboardingStepContent>
        )}

        {!!defaultValues?.address && (
          <OnboardingAddress
            title={t(i18n)`Address`}
            defaultValues={defaultValues.address}
            isLoading={isPending}
          />
        )}

        {shouldRenderRepresentativeRoles && (
          <OnboardingStepContent>
            <FormGroup>
              {checkRelationshipField('owner') && (
                <RHFCheckbox
                  name={`relationship.owner`}
                  label={t(i18n)`I own 25% or more of the company.`}
                  control={control}
                />
              )}

              {owner && checkRelationshipField('owner') && (
                <OnboardingRepresentativeRole
                  title={t(
                    i18n
                  )`Are you the only person who owns 25% or more of the company?`}
                  value={isOwnerProvided}
                  onChange={setOwnerProvided}
                />
              )}

              {checkRelationshipField('director') && (
                <RHFCheckbox
                  name={`relationship.director`}
                  label={t(
                    i18n
                  )`I am a member of the governing board of the company.`}
                  control={control}
                />
              )}

              {director && checkRelationshipField('director') && (
                <OnboardingRepresentativeRole
                  title={t(
                    i18n
                  )`Are you the only person on the governing board of the company?`}
                  value={isDirectorProvided}
                  onChange={setDirectorProvided}
                />
              )}
            </FormGroup>
          </OnboardingStepContent>
        )}

        {(checkValue('phone') ||
          checkValue('date_of_birth') ||
          checkRelationshipField('title') ||
          checkRelationshipField('percent_ownership')) && (
          <OnboardingStepContent>
            {checkRelationshipField('title') && (
              <RHFTextField
                disabled={isPending}
                label={t(i18n)`Job title`}
                name="relationship.title"
                control={control}
              />
            )}

            {checkRelationshipField('percent_ownership') && (
              <RHFTextField
                disabled={isPending}
                label={t(i18n)`Percent ownership`}
                name="relationship.percent_ownership"
                type="number"
                control={control}
              />
            )}

            {checkValue('phone') && (
              <RHFTextFieldPhone
                disabled={isPending}
                label={t(i18n)`Phone number`}
                name="phone"
                control={control}
              />
            )}

            {checkValue('date_of_birth') && (
              <RHFDatePicker
                disabled={isPending}
                label={t(i18n)`Date of birth`}
                name="date_of_birth"
                control={control}
              />
            )}
          </OnboardingStepContent>
        )}

        {(checkValue('id_number') || checkValue('ssn_last_4')) && (
          <OnboardingStepContent>
            <OnboardingSubTitle>{t(i18n)`Verify identity`}</OnboardingSubTitle>

            {checkValue('ssn_last_4') && (
              <RHFTextField
                disabled={isPending}
                label={t(i18n)`Last 4 digits of Social Security number`}
                name="ssn_last_4"
                control={control}
                type="tel"
              />
            )}

            {checkValue('id_number') && (
              <RHFTextField
                disabled={isPending}
                type="tel"
                label={t(i18n)`Security number`}
                name="id_number"
                control={control}
              />
            )}
          </OnboardingStepContent>
        )}
      </OnboardingForm>
    </FormProvider>
  );
}

const translateMask = (
  mask: OnboardingRelationshipCode,
  i18n: I18n
): string => {
  switch (mask) {
    case 'owner':
      return t(i18n)`This person owns 25% or more of the company.`;
    case 'director':
      return t(
        i18n
      )`This person is a member of the governing board of the company.`;
    case 'executive':
      return t(
        i18n
      )`This person is an executive or senior manager with significant management responsibility.`;
    default:
      return '';
  }
};

type OnboardingPersonRelationship =
  components['schemas']['OnboardingPersonRelationship'];
type OnboardingRequirement = components['schemas']['OnboardingRequirement'];
