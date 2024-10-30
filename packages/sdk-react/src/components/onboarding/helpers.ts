import { components } from '@monite/sdk-api/src/api';

import type {
  EntityOrganizationRelationshipCode,
  OnboardingPersonIndex,
  OnboardingRequirementMask,
} from './types';

/**
 * Determines if the given requirement is for a representative.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for a representative.
 */
export function isRepresentative(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'representative';
}

/**
 * Determines if the given requirement is for directors.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for directors.
 */
export function isDirectors(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'directors';
}

/**
 * Determines if the given requirement is for owners.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for owners.
 */
export function isOwners(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'owners';
}

/**
 * Determines if the given requirement is for executives.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for executives.
 */
export function isExecutives(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'executives';
}

/**
 * Determines if the given requirement is for an individual.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is entity.
 */
export function isEntity(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'entity';
}

/**
 * Determines if the given requirement is for a bank account.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for a bank account.
 */
export function isBankAccount(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'bank_accounts';
}

/**
 * Determines if the given requirement is for a person.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for a person.
 */
export function isPersons(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'persons';
}

/**
 * Determines if the given requirement is for a business profile.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for a business profile.
 */
export function isBusinessProfile(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'business_profile';
}

/**
 * Determines if the given requirement is for a TOS acceptance.
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for a TOS acceptance.
 */
export function isTosAcceptance(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'tos_acceptance';
}

/**
 * Determines if the given requirement is for an ownership declaration.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for an ownership declaration.
 */
export function isOwnershipDeclaration(
  requirement: OnboardingRequirement | undefined
): boolean {
  return requirement === 'ownership_declaration';
}

/**
 * Determines if the given requirement is for entity documents.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for entity documents.
 */
export const isEntityDocuments = (
  requirement: OnboardingRequirement | undefined
): boolean => {
  return requirement === 'entity_documents';
};

/**
 * Maps the given onboarding requirement to a company property key.
 *
 * @param requirement - The onboarding requirement to be mapped.
 * @returns A keyof OnboardingEntity or an empty
 *  string if no match is found.
 */
export function requirementToCompanyRole(
  requirement: OnboardingRequirement
): EntityOrganizationRelationshipCode {
  if (isRepresentative(requirement)) return 'representative_provided';
  if (isDirectors(requirement)) return 'directors_provided';
  if (isOwners(requirement)) return 'owners_provided';
  return 'executives_provided';
}

/**
 * Maps the given company property key to an onboarding requirement.
 *
 * @param companyRequirement - The company property key to be mapped.
 * @returns An OnboardingRequirement based on the provided company property key.
 */
export function companyRoleToRequirement(
  companyRequirement: EntityOrganizationRelationshipCode
): OnboardingRequirement {
  switch (companyRequirement) {
    case 'representative_provided':
      return 'representative';
    case 'directors_provided':
      return 'directors';
    case 'owners_provided':
      return 'owners';
    default:
      return 'executives';
  }
}

/**
 * Maps the given onboarding requirement to a relationship code.
 *
 * @param requirement - The onboarding requirement to be mapped.
 * @returns An OnboardingRelationshipCode based on the provided requirement.
 */
export function requirementToRelationship(
  requirement: OnboardingRequirement
): Relationship {
  if (isRepresentative(requirement)) return 'representative';
  if (isDirectors(requirement)) return 'director';
  if (isOwners(requirement)) return 'owner';
  return 'executive';
}

/**
 * Checks if the requirement is for a person list (executives, owners, directors).
 *
 * @param {OnboardingRequirement} requirement - The onboarding requirement to check.
 *
 * @returns {boolean} - Returns true if the requirement is for executives, owners or directors. Otherwise, returns false.
 */
export function isPersonList(requirement?: OnboardingRequirement): boolean {
  if (!requirement) return false;
  if (isExecutives(requirement)) return true;
  if (isOwners(requirement)) return true;
  return isDirectors(requirement);
}

/**
 * Determines if the given requirement is for a persons document.
 *
 * @param requirement - The onboarding requirement to be checked.
 * @returns A boolean value indicating if the requirement is for a persons documents.
 */
export function isPersonsDocuments(
  requirement?: OnboardingRequirement
): boolean {
  return requirement === 'persons_documents';
}
/**
 * Checks if the requirement is a mask requirement.
 *
 * @param {OnboardingRequirement} requirement - The onboarding requirement to check.
 *
 * @returns {boolean} - Returns true if the requirement is representative or a person list requirement. Otherwise, returns false.
 */
