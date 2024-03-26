import { useCallback, useMemo } from 'react';

import { ErrorType } from '@/core/queries/types';
import { useUpdateMyEntity } from '@/core/queries/useEntities';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';
import {
  EntityResponse,
  OnboardingEntity,
  OnboardingRequirement,
} from '@monite/sdk-api';

import { companyRoleToRequirement } from '../helpers';
import { generateValuesByFields, prepareValuesToSubmit } from '../transformers';
import type {
  EntityOrganizationRelationshipCode,
  OrganizationRequirements,
} from '../types';

export type OnboardingEntityReturnType = {
  /**  isLoading a boolean flag indicating whether the form data is being loaded. */
  isLoading: boolean;

  error: ErrorType;

  entity: OnboardingEntity | undefined;

  updateEntity: (
    fields: OnboardingEntity,
    requirements?: OnboardingRequirement[]
  ) => Promise<EntityResponse>;

  updateEntityRequirements: (
    organizationRequirements: OrganizationRequirements
  ) => Promise<EntityResponse>;
};

export function useOnboardingEntity(): OnboardingEntityReturnType {
  const { data: onboarding } = useOnboardingRequirementsData();

  const patchOnboardingRequirements = usePatchOnboardingRequirementsData();

  const {
    mutateAsync: updateEntityMutation,
    isPending: isLoading,
    error,
  } = useUpdateMyEntity();

  const entity = useMemo(
    () => onboarding?.data?.entity,
    [onboarding?.data?.entity]
  );

  const updateEntity = useCallback(
    async (
      fields: OnboardingEntity,
      requirements: OnboardingRequirement[] = []
    ) => {
      const response = await updateEntityMutation(
        prepareValuesToSubmit(generateValuesByFields(fields))
      );

      patchOnboardingRequirements({
        requirements,
        data: {
          entity: fields,
        },
      });

      return response;
    },
    [patchOnboardingRequirements, updateEntityMutation]
  );

  const updateEntityRequirements = useCallback(
    (organizationRequirements: OrganizationRequirements) =>
      updateEntity(
        {
          ...entity,
          organization: {
            ...entity?.organization,
            ...organizationRequirements,
          },
        },
        Object.keys(organizationRequirements).map((role) =>
          companyRoleToRequirement(role as EntityOrganizationRelationshipCode)
        )
      ),
    [entity, updateEntity]
  );

  return {
    isLoading,
    error,
    updateEntity,
    updateEntityRequirements,
    entity,
  };
}
