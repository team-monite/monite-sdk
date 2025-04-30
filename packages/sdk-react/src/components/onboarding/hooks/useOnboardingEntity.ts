import { useCallback, useMemo } from 'react';

import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  useOnboardingRequirementsData,
  usePatchOnboardingRequirementsData,
} from '@/core/queries/useOnboarding';

import { companyRoleToRequirement } from '../helpers';
import { generateValuesByFields, prepareValuesToSubmit } from '../transformers';
import type {
  EntityOrganizationRelationshipCode,
  OrganizationRequirements,
} from '../types';
import { showErrorToast } from '../utils';

export type OnboardingEntityReturnType = {
  /**  isLoading a boolean flag indicating whether the form data is being loaded. */
  isPending: boolean;

  error:
    | Error
    | components['schemas']['ErrorSchemaResponse']
    | components['schemas']['HTTPValidationError']
    | null;

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

  const { api, queryClient } = useMoniteContext();
  const {
    mutateAsync: updateEntityMutation,
    isPending,
    error,
  } = api.entityUsers.patchEntityUsersMyEntity.useMutation(undefined, {
    onSuccess: (updatedEntity) => {
      api.entityUsers.getEntityUsersMyEntity.setQueryData(
        {},
        (prevEntity) => ({
          ...prevEntity,
          ...updatedEntity,
        }),
        queryClient
      );
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  const entity = useMemo(
    () => onboarding?.data?.entity,
    [onboarding?.data?.entity]
  );

  const updateEntity = useCallback(
    async (
      fields: OnboardingEntity,
      requirements: OnboardingRequirement[] = []
    ) => {
      const payload = prepareValuesToSubmit(generateValuesByFields(fields));

      if (payload.type === 'individual') {
        const individualPayload =
          payload.individual as OptionalIndividualSchema;
        if (
          fields.address?.country?.value === 'US' &&
          individualPayload?.id_number
        ) {
          const newSsnLast4 = individualPayload.id_number.slice(-4);
          const existingEntityData = onboarding?.data?.entity;
          const existingSsnLast4Value =
            existingEntityData?.individual?.ssn_last_4?.value;

          if (newSsnLast4 !== existingSsnLast4Value) {
            individualPayload.ssn_last_4 = newSsnLast4;
          }
        }
      }

      const response = await updateEntityMutation({
        body: payload,
      });

      patchOnboardingRequirements({
        requirements,
        data: {
          entity: fields,
        },
      });

      return response;
    },
    [
      patchOnboardingRequirements,
      updateEntityMutation,
      onboarding?.data?.entity,
    ]
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
    isPending,
    error,
    updateEntity,
    updateEntityRequirements,
    entity,
  };
}

type EntityResponse = components['schemas']['EntityResponse'];
type OnboardingEntity = components['schemas']['OnboardingEntity'];
type OnboardingRequirement = components['schemas']['OnboardingRequirement'];
type OptionalIndividualSchema =
  components['schemas']['OptionalIndividualSchema'];
