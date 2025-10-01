import { useOnboardingRequirementsContext } from '../context/OnboardingRequirementsContext';
import {
  isRequirementPresentInPersonList,
  isDirectors,
  isExecutives,
  isOwners,
  isCreatingPerson,
  isEditingPerson,
  isPersonList,
  isRepresentative,
  toStandardRequirement,
} from '../helpers';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { useMemo } from 'react';

type OnboardingActionCode =
  | 'finish'
  | 'cancel'
  | 'addRequirement'
  | 'updateRequirement'
  | 'saveClose'
  | 'createPerson'
  | 'createRepresentative'
  | 'updatePerson'
  | 'updateEntityOrganizationRequirement'
  | 'noOwners'
  | 'noExecutives'
  | 'noDirectors';

export type OnboardingActionsReturnType = {
  /**
   * primaryActionCode a string that represents the action code for the primary action button.
   */
  primaryActionCode: OnboardingActionCode;

  /**
   * primaryLabel a string that represents the label code for the primary action button.
   */
  primaryLabel: string;

  /**
   * secondaryActionCode a string that represents the action code for the secondary action button.
   */
  secondaryActionCode: OnboardingActionCode | undefined;

  /**
   * secondaryLabel a string that represents the label code for the secondary action button.
   */
  secondaryLabel: string | undefined;

  /**
   * secondaryAction a function that represents the secondary action
   */
  secondaryAction?: () => void;
};

export function useOnboardingActions(): OnboardingActionsReturnType {
  const { i18n } = useLingui();
  const { currentRequirement, disableEditMode, isEditMode, personId } =
    useOnboardingRequirementsContext();
  const { data: onboarding } = useOnboardingRequirementsData();

  const persons = useMemo(
    () => onboarding?.data?.persons || [],
    [onboarding?.data?.persons]
  );

  const primaryActionCode = useMemo<OnboardingActionCode>(() => {
    if (isCreatingPerson(personId)) return 'createPerson';
    if (isEditingPerson(personId)) return 'updatePerson';

    const standardRequirement = toStandardRequirement(currentRequirement);
    
    if (isRepresentative(standardRequirement)) return 'createRepresentative';

    if (isPersonList(standardRequirement)) {
      const isEmptyPersonList = isRequirementPresentInPersonList(
        persons,
        standardRequirement,
        true
      );

      if (isEmptyPersonList) return 'updateEntityOrganizationRequirement';
      if (isOwners(standardRequirement)) return 'noOwners';
      if (isDirectors(standardRequirement)) return 'noDirectors';
      if (isExecutives(standardRequirement)) return 'noExecutives';
      return 'addRequirement';
    }

    if (isEditMode) return 'updateRequirement';
    return 'addRequirement';
  }, [personId, currentRequirement, isEditMode, persons]);

  const secondaryActionCode = useMemo<OnboardingActionCode | undefined>(() => {
    if (isEditMode) return 'cancel';
    return undefined;
  }, [isEditMode]);

  const secondaryAction = useMemo(() => {
    switch (secondaryActionCode) {
      case 'cancel':
        return disableEditMode;
      default:
        return undefined;
    }
  }, [secondaryActionCode, disableEditMode]);

  return {
    primaryActionCode,
    primaryLabel: getFormLabelByCode(primaryActionCode, i18n),
    secondaryActionCode,
    secondaryLabel: secondaryActionCode
      ? getFormLabelByCode(secondaryActionCode, i18n)
      : undefined,
    secondaryAction,
  };
}

const getFormLabelByCode = (code: OnboardingActionCode, i18n: I18n): string => {
  switch (code) {
    case 'finish':
      return t(i18n)`Agree & Submit`;
    case 'addRequirement':
      return t(i18n)`Continue`;
    case 'updateRequirement':
      return t(i18n)`Save changes`;
    case 'cancel':
      return t(i18n)`Cancel`;
    case 'saveClose':
      return t(i18n)`Save for later`;
    case 'createRepresentative':
      return t(i18n)`Continue`;
    case 'createPerson':
      return t(i18n)`Add`;
    case 'updatePerson':
      return t(i18n)`Save changes`;
    case 'updateEntityOrganizationRequirement':
      return t(i18n)`Done, continue`;
    case 'noOwners':
      return t(i18n)`Continue with no owners`;
    case 'noExecutives':
      return t(i18n)`Continue with no executives`;
    case 'noDirectors':
      return t(i18n)`Continue with no directors`;
  }
};
