'use client';

import { useCallback, useMemo } from 'react';

import type { ErrorType } from '@/core/queries/types';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import {
  useCreatePerson,
  useDeletePerson,
  useUpdatePerson,
} from '@/core/queries/usePerson';
import {
  EntityResponse,
  OptionalPersonRequest,
  PersonRequest,
  PersonResponse,
} from '@monite/sdk-api';

import { useOnboardingRequirementsContext } from '../context';
import { isRepresentative } from '../helpers';
import { enrichFieldsByValues } from '../transformers';
import { useOnboardingActions } from './useOnboardingActions';
import { useOnboardingEntity } from './useOnboardingEntity';
import type {
  PersonFormType,
  OnboardingRelationshipReturnType,
} from './useOnboardingPersonRelationships';
import { useOnboardingPersonRelationships } from './useOnboardingPersonRelationships';

export type OnboardingPersonReturnType = {
  /**  isPending a boolean flag indicating whether the form data is being loaded. */
  isPending: boolean;

  primaryAction: (payload: PersonFormType) => Promise<PersonResponse>;

  secondaryAction: (() => void) | undefined;

  updatePerson: (
    personId: string,
    payload: OptionalPersonRequest
  ) => Promise<PersonResponse>;

  deletePerson: () => Promise<void> | undefined;

  updateOrganizationRequirements: () => Promise<EntityResponse>;

  relationships: OnboardingRelationshipReturnType;

  error: ErrorType;
};

export function useOnboardingPerson(): OnboardingPersonReturnType {
  const {
    personId,
    currentRequirement,
    representativePersonId,
    disableEditMode,
  } = useOnboardingRequirementsContext();

  const { data: onboarding } = useOnboardingRequirementsData();

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const { secondaryAction } = useOnboardingActions();

  const relationships = useOnboardingPersonRelationships();

  const { fields, getOrganizationRequirements } = relationships;

  const {
    updateEntityRequirements,
    isPending: isEntityLoading,
    error: updateEntityError,
  } = useOnboardingEntity();

  const {
    mutateAsync: createPersonMutation,
    isPending: isCreateLoading,
    error: createPersonError,
  } = useCreatePerson();

  const {
    mutateAsync: updatePersonMutation,
    isPending: isUpdateLoading,
    error: updatePersonError,
  } = useUpdatePerson();

  const {
    mutateAsync: deletePersonMutation,
    isPending: isDeleteLoading,
    error: deletePersonError,
  } = useDeletePerson();

  const persons = useMemo(
    () => onboarding?.data?.persons || [],
    [onboarding?.data?.persons]
  );

  const updateOrganizationRequirements = useCallback(
    () => updateEntityRequirements(getOrganizationRequirements()),
    [getOrganizationRequirements, updateEntityRequirements]
  );

  const createPerson = useCallback(
    async (payload: PersonRequest) => {
      const response = await createPersonMutation(payload);

      const requirement = isRepresentative(currentRequirement)
        ? currentRequirement
        : undefined;

      patchOnboardingRequirements({
        requirements: requirement ? [requirement] : [],
        data: {
          persons: [
            ...persons,
            {
              ...enrichFieldsByValues(fields, response),
              id: response.id,
            },
          ],
        },
      });

      if (isRepresentative(currentRequirement)) {
        await updateOrganizationRequirements();
      }

      disableEditMode();

      return response;
    },
    [
      currentRequirement,
      createPersonMutation,
      disableEditMode,
      fields,
      patchOnboardingRequirements,
      persons,
      updateOrganizationRequirements,
    ]
  );

  const updatePerson = useCallback(
    async (personId: string, payload: OptionalPersonRequest) => {
      const response = await updatePersonMutation({
        id: personId,
        payload,
      });

      patchOnboardingRequirements({
        data: {
          persons: persons.map((person) =>
            person.id === personId
              ? enrichFieldsByValues(person, response)
              : person
          ),
        },
      });

      disableEditMode();

      return response;
    },
    [
      patchOnboardingRequirements,
      persons,
      updatePersonMutation,
      disableEditMode,
    ]
  );

  const updateRepresentativePerson = useCallback(
    async (personId: string, payload: OptionalPersonRequest) => {
      const response = await updatePersonMutation({
        id: personId,
        payload,
      });

      patchOnboardingRequirements({
        requirements: currentRequirement ? [currentRequirement] : undefined,
        data: {
          persons: persons.map((person) =>
            person.id === personId
              ? enrichFieldsByValues(person, response)
              : person
          ),
        },
      });

      return response;
    },
    [
      updatePersonMutation,
      patchOnboardingRequirements,
      currentRequirement,
      persons,
    ]
  );

  const deletePerson = useCallback(async () => {
    const response = await deletePersonMutation(personId!);

    patchOnboardingRequirements({
      data: {
        persons: persons.filter(({ id }) => id !== personId),
      },
    });

    disableEditMode();

    return response;
  }, [
    deletePersonMutation,
    patchOnboardingRequirements,
    personId,
    persons,
    disableEditMode,
  ]);

  const primaryAction = useCallback(
    (payload: PersonFormType) => {
      if (isRepresentative(currentRequirement) && representativePersonId) {
        return updateRepresentativePerson(
          representativePersonId,
          payload as OptionalPersonRequest
        );
      }

      if (personId) {
        return updatePerson(personId, payload as OptionalPersonRequest);
      }

      return createPerson(payload as PersonRequest);
    },
    [
      currentRequirement,
      representativePersonId,
      personId,
      createPerson,
      updateRepresentativePerson,
      updatePerson,
    ]
  );

  const isPending =
    isCreateLoading || isUpdateLoading || isDeleteLoading || isEntityLoading;

  const error =
    createPersonError ||
    updatePersonError ||
    deletePersonError ||
    updateEntityError;

  return {
    primaryAction,
    secondaryAction,
    updatePerson,
    deletePerson,
    updateOrganizationRequirements,
    relationships,
    isPending,
    error,
  };
}
