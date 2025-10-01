import { useCallback, useMemo } from 'react';

import { components } from '@/api';
import { useMyEntity } from '@/core/queries';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import { useMoniteContext } from '@/core/context/MoniteContext';

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
import { toStandardRequirement } from '../helpers';
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

  const { data: entity } = useMyEntity();

  const { api, queryClient } = useMoniteContext();

  const form = useOnboardingForm({}, 'person', entity?.address?.country);

  const { updatePerson, isPending, updateOrganizationRequirements } =
    useOnboardingPerson();

  const patchOnboardingRequirementsData = usePatchOnboardingRequirementsData();

  const updatePersonRelationship = useCallback(
    async (id: string, value: boolean): Promise<PersonResponse> => {
      const standardRequirement = toStandardRequirement(currentRequirement);
      if (!standardRequirement) {
        throw new Error('Invalid requirement: Treasury requirements cannot be used for person relationships');
      }
      
      return await updatePerson(id, {
        relationship: {
          [requirementToRelationship(standardRequirement)]: value,
        },
      });
    },
    [currentRequirement, updatePerson]
  );

  const persons = useMemo(
    () => onboarding?.data?.persons || [],
    [onboarding?.data?.persons]
  );

  const personsWithRequirement = useMemo(() => {
    if (!currentRequirement) return persons;

    const standardRequirement = toStandardRequirement(currentRequirement);
    if (!standardRequirement) return [];

    return persons.filter((person) =>
      hasPersonRequirement(person, standardRequirement)
    );
  }, [currentRequirement, persons]);

  const personsWithoutRequirement = useMemo(() => {
    if (!currentRequirement) return persons;

    const standardRequirement = toStandardRequirement(currentRequirement);
    if (!standardRequirement) return persons;

    return persons.filter(
      (person) => !hasPersonRequirement(person, standardRequirement)
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

  const standardRequirement = toStandardRequirement(currentRequirement);
  const shouldRenderPersonList = isRequirementPresentInPersonList(
    persons,
    standardRequirement,
    true
  );

  const shouldRenderMenu = isRequirementPresentInPersonList(
    persons,
    standardRequirement,
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

  const submitPersonsReview = useCallback(async () => {
    if (errors.length > 0) {
      return scrollToError();
    }

    patchOnboardingRequirementsData({ requirements: ['persons'] });

    try {
      await updateOrganizationRequirements();
    } catch (error) {
      console.error('Failed to update organization requirements:', error);
    }

    try {
      await api.onboardingRequirements.getOnboardingRequirements.invalidateQueries(queryClient);
    } catch (error) {
      console.error('Failed to invalidate main onboarding requirements:', error);
    }
    try {
      await api.frontend.getFrontendOnboardingRequirements.invalidateQueries(queryClient);
    } catch (error) {
      console.error('Failed to invalidate frontend onboarding requirements:', error);
    }
  }, [errors.length, patchOnboardingRequirementsData, scrollToError, updateOrganizationRequirements, api.onboardingRequirements.getOnboardingRequirements, api.frontend.getFrontendOnboardingRequirements, queryClient]);

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

type OnboardingPerson = components['schemas']['OnboardingPerson'];
type EntityResponse = components['schemas']['EntityResponse'];
type PersonResponse = components['schemas']['PersonResponse'];