export function isMask(
  requirement?: OnboardingRequirement
): requirement is OnboardingRequirementMask {
  if (isRepresentative(requirement)) return true;
  return isPersonList(requirement);
}

export const PERSON_CREATION = '';

/**
 * Checks if person mode is enabled, i.e., the personId is not null or undefined.
 *
 * @param {OnboardingPersonIndex} personId - The personId of the person.
 *
 * @returns {boolean} - Returns true if person mode is enabled, false otherwise.
 */
export const isPersonEditingEnabled = (
  personId?: OnboardingPersonIndex
): personId is string => {
  return personId !== null && personId !== undefined;
};

/**
 * Checks if person is being created.
 *
 * @param {OnboardingPersonIndex} personId - The id of the person.
 *
 * @returns {boolean} - Returns true if person mode is enabled and the index equals PERSON_CREATION, false otherwise.
 */
export const isCreatingPerson = (
  personId?: OnboardingPersonIndex
): personId is string => {
  return isPersonEditingEnabled(personId) && personId === PERSON_CREATION;
};

/**
 * Checks if person is being edited.
 *
 * @param {OnboardingPersonIndex} personId - The id of the person.
 *
 * @returns {boolean} - Returns true if person mode is enabled and the index is greater than PERSON_CREATION, false otherwise.
 */
export const isEditingPerson = (
  personId?: OnboardingPersonIndex
): personId is string => {
  return isPersonEditingEnabled(personId) && personId !== PERSON_CREATION;
};

/**
 * Checks if person has a specific requirement.
 *
 * @param {OnboardingPerson} person - The person to check the requirement for.
 * @param {OnboardingRequirement} requirement - The requirement to check.
 *
 * @returns {boolean} - Returns true if the person's relationship includes the requirement, false otherwise.
 */
export const hasPersonRequirement = (
  person: OnboardingPerson,
  requirement: OnboardingRequirement
): boolean => {
  if (!person?.relationship || !requirement) return false;
  return !!person.relationship[requirementToRelationship(requirement)];
};

/**
 * Checks if any person in the list has a specific requirement.
 *
 * @param {OnboardingPerson[]} persons - The list of persons to check the requirement for.
 * @param {OnboardingRequirement} requirement - The requirement to check.
 * @param {boolean} condition - The condition to filter the persons by.
 *
 * @returns {boolean} - Returns true if any person's relationship includes the requirement that matches the condition, false otherwise.
 */
export const isRequirementPresentInPersonList = (
  persons: OnboardingPerson[] = [],
  requirement?: OnboardingRequirement,
  condition?: boolean
): boolean =>
  persons.filter((person) => {
    if (!person?.relationship || !requirement) return false;
    return hasPersonRequirement(person, requirement) === condition;
  }).length > 0;

/**
 * Check if the entity is an individual.
 *
 * @param {EntityResponse} entity - The entity to check.
 * @returns {boolean} - Returns true if the entity is an individual, false otherwise.
 */
export const isIndividual = (entity: EntityResponse) => {
  return entity?.type === 'individual';
};

/**
 * Check if the entity is an organization.
 *
 * @param {EntityResponse} entity - The entity to check.
 * @returns {boolean} - Returns true if the entity is an organization, false otherwise.
 */
export const isOrganization = (entity: EntityResponse) => {
  return entity?.type === 'organization';
};

/**
 * Gets the name of the entity.
 *
 * @param {EntityResponse} entity - The entity to get the name for.
 * @returns {string} - Returns the name of the entity.
 */
export const getEntityName = (entity?: EntityResponse) => {
  if (!entity) return '';

  return isIndividual(entity)
    ? `${(entity as EntityIndividualResponse).individual.first_name} ${
        (entity as EntityIndividualResponse).individual.last_name
      }`
    : (entity as EntityOrganizationResponse).organization?.legal_name;
};

type EntityIndividualResponse =
  components['schemas']['EntityIndividualResponse'];
type EntityOrganizationResponse =
  components['schemas']['EntityOrganizationResponse'];
type EntityResponse = components['schemas']['EntityResponse'];
type OnboardingPerson = components['schemas']['OnboardingPerson'];
type OnboardingRequirement = components['schemas']['OnboardingRequirement'];
type Relationship = components['schemas']['Relationship'];
