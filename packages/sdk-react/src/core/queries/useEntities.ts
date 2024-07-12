import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  EntityResponse,
  MergedSettingsResponse,
  UpdateEntityRequest,
  ApiError,
  EntityVatIDResourceList,
  OnboardingPaymentMethodsResponse,
} from '@monite/sdk-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ErrorType } from './types';

const ENTITIES_QUERY_ID = 'entities';

const entityQueryKeys = {
  myEntity: () => [ENTITIES_QUERY_ID, 'me'],
  settings: (entityId: string) => [ENTITIES_QUERY_ID, entityId, 'settings'],
  taxIds: (entityId: string) => [ENTITIES_QUERY_ID, entityId, 'taxIds'],
  paymentMethods: (entityId: string) => [
    ENTITIES_QUERY_ID,
    entityId,
    'paymentMethods',
  ],
};

/** Retrieve all settings for this entity */
export const useEntitySettings = () => {
  const { monite } = useMoniteContext();

  return useQuery<MergedSettingsResponse, ErrorType>({
    queryKey: [...entityQueryKeys.settings(monite.entityId)],

    queryFn: () => monite.api.entity.getSettingsById(monite.entityId),
  });
};

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();

  return useMutation<EntityResponse, ErrorType, UpdateEntityRequest>({
    mutationFn: (payload) => monite.api.entity.update(monite.entityId, payload),

    onSuccess: (data) => {
      queryClient.setQueryData([...entityQueryKeys.myEntity()], data);
    },
  });
};

export const useEntityPaymentMethods = () => {
  const { monite } = useMoniteContext();

  return useQuery<OnboardingPaymentMethodsResponse, ApiError>({
    queryKey: [...entityQueryKeys.paymentMethods(monite.entityId)],

    queryFn: () => monite.api.entity.getPaymentMethods(monite.entityId),
  });
};

/** Get an entity's VAT IDs */
export const useEntityVatIdList = () => {
  const { monite } = useMoniteContext();

  return useQuery<EntityVatIDResourceList, ApiError>({
    queryKey: [...entityQueryKeys.taxIds(monite.entityId)],

    queryFn: () => monite.api.entity.getTaxIds(monite.entityId),
  });
};

/** Retrieves information of an entity, which this entity user belongs to */
export const useMyEntity = () => {
  const { api } = useMoniteContext();

  return api.entityUsers.getEntityUsersMyEntity.useQuery({});
};

export const useUpdateMyEntity = () => {
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();

  return useMutation<EntityResponse, ApiError, UpdateEntityRequest>({
    mutationFn: (payload) => monite.api.entityUser.updateMyEntity(payload),

    onSuccess: (data) => {
      queryClient.setQueryData([...entityQueryKeys.myEntity()], data);
    },
  });
};
