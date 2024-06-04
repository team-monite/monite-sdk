import { toast } from 'react-hot-toast';

import { api, useMoniteApiClient } from '@/api/client';
import {
  ApiError,
  TagCreateOrUpdateSchema,
  TagReadSchema,
} from '@monite/sdk-api';
import { useMutation } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useEntityListCache } from './hooks';

export const TAG_QUERY_ID = 'tags';

const useTagListCache = () =>
  useEntityListCache<TagReadSchema>(() => [TAG_QUERY_ID]);

export const useTagListQuery = (
  query?: (typeof api.tags.getTags.types.parameters)['query']
) => {
  const { api, apiVersion, entityId } = useMoniteApiClient();
  return api.tags.getTags.useQuery({
    header: {
      'x-monite-version': apiVersion,
      'x-monite-entity-id': entityId,
    },
    query,
  });
};

export const useCreateTag = () => {
  const { monite } = useMoniteContext();
  const { invalidate } = useTagListCache();

  return useMutation<TagReadSchema, ApiError, TagCreateOrUpdateSchema>({
    mutationFn: (args) => monite.api.tag.create(args),

    onSuccess: () => {
      invalidate();
    },

    onError: async (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

export const useUpdateTag = () => {
  const { monite } = useMoniteContext();
  const { invalidate } = useTagListCache();

  return useMutation<
    TagReadSchema,
    ApiError,
    { id: string; payload: { name: string } }
  >({
    mutationFn: ({ id, payload }) => monite.api.tag.update(id, payload),

    onSuccess: () => {
      invalidate();
    },

    onError: (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

export const useDeleteTag = () => {
  const { monite } = useMoniteContext();
  const { invalidate } = useTagListCache();

  return useMutation<void, ApiError, string>({
    mutationFn: (tagId) => monite.api.tag.delete(tagId),

    onSuccess: () => {
      invalidate();
    },
  });
};
