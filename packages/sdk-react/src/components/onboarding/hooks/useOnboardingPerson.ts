import { useCallback, useMemo } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';

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

  updateOrganizationRequirements: () => Promise<
    components['schemas']['EntityResponse']
  >;

  relationships: OnboardingRelationshipReturnType;

  error:
    | Error
    | components['schemas']['ErrorSchemaResponse']
    | components['schemas']['HTTPValidationError']
    | null;
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

  const { api } = useMoniteContext();

  const {
    mutateAsync: createPersonMutation,
    isPending: isCreateLoading,
    error: createPersonError,
  } = api.persons.postPersons.useMutation(undefined, {
    onError: () => {},
  });

  const {
    mutateAsync: updatePersonMutation,
    isPending: isUpdateLoading,
    error: updatePersonError,
  } = api.persons.patchPersonsId.useMutation(undefined, {
    onError: () => {},
  });

  const {
    mutateAsync: deletePersonMutation,
    isPending: isDeleteLoading,
    error: deletePersonError,
  } = api.persons.deletePersonsId.useMutation(undefined);

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
      const response = await createPersonMutation({
        body: payload,
      });

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
        path: { person_id: personId },
        body: payload,
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
        path: { person_id: personId },
        body: payload,
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
    if (!personId) throw new Error('Person id is not defined');

    await deletePersonMutation({
      path: { person_id: personId },
    });

    patchOnboardingRequirements({
      data: {
        persons: persons.filter(({ id }) => id !== personId),
      },
    });

    disableEditMode();
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

type OptionalPersonRequest = components['schemas']['OptionalPersonRequest'];
type PersonRequest = components['schemas']['PersonRequest'];
type PersonResponse = components['schemas']['PersonResponse'];
