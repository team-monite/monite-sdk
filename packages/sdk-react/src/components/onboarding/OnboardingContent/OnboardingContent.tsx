import { OnboardingAgreements } from '../OnboardingAgreements';
import { OnboardingBankAccountWrapper } from '../OnboardingBankAccountWrapper';
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
import { OnboardingTreasuryTerms } from '../OnboardingTreasuryTerms';
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
  isTreasuryTosAcceptance,
} from '../helpers';
import { toStandardRequirement } from '../helpers';
import type {
  OnboardingPersonId,
  OnboardingProps,
  OnboardingRequirementExtended,
} from '../types';
import { useOnboardingRequirementsAdapter } from '@/core/queries/useOnboardingRequirementsAdapter';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Alert, LinearProgress } from '@mui/material';

export function OnboardingContent({
  onComplete,
  onContinue,
  showContinueButton,
  ...restProps
}: OnboardingProps = {}) {
  const { i18n } = useLingui();
  const { currentRequirement, personId, onboardingCompleted } =
    useOnboardingRequirementsContext();
  const { isLoading, error } = useOnboardingRequirementsAdapter();

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
  requirement: OnboardingRequirementExtended,
  personId: OnboardingPersonId,
  i18n: I18n
) => {
  if (isTreasuryTosAcceptance(requirement))
    return t(i18n)`Treasury terms and conditions`;

  const standardRequirement = toStandardRequirement(requirement);

  if (isCreatingPerson(personId)) {
    if (isDirectors(standardRequirement)) return t(i18n)`Add a director`;
    if (isOwners(standardRequirement)) return t(i18n)`Add an owner`;
    if (isExecutives(standardRequirement)) return t(i18n)`Add an executive`;
    return t(i18n)`Add a person`;
  }

  if (isPersonsDocuments(standardRequirement)) {
    if (isEditingPerson(personId)) return t(i18n)`Edit documents for person`;
    return t(i18n)`Provide documents for persons`;
  }

  if (isEditingPerson(personId)) return t(i18n)`Edit individual`;
  if (isEntity(standardRequirement)) return t(i18n)`Company details`;
  if (isRepresentative(standardRequirement))
    return t(i18n)`Verify that you represent this business`;
  if (isOwners(standardRequirement)) return t(i18n)`Business owners`;
  if (isDirectors(standardRequirement)) return t(i18n)`Business directors`;
  if (isExecutives(standardRequirement)) return t(i18n)`Business executives`;
  if (isBankAccount(standardRequirement)) return t(i18n)`Bank account`;
  if (isBusinessProfile(standardRequirement)) return t(i18n)`Business details`;
  if (isPersons(standardRequirement)) return t(i18n)`Persons review`;
  if (isTosAcceptance(standardRequirement))
    return t(i18n)`Terms and conditions`;
  if (isOwnershipDeclaration(standardRequirement))
    return t(i18n)`Terms and conditions`;
  if (isEntityDocuments(standardRequirement)) return t(i18n)`Entity documents`;

  throw new Error(`Unknown step title ${JSON.stringify(requirement)}`);
};

const getDescription = (
  requirement: OnboardingRequirementExtended,
  personId: OnboardingPersonId,
  i18n: I18n
) => {
  if (isTreasuryTosAcceptance(requirement))
    return t(
      i18n
    )`As a Treasury-eligible entity, please review and accept the additional Treasury Services Agreement to enable financial services.`;

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

  const standardRequirement = toStandardRequirement(requirement);

  if (isPersonsDocuments(standardRequirement)) {
    if (isEditingPerson(personId))
      return t(i18n)`Please upload the required documents to continue.`;

    return t(i18n)`Please upload the required documents to continue.`;
  }

  if (isEditingPerson(personId)) return '';

  if (isEntity(standardRequirement))
    return t(i18n)`Tell us more about your business`;

  if (isRepresentative(standardRequirement))
    return t(
      i18n
    )`This form must be completed by someone with control and management of your business. If that’s not you, ask the right person.`;

  if (isOwners(standardRequirement))
    return t(
      i18n
    )`Due to regulatory guidelines, we’re required to collect information on anyone who has significant ownership of your business.`;

  if (isDirectors(standardRequirement))
    return t(
      i18n
    )`Due to regulations, we’re required to collect information about a company’s directors.`;

  if (isExecutives(standardRequirement))
    return t(
      i18n
    )`We’re required to collect information about any executives or senior managers who have significant management responsibility for this business.`;

  if (isBankAccount(standardRequirement))
    return t(
      i18n
    )`Add a bank account to receive transfers of funds to your business.`;

  if (isBusinessProfile(standardRequirement))
    return t(i18n)`Please provide information about your business.`;

  if (isPersons(standardRequirement))
    return t(i18n)`Please correct the errors in persons information.`;

  if (isTosAcceptance(standardRequirement))
    return t(
      i18n
    )`Please review the terms and conditions and accept them to continue.`;

  if (isOwnershipDeclaration(standardRequirement))
    return t(
      i18n
    )`Please review the terms and conditions and accept them to continue.`;

  if (isEntityDocuments(standardRequirement))
    return t(i18n)`Please upload the required documents to continue.`;

  throw new Error(`Unknown step description ${JSON.stringify(requirement)}`);
};

const getComponent = (
  requirement: OnboardingRequirementExtended,
  personId: OnboardingPersonId
) => {
  if (isTreasuryTosAcceptance(requirement)) return OnboardingTreasuryTerms;

  const standardRequirement = toStandardRequirement(requirement);

  if (isEntity(standardRequirement)) return OnboardingEntity;
  if (isBusinessProfile(standardRequirement)) return OnboardingBusinessProfile;

  if (isPersonsDocuments(standardRequirement)) {
    if (isEditingPerson(personId)) return OnboardingPersonDocuments;
    return OnboardingPersonDocumentList;
  }

  if (isPersonEditingEnabled(personId)) return OnboardingPerson;
  if (isRepresentative(standardRequirement)) return OnboardingPerson;
  if (isOwners(standardRequirement)) return OnboardingPersonList;
  if (isDirectors(standardRequirement)) return OnboardingPersonList;
  if (isExecutives(standardRequirement)) return OnboardingPersonList;
  if (isPersons(standardRequirement)) return OnboardingPersonsReview;
  if (isBankAccount(standardRequirement)) return OnboardingBankAccountWrapper;
  if (isTosAcceptance(standardRequirement)) return OnboardingAgreements;
  if (isOwnershipDeclaration(standardRequirement)) return OnboardingAgreements;
  if (isEntityDocuments(standardRequirement)) return OnboardingEntityDocuments;

  throw new Error(`Unknown step component ${JSON.stringify(requirement)}`);
};

const getStepProps = (
  StepComponent: React.ComponentType<any>,
  restProps: Omit<
    OnboardingProps,
    'onComplete' | 'onContinue' | 'showContinueButton'
  >
) => {
  if (StepComponent === OnboardingBankAccountWrapper) {
    return {
      allowedCurrencies: restProps.allowedCurrencies,
      allowedCountries: restProps.allowedCountries,
    };
  }

  return {};
};
