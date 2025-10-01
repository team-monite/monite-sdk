import { useCallback, useEffect, useMemo, useState } from 'react';

import { components } from '@/api';
import { useMyEntity } from '@/core/queries';
import { useOnboardingRequirementsAdapter } from '@/core/queries/useOnboardingRequirementsAdapter';
import { OnboardingRequirement } from '@/enums/OnboardingRequirement';
import { useTreasuryEligibility } from './useTreasuryEligibility';

import { getEntityName } from '../helpers';
import { OnboardingPersonId, OnboardingRequirementExtended } from '../types';

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
  currentRequirement: OnboardingRequirementExtended | undefined;

  /**
   * requirementList: an array of onboarding requirements.
   */
  requirementList: OnboardingRequirementExtended[];

  /**
   * enableEditMode: a function that takes in a requirement object and enables edit mode with that requirement.
   * @param requirement
   */
  enableEditMode: (requirement: OnboardingRequirementExtended) => void;

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
  const { data: onboarding } = useOnboardingRequirementsAdapter();
  const { data: entity } = useMyEntity();
  const { isEligible: isTreasuryEligible } = useTreasuryEligibility();

  const entityName = useMemo(() => {
    return getEntityName(entity);
  }, [entity]);

  const [isEditMode, setEditMode] = useState<boolean>(false);

  const [personId, setPersonId] = useState<OnboardingPersonId>(null);

  const [representativePersonId, setRepresentativePersonId] =
    useState<OnboardingPersonId>(null);

  const hasRepresentative = useMemo(
    () =>
      Boolean(
        Array.isArray(onboarding?.data?.persons) &&
        onboarding.data.persons.some(
          (person) => person?.relationship?.representative
        )
      ),
    [onboarding?.data?.persons]
  );

  // Frontend safeguard: if a representative person already exists, skip the
  // 'representative' requirement even if backend still lists it.
  // TODO: Remove this once the backend is updated (if it is a BE bug actually)
  const onboardingRequirements = useMemo(() => {
    const base = onboarding?.requirements ?? [];
    if (!hasRepresentative) return base;

    return base.filter((req) => req !== 'representative');
  }, [onboarding?.requirements, hasRepresentative]);

  const requirements = useMemo((): OnboardingRequirementExtended[] => {
    const base = onboarding?.requirements ?? [];
    if (!hasRepresentative) return base;
    const standardRequirements = OnboardingRequirement.filter((requirement) =>
      (onboardingRequirements as string[]).includes(requirement)
    ) as OnboardingRequirementExtended[];

    if ((onboardingRequirements as string[]).includes('treasury_tos_acceptance')) {
      standardRequirements.push('treasury_tos_acceptance');
    }

    const backendHasBankAccounts = (onboardingRequirements as string[]).includes('bank_accounts');

    if (
      isTreasuryEligible &&
      backendHasBankAccounts &&
      !standardRequirements.includes('bank_accounts')
    ) {
      standardRequirements.push('bank_accounts');
    }

    return standardRequirements;
  }, [onboardingRequirements, isTreasuryEligible, hasRepresentative, onboarding?.requirements]);

  const [requirement, setRequirement] = useState<
    OnboardingRequirementExtended | undefined
  >(undefined);

  const index = useMemo<number>(() => {
    if (!requirement) return 0;

    return requirements.findIndex((req) => req === requirement);
  }, [requirement, requirements]);

  const getCurrentRequirement = useCallback(
    () =>
      [...requirements]
        .sort((a, b) => {
          if (a === 'treasury_tos_acceptance') return -1;
          if (b === 'treasury_tos_acceptance') return 1;

          return 0;
        })
        .find((requirement) =>
          (onboardingRequirements as string[]).includes(requirement)
        ),
    [requirements, onboardingRequirements]
  );

  useEffect(() => {
    if (Array.isArray(onboarding?.data?.persons)) {
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

  const enableEditMode = useCallback((requirement: OnboardingRequirementExtended) => {
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

  const denominator = Math.max(requirements.length, 1);

  return {
    progress: requirements.length ? ((index + 1) / denominator) * 100 : 100,
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
