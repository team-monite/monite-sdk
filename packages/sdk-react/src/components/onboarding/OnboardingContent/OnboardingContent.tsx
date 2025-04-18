import { components } from '@/api';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Alert, LinearProgress } from '@mui/material';

import { useOnboardingRequirementsContext } from '../context';
import {
  isBankAccount,
  isBusinessProfile,
  isCreatingPerson,
  isDirectors,
  isEditingPerson,
  isExecutives,
  isEntity,
  isOwners,
  isRepresentative,
  isTosAcceptance,
  isOwnershipDeclaration,
  isPersonEditingEnabled,
  isPersons,
  isEntityDocuments,
  isPersonsDocuments,
} from '../helpers';
import { OnboardingAgreements } from '../OnboardingAgreements';
import { OnboardingBankAccount } from '../OnboardingBankAccount';
import { OnboardingBusinessProfile } from '../OnboardingBusinessProfile';
import { OnboardingCompleted } from '../OnboardingCompleted';
import { OnboardingEntity } from '../OnboardingEntity';
import { OnboardingEntityDocuments } from '../OnboardingEntityDocuments';
import { OnboardingTitle, OnboardingLayout } from '../OnboardingLayout';
import { OnboardingPerson } from '../OnboardingPerson';
import { OnboardingPersonDocumentList } from '../OnboardingPersonDocumentList';
import { OnboardingPersonDocuments } from '../OnboardingPersonDocuments';
import { OnboardingPersonList } from '../OnboardingPersonList';
import { OnboardingPersonsReview } from '../OnboardingPersonsReview';
import type { OnboardingPersonId, OnboardingProps } from '../types';

type OnboardingRequirement = components['schemas']['OnboardingRequirement'];

export function OnboardingContent({
  onComplete,
  onContinue,
  showContinueButton,
  ...restProps
}: OnboardingProps = {}) {
  const { i18n } = useLingui();
  const { currentRequirement, personId, onboardingCompleted } =
    useOnboardingRequirementsContext();
  const { isLoading, error } = useOnboardingRequirementsData();

  if (onboardingCompleted) {
    return (
      <OnboardingCompleted
        onComplete={onComplete}
        onContinue={onContinue}
        showContinueButton={showContinueButton}
      />
    );
  }

  if (isLoading || !currentRequirement) {
    return <LinearProgress />;
  }

  const Step = getComponent(currentRequirement, personId);

  if (!Step) return null;

  const stepProps = getStepProps(Step, restProps);

  return (
    <OnboardingLayout
      title={
        <OnboardingTitle
          title={getTitle(currentRequirement, personId, i18n)}
          description={getDescription(currentRequirement, personId, i18n)}
        />
      }
      content={
        error ? (
          <Alert icon={false} severity="error">
            {getAPIErrorMessage(i18n, error)}
          </Alert>
        ) : (
          <Step {...stepProps} />
        )
      }
    />
  );
}

const getTitle = (
  requirement: OnboardingRequirement,
  personId: OnboardingPersonId,
  i18n: I18n
) => {
  if (isCreatingPerson(personId)) {
    if (isDirectors(requirement)) return t(i18n)`Add a director`;
    if (isOwners(requirement)) return t(i18n)`Add an owner`;
    if (isExecutives(requirement)) return t(i18n)`Add an executive`;
    return t(i18n)`Add a person`;
  }

  if (isPersonsDocuments(requirement)) {
    if (isEditingPerson(personId)) return t(i18n)`Edit documents for person`;
    return t(i18n)`Provide documents for persons`;
  }

  if (isEditingPerson(personId)) return t(i18n)`Edit individual`;
  if (isEntity(requirement)) return t(i18n)`Company details`;
  if (isRepresentative(requirement))
    return t(i18n)`Verify that you represent this business`;
  if (isOwners(requirement)) return t(i18n)`Business owners`;
  if (isDirectors(requirement)) return t(i18n)`Business directors`;
  if (isExecutives(requirement)) return t(i18n)`Business executives`;
  if (isBankAccount(requirement))
    return t(i18n)`Add a bank account to receive payments`;
  if (isBusinessProfile(requirement)) return t(i18n)`Business details`;
  if (isPersons(requirement)) return t(i18n)`Persons review`;
  if (isTosAcceptance(requirement)) return t(i18n)`Terms and conditions`;
  if (isOwnershipDeclaration(requirement)) return t(i18n)`Terms and conditions`;
  if (isEntityDocuments(requirement)) return t(i18n)`Entity documents`;

  throw new Error(`Unknown step title ${JSON.stringify(requirement)}`);
};

