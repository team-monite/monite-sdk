import { toast } from 'react-hot-toast';

import {
  TagCreateOrUpdateSchema,
  TagReadSchema,
  TagsPaginationResponse,
  TagService,
  ApiError,
} from '@monite/sdk-api';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useMoniteContext } from '../context/MoniteContext';
import { useEntityListCache } from './hooks';

export const TAG_QUERY_ID = 'tags';

const useTagListCache = () =>
  useEntityListCache<TagReadSchema>(() => [TAG_QUERY_ID]);

export const useTagList = (...args: Parameters<TagService['getList']>) => {
  const { monite } = useMoniteContext();

  return useQuery<TagsPaginationResponse, ApiError>({
    queryKey: [TAG_QUERY_ID, { variables: args }],

    queryFn: () => monite.api.tag.getList(...args),
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
