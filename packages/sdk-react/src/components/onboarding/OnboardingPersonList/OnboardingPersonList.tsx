import { FormProvider } from 'react-hook-form';

import { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';

import { useOnboardingRequirementsContext } from '../context';
import {
  isDirectors,
  isExecutives,
  isOwners,
  PERSON_CREATION,
} from '../helpers';
import { useOnboardingPersonList } from '../hooks';
import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { OnboardingPersonListItem } from './OnboardingPersonListItem';
import { OnboardingPersonMenu } from './OnboardingPersonMenu';

export const OnboardingPersonList = () => {
  const { i18n } = useLingui();

  const { currentRequirement, enablePersonEditMode } =
    useOnboardingRequirementsContext();

  const {
    isPending,
    shouldRenderPersonList,
    shouldRenderMenu,

    personsWithRequirement,
    personsWithoutRequirement,

    updatePersonRelationship,
    updateOrganizationRequirements,

    form: { methods },
  } = useOnboardingPersonList();

  if (!currentRequirement) return null;

  const title = shouldRenderPersonList
    ? getFillListTitle(currentRequirement, i18n)
    : getEmptyListTitle(currentRequirement, i18n);

  const { handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <OnboardingForm
        onSubmit={handleSubmit(updateOrganizationRequirements)}
        actions={<OnboardingFormActions />}
      >
        <OnboardingStepContent>
          <Typography variant="body1">
            {getDescription(currentRequirement, i18n)}
          </Typography>

          {shouldRenderPersonList && (
            <StyledPersonList>
              {personsWithRequirement.map((person) => {
                const isRepresentative =
                  isExecutives(currentRequirement) &&
                  person.relationship.representative;

                return (
                  <OnboardingPersonListItem
                    key={person.id}
                    person={person}
                    deleteButton={
                      <Tooltip
                        arrow
                        title={
                          isRepresentative &&
                          t(
                            i18n
                          )`Removing an executive role from this person is not allowed`
                        }
                      >
                        <span>
                          <IconButton
                            aria-label={t(i18n)`Remove person`}
                            disabled={isPending || isRepresentative}
                            onClick={() =>
                              updatePersonRelationship(person.id, false)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    }
                  />
                );
              })}
            </StyledPersonList>
          )}

          {shouldRenderMenu && (
            <OnboardingPersonMenu
              disabled={isPending}
              title={title}
              variant={'outlined'}
            >
              <MenuItem onClick={() => enablePersonEditMode(PERSON_CREATION)}>
                {t(i18n)`Add someone new`}
              </MenuItem>

              <Divider />
              <MenuItem disabled>{t(i18n)`Select someone`}</MenuItem>

              {personsWithoutRequirement.map(
                ({ id, first_name, last_name }) => (
                  <MenuItem
                    key={id}
                    onClick={() => updatePersonRelationship(id, true)}
                  >{`${first_name.value} ${last_name.value}`}</MenuItem>
                )
              )}
            </OnboardingPersonMenu>
          )}

          {!shouldRenderMenu && (
            <Button
              onClick={() => enablePersonEditMode(PERSON_CREATION)}
              disabled={isPending}
              variant="outlined"
              color="primary"
            >
              {title}
            </Button>
          )}
        </OnboardingStepContent>
      </OnboardingForm>
    </FormProvider>
  );
};

const StyledPersonList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export function getDescription(
  requirement: OnboardingRequirement,
  i18n: I18n
): string {
  if (isDirectors(requirement))
    return t(
      i18n
    )`Please list all individuals who are members of the governing board of the company.`;
  if (isOwners(requirement))
    return t(
      i18n
    )`Please add any individual who owns 25% or more of the company.`;
  return t(i18n)`Please list all business executives from the company.`;
}

export function getEmptyListTitle(
  requirement: OnboardingRequirement,
  i18n: I18n
): string {
  if (isDirectors(requirement)) return t(i18n)`Add a director`;
  if (isOwners(requirement)) return t(i18n)`Add a business owner`;
  return t(i18n)`Add a business executive`;
}

export function getFillListTitle(
  requirement: OnboardingRequirement,
  i18n: I18n
): string {
  if (isDirectors(requirement)) return t(i18n)`Add another director`;
  if (isOwners(requirement)) return t(i18n)`Add another owner`;
  return t(i18n)`Add another executive`;
}

type OnboardingRequirement = components['schemas']['OnboardingRequirement'];