const getDescription = (
  requirement: OnboardingRequirement,
  personId: OnboardingPersonId,
  i18n: I18n
) => {
  if (isCreatingPerson(personId)) {
    if (isDirectors(requirement))
      return t(
        i18n
      )`It’s required to add any individual who is on the governing board of the company.
`;

    if (isOwners(requirement))
      return t(
        i18n
      )`Please add any individual who owns 25% or more of your business.`;

    if (isExecutives(requirement))
      return t(
        i18n
      )`Please provide information about an executive or senior manager who has significant management responsibility for this business.`;

    return t(
      i18n
    )`It’s required to add any individual who is on the governing board, owns 25% or more of the company or otherwise has significant management control of the company.`;
  }

  if (isPersonsDocuments(requirement)) {
    if (isEditingPerson(personId))
      return t(i18n)`Please upload the required documents to continue.`;

    return t(i18n)`Please upload the required documents to continue.`;
  }

  if (isEditingPerson(personId)) return '';

  if (isEntity(requirement)) return t(i18n)`Tell us more about your business`;

  if (isRepresentative(requirement))
    return t(
      i18n
    )`This form must be completed by someone with control and management of your business. If that’s not you, ask the right person.`;

  if (isOwners(requirement))
    return t(
      i18n
    )`Due to regulatory guidelines, we’re required to collect information on anyone who has significant ownership of your business.`;

  if (isDirectors(requirement))
    return t(
      i18n
    )`Due to regulations, we’re required to collect information about a company’s directors.`;

  if (isExecutives(requirement))
    return t(
      i18n
    )`We’re required to collect information about any executives or senior managers who have significant management responsibility for this business.`;

  if (isBankAccount(requirement))
    return t(
      i18n
    )`Add a bank account to receive transfers of funds to your business.`;

  if (isBusinessProfile(requirement))
    return t(i18n)`Please provide information about your business.`;

  if (isPersons(requirement))
    return t(i18n)`Please correct the errors in persons information.`;

  if (isTosAcceptance(requirement))
    return t(
      i18n
    )`Please review the terms and conditions and accept them to continue.`;

  if (isOwnershipDeclaration(requirement))
    return t(
      i18n
    )`Please review the terms and conditions and accept them to continue.`;

  if (isEntityDocuments(requirement))
    return t(i18n)`Please upload the required documents to continue.`;

  throw new Error(`Unknown step description ${JSON.stringify(requirement)}`);
};

const getComponent = (
  requirement: OnboardingRequirement,
  personId: OnboardingPersonId
) => {
  if (isEntity(requirement)) return OnboardingEntity;
  if (isBusinessProfile(requirement)) return OnboardingBusinessProfile;

  if (isPersonsDocuments(requirement)) {
    if (isEditingPerson(personId)) return OnboardingPersonDocuments;
    return OnboardingPersonDocumentList;
  }

  if (isPersonEditingEnabled(personId)) return OnboardingPerson;
  if (isRepresentative(requirement)) return OnboardingPerson;
  if (isOwners(requirement)) return OnboardingPersonList;
  if (isDirectors(requirement)) return OnboardingPersonList;
  if (isExecutives(requirement)) return OnboardingPersonList;
  if (isPersons(requirement)) return OnboardingPersonsReview;
  if (isBankAccount(requirement)) return OnboardingBankAccount;
  if (isTosAcceptance(requirement)) return OnboardingAgreements;
  if (isOwnershipDeclaration(requirement)) return OnboardingAgreements;
  if (isEntityDocuments(requirement)) return OnboardingEntityDocuments;

  throw new Error(`Unknown step component ${JSON.stringify(requirement)}`);
};

const getStepProps = (
  StepComponent: React.ComponentType<any>,
  restProps: Omit<
    OnboardingProps,
    'onComplete' | 'onContinue' | 'showContinueButton'
  >
) => {
  if (StepComponent === OnboardingBankAccount) {
    return {
      allowedCurrencies: restProps.allowedCurrencies,
      allowedCountries: restProps.allowedCountries,
    };
  }

  return {};
};
