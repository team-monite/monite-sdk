import { useMoniteContext } from '@/core/context/MoniteContext';
import {
  EntityResponse,
  MergedSettingsResponse,
  UpdateEntityRequest,
  ApiError,
  EntityVatIDResourceList,
} from '@monite/sdk-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ErrorType } from './types';

const ENTITIES_QUERY_ID = 'entities';

const entityQueryKeys = {
  myEntity: () => [ENTITIES_QUERY_ID, 'me'],
  settings: (entityId: string) => [ENTITIES_QUERY_ID, entityId, 'settings'],
  taxIds: (entityId: string) => [ENTITIES_QUERY_ID, entityId, 'taxIds'],
};

/** Retrieve all settings for this entity */
export const useEntitySettings = () => {
  const { monite } = useMoniteContext();

  return useQuery<MergedSettingsResponse, ErrorType>(
    [...entityQueryKeys.settings(monite.entityId)],
    () => monite.api.entity.getSettingsById(monite.entityId)
  );
};

export const useUpdateEntity = () => {
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();

  return useMutation<EntityResponse, ErrorType, UpdateEntityRequest>(
    (payload) => monite.api.entity.update(monite.entityId, payload),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([...entityQueryKeys.myEntity()], data);
      },
    }
  );
};

/** Get an entity's VAT IDs */
export const useEntityVatIdList = () => {
  const { monite } = useMoniteContext();

  return useQuery<EntityVatIDResourceList, ApiError>(
    [...entityQueryKeys.taxIds(monite.entityId)],
    () => monite.api.entity.getTaxIds(monite.entityId)
  );
};

/** Retrieves information of an entity, which this entity user belongs to */
export const useMyEntity = () => {
  const { monite } = useMoniteContext();

  return useQuery<EntityResponse, ApiError>(
    [...entityQueryKeys.myEntity()],
    () => monite.api.entityUser.getMyEntity()
  );
};

export const useUpdateMyEntity = () => {
  const queryClient = useQueryClient();
  const { monite } = useMoniteContext();

  return useMutation<EntityResponse, ApiError, UpdateEntityRequest>(
    (payload) => monite.api.entityUser.updateMyEntity(payload),
    {
      onSuccess: (data) => {
        queryClient.setQueryData([...entityQueryKeys.myEntity()], data);
      },
    }
  );
};
