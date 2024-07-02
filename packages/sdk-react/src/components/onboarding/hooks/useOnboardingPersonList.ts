'use client';

import { useCallback, useMemo } from 'react';

import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import {
  EntityResponse,
  OnboardingPerson,
  OnboardingRequirement,
  PersonResponse,
} from '@monite/sdk-api';

import { useOnboardingRequirementsContext } from '../context';
import {
  hasPersonRequirement,
  isRequirementPresentInPersonList,
  requirementToRelationship,
} from '../helpers';
import {
  findEmptyRequiredFields,
  generateErrorsByFields,
} from '../transformers';
import { useOnboardingForm } from './useOnboardingForm';
import { useOnboardingPerson } from './useOnboardingPerson';

export type OnboardingPersonListReturnType = {
  shouldRenderPersonList: boolean;
  shouldRenderMenu: boolean;
  isPending: boolean;

  personsWithErrors: OnboardingPerson[];
  personsWithRequirement: OnboardingPerson[];
  personsWithoutRequirement: OnboardingPerson[];

  form: ReturnType<typeof useOnboardingForm>;

  updatePersonRelationship: (
    id: string,
    value: boolean
  ) => Promise<PersonResponse>;
  updateOrganizationRequirements: () => Promise<EntityResponse>;

  submitPersonsReview: () => void;
};

export function useOnboardingPersonList(): OnboardingPersonListReturnType {
  const { data: onboarding } = useOnboardingRequirementsData();

  const { currentRequirement } = useOnboardingRequirementsContext();

  const form = useOnboardingForm({}, 'person');

  const { updatePerson, isPending, updateOrganizationRequirements } =
    useOnboardingPerson();

  const patchOnboardingRequirementsData = usePatchOnboardingRequirementsData();

  const updatePersonRelationship = useCallback(
    (id: string, value: boolean) =>
      updatePerson(id, {
        relationship: {
          [requirementToRelationship(currentRequirement!)]: value,
        },
      }),
    [currentRequirement, updatePerson]
  );

  const persons = useMemo(
    () => onboarding?.data?.persons || [],
    [onboarding?.data?.persons]
  );

  const personsWithRequirement = useMemo(() => {
    if (!currentRequirement) return persons;

    return persons.filter((person) =>
      hasPersonRequirement(person, currentRequirement)
    );
  }, [currentRequirement, persons]);

  const personsWithoutRequirement = useMemo(() => {
    if (!currentRequirement) return persons;

    return persons.filter(
      (person) => !hasPersonRequirement(person, currentRequirement)
    );
  }, [currentRequirement, persons]);

  const personsWithErrors = useMemo(() => {
    return persons.filter((person) => {
      return (
        generateErrorsByFields(person).length > 0 ||
        findEmptyRequiredFields(person).length > 0
      );
    });
  }, [persons]);

  const shouldRenderPersonList = isRequirementPresentInPersonList(
    persons,
    currentRequirement,
    true
  );

  const shouldRenderMenu = isRequirementPresentInPersonList(
    persons,
    currentRequirement,
    false
  );

  const errors = useMemo(
    () => persons.flatMap((person) => generateErrorsByFields(person)),
    [persons]
  );

  const scrollToError = useCallback(() => {
    if (errors.length === 0) return;

    const firstError = errors[0]?.message;

    if (!firstError) return;

    const elements = document.querySelectorAll('td');
    const element = Array.from(elements).find(
      (element) => element.textContent === firstError
    );

    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [errors]);

  const submitPersonsReview = useCallback(() => {
    if (errors.length > 0) {
      return scrollToError();
    }

    patchOnboardingRequirementsData({
      requirements: [OnboardingRequirement.PERSONS],
    });
  }, [errors.length, patchOnboardingRequirementsData, scrollToError]);

  return {
    shouldRenderPersonList,
    shouldRenderMenu,
    isPending,
    form,
    updatePersonRelationship,
    updateOrganizationRequirements,
    personsWithErrors,
    personsWithRequirement,
    personsWithoutRequirement,
    submitPersonsReview,
  };
}
