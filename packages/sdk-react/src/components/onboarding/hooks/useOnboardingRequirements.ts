import { useCallback, useEffect, useMemo, useState } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useOnboardingRequirementsData } from '@/core/queries/useOnboarding';
import { OnboardingRequirement } from '@/enums/OnboardingRequirement';

import { getEntityName } from '../helpers';
import { OnboardingPersonId } from '../types';

export type OnboardingRequirementsType = {
  /**
   isEditMode: a boolean that indicates whether
   the component is in edit mode or not.
   */
  isEditMode: boolean;

  /**
   * progress: a number that indicates the progress of the onboarding process,
   */
  progress: number;

  /**
   * requirement: the current onboarding requirement.
   */
  currentRequirement: OnboardingRequirement | undefined;

  /**
   * requirementList: an array of onboarding requirements.
   */
  requirementList: OnboardingRequirement[];

  /**
   * enableEditMode: a function that takes in a requirement object and enables edit mode with that requirement.
   * @param requirement
   */
  enableEditMode: (requirement: OnboardingRequirement) => void;

  /**
   * disableEditMode: a function that disables edit mode and sets
   *  the current requirement to the current requirement obtained
   *  from the getCurrentRequirement function and sets personId to null.
   */
  disableEditMode: () => void;

  /**
   * personId: a number that indicates the index of the person list
   * if the personId === null, then person mode is disabled.
   * if the personId === '', then the creation mode is for a person.
   * if the personId === id, then the editing mode is for a person.
   */
  personId: OnboardingPersonId;

  /**
   * enablePersonEditMode: a function that enables person mode and sets the person index.
   * @param index
   */
  enablePersonEditMode: (personId: string) => void;

  /**
   * representativePersonId: a number that indicates the index of the person list
   * if the representativePersonId === null, then the creation mode is for a person.
   * if the representativePersonId === id, then the editing mode is for a person.
   */
  representativePersonId: OnboardingPersonId;

  /**
   * entityName: a string that indicates the name of the entity.
   */
  entityName: string;

  /**
   * onboardingCompleted: a boolean that indicates whether the onboarding process is completed or not.
   */
  onboardingCompleted: boolean;
};

export const useOnboardingRequirements = (): OnboardingRequirementsType => {
  const { data: onboarding } = useOnboardingRequirementsData();
  const { api } = useMoniteContext();
  const { data: entity } = api.entityUsers.getEntityUsersMyEntity.useQuery();

  const entityName = useMemo(() => {
    return getEntityName(entity);
  }, [entity]);

  const [isEditMode, setEditMode] = useState<boolean>(false);

  const [personId, setPersonId] = useState<OnboardingPersonId>(null);

  const [representativePersonId, setRepresentativePersonId] =
    useState<OnboardingPersonId>(null);

  const onboardingRequirements = useMemo(
    () => onboarding?.requirements ?? [],
    [onboarding?.requirements]
  );

  const requirements = useMemo(() => {
    return OnboardingRequirement.filter((requirement) =>
      onboardingRequirements.includes(requirement)
    );
  }, [onboardingRequirements]);

  const [requirement, setRequirement] = useState<
    OnboardingRequirement | undefined
  >(undefined);

  const index = useMemo<number>(() => {
    if (!requirement) return 0;

    return requirements.findIndex((req) => req === requirement);
  }, [requirement, requirements]);

  const getCurrentRequirement = useCallback(
    () =>
      requirements.find((requirement) =>
        onboardingRequirements.includes(requirement)
      ),
    [requirements, onboardingRequirements]
  );

  useEffect(() => {
    if (onboarding?.data?.persons) {
      const representativePerson = onboarding.data.persons.find(
        (person) => person.relationship.representative
      );

      if (representativePerson) {
        setRepresentativePersonId(representativePerson.id);
      }
    }
  }, [onboarding?.data?.persons]);

  useEffect(() => window.scrollTo(0, 0), [requirement, isEditMode]);

  useEffect(() => {
    if (isEditMode) return;
    setRequirement(getCurrentRequirement);
  }, [getCurrentRequirement, isEditMode]);

  const enableEditMode = useCallback((requirement: OnboardingRequirement) => {
    setEditMode(true);
    setRequirement(requirement);
  }, []);

  const enablePersonEditMode = useCallback((personId: string) => {
    setEditMode(true);
    setPersonId(personId);
  }, []);

  const disableEditMode = useCallback(() => {
    setEditMode(false);
    setPersonId(null);
  }, []);

  const onboardingCompleted = useMemo(() => {
    return requirements.length === 0;
  }, [requirements.length]);

  return {
    progress: ((index + 1) / (requirements.length ?? 1)) * 100,
    currentRequirement: requirement,
    requirementList: requirements,
    isEditMode,
    enableEditMode,
    disableEditMode,
    personId,
    enablePersonEditMode,
    representativePersonId,
    entityName,
    onboardingCompleted,
  };
};

type OnboardingRequirement = components['schemas']['OnboardingRequirement'];
