import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  MergedSettingsResponse,
  ApiError,
  EntityVatIDResourceList,
  OnboardingPaymentMethodsResponse,
} from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

import { ErrorType } from './types';

const ENTITIES_QUERY_ID = 'entities';

const entityQueryKeys = {
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
  const { api, queryClient } = useMoniteContext();

  return api.entityUsers.patchEntityUsersMyEntity.useMutation(undefined, {
    onSuccess: async (data) => {
      api.entityUsers.getEntityUsersMyEntity.setQueryData(
        {},
        data,
        queryClient
      );

      await api.entityUsers.getEntityUsersMyEntity.invalidateQueries(
        queryClient
      );
    },
  });
};
