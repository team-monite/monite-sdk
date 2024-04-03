import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useOnboardingPersonMask,
  useOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import {
  AllowedCountries,
  OnboardingPerson,
  OnboardingPersonMask,
  OnboardingPersonRelationshipMask,
  OnboardingRequirement,
  OptionalPersonRequest,
  PersonRequest,
  PersonResponse,
} from '@monite/sdk-api';

import deepEqual from 'deep-eql';

import { useOnboardingRequirementsContext } from '../context';
import {
  isEditingPerson,
  isMask,
  isRepresentative,
  requirementToCompanyRole,
  requirementToRelationship,
} from '../helpers';
import { generateFieldsByMask } from '../transformers';
import type { OrganizationRequirements } from '../types';
import { OnboardingFormType, useOnboardingForm } from './useOnboardingForm';

type PersonRole = {
  requirement: OnboardingRequirement;
  checked: boolean;
};

export type PersonFormType = OptionalPersonRequest | PersonRequest;

export type OnboardingRelationshipReturnType = {
  /** An array of all relationships with their corresponding onboarding requirements. */
  roles: PersonRole[];

  fields: OnboardingPerson;

  getOrganizationRequirements: () => OrganizationRequirements;

  onboardingForm: OnboardingFormType<PersonFormType, PersonResponse>;

  isPersonMaskLoading: boolean;

  ownerState: [boolean, Dispatch<SetStateAction<boolean>>];

  directorState: [boolean, Dispatch<SetStateAction<boolean>>];

  isRoleProvided: (role: OnboardingRequirement) => boolean;
};

const { REPRESENTATIVE, OWNERS, EXECUTIVES, DIRECTORS } = OnboardingRequirement;

const getDefaultMask = (roles: PersonRole[] = []): OnboardingPersonMask => {
  const isRoleProvided = (role: OnboardingRequirement) =>
    roles.some(({ requirement }) => requirement === role);

  const onlyDirectorProvided = isRoleProvided(DIRECTORS) && roles.length === 1;
  const shouldRenderAddress =
    !roles.length || (!!roles.length && !onlyDirectorProvided);

  const address = {
    country: true,
  };

  const relationship: OnboardingPersonRelationshipMask = {
    owner: true,
    director: true,
    executive: true,
    representative: true,
  };

  return {
    first_name: true,
    last_name: true,
    email: true,
    relationship,
    ...(shouldRenderAddress && { address }),
  };
};

export function useOnboardingPersonRelationships(): OnboardingRelationshipReturnType {
  const { currentRequirement, personId } = useOnboardingRequirementsContext();

  const { data: onboarding } = useOnboardingRequirementsData();

  const persons = useMemo(
    () => onboarding?.data?.persons || [],
    [onboarding?.data?.persons]
  );

  const currentPerson = useMemo(
    () => persons.find(({ id }) => id === personId),
    [personId, persons]
  );

  const [mask, setMask] = useState<OnboardingPersonMask | null>(null);

  const ownerState = useState<boolean>(true);

  const directorState = useState<boolean>(true);

  const [isOwnerProvided] = ownerState;
  const [isDirectorProvided] = directorState;

  const [fields, setFields] = useState<OnboardingPerson>(
    useMemo(() => {
      if (currentPerson) {
        return currentPerson;
      }

      const representative = persons.find(
        ({ relationship }) => relationship.representative
      );

      if (isRepresentative(currentRequirement) && representative) {
        return representative;
      }

      return generateFieldsByMask<OnboardingPerson>(getDefaultMask());
    }, [currentPerson, currentRequirement, persons])
  );

  const onboardingForm = useOnboardingForm<PersonFormType, PersonResponse>(
    fields,
    'person'
  );

  const { watch, setValue } = onboardingForm.methods;

  const representative = watch('relationship.representative');
  const owner = watch('relationship.owner');
  const director = watch('relationship.director');
  const executive = watch('relationship.executive');
  const country = watch('address.country') as AllowedCountries | undefined;

  const roles = useMemo<PersonRole[]>(
    () =>
      Object.entries({
        [REPRESENTATIVE]: representative,
        [OWNERS]: owner,
        [DIRECTORS]: director,
        [EXECUTIVES]: executive,
      }).reduce<PersonRole[]>((acc, [key, checked]) => {
        if (typeof checked !== 'boolean') return acc;

        const requirement = key as OnboardingRequirement;

        return [
          ...acc,
          {
            checked,
            requirement,
          },
        ];
      }, []),
    [director, executive, owner, representative]
  );

  const selectedRoles = useMemo(
    () => roles.filter(({ checked }) => checked),
    [roles]
  );

  const { data: personMask, isLoading: isPersonMaskLoading } =
    useOnboardingPersonMask(
      selectedRoles.map((item) => requirementToRelationship(item.requirement)),
      country
    );

  // set default roles
  useEffect(() => {
    if (isEditingPerson(personId)) return;

    if (isMask(currentRequirement)) {
      setValue(
        `relationship.${requirementToRelationship(currentRequirement)}`,
        true
      );
    }

    if (isRepresentative(currentRequirement)) {
      setValue('relationship.executive', true);
    }
  }, [currentRequirement, setValue, personId]);

  // set mask
  useEffect(() => {
    if (!personMask) return;
    setMask(personMask);
  }, [personMask]);

  // set fields
  useEffect(() => {
    if (!mask || !selectedRoles.length) return;

    const nextFields = generateFieldsByMask<OnboardingPerson>(
      mask ?? getDefaultMask(selectedRoles)
    );

    if (deepEqual(fields, nextFields)) return;

    setFields(nextFields);
  }, [fields, mask, selectedRoles]);

  const isRoleProvided = useCallback(
    (role: OnboardingRequirement) =>
      selectedRoles.some(({ requirement }) => requirement === role),
    [selectedRoles]
  );

  const getOrganizationRequirements = useCallback(() => {
    const payload: OrganizationRequirements = {
      [requirementToCompanyRole(currentRequirement!)]: true,
    };

    if (isRepresentative(currentRequirement!)) {
      if (isRoleProvided(OnboardingRequirement.OWNERS) && isOwnerProvided)
        payload.owners_provided = true;

      if (isRoleProvided(OnboardingRequirement.DIRECTORS) && isDirectorProvided)
        payload.directors_provided = true;
    }

    return payload;
  }, [currentRequirement, isDirectorProvided, isOwnerProvided, isRoleProvided]);

  return {
    roles,
    onboardingForm,
    fields,
    isPersonMaskLoading,
    ownerState,
    directorState,
    getOrganizationRequirements,
    isRoleProvided,
  };
}
