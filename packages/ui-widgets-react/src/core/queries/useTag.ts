import { useMutation, useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import {
  TagCreateOrUpdateSchema,
  TagReadSchema,
  TagsPaginationResponse,
  TagService,
  ApiError,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { useEntityListCache } from './hooks';

export const TAG_QUERY_ID = 'tags';

const useTagListCache = () =>
  useEntityListCache<TagReadSchema>(() => [TAG_QUERY_ID]);

export const useTagList = (...args: Parameters<TagService['getList']>) => {
  const { monite } = useComponentsContext();

  return useQuery<TagsPaginationResponse, ApiError>(
    [TAG_QUERY_ID, { variables: args }],
    () => monite.api.tag.getList(...args),
    {
      onError: (error) => {
        toast.error(error.body.error.message || error.message);
      },
    }
  );
};

export const useCreateTag = () => {
  const { monite } = useComponentsContext();
  const { invalidate } = useTagListCache();

  return useMutation<TagReadSchema, ApiError, TagCreateOrUpdateSchema>(
    (args) => monite.api.tag.create(args),
    {
      onSuccess: () => {
        invalidate();
      },
      onError: async (error) => {
        toast.error(error.body.error.message || error.message);
      },
    }
  );
};

export const useUpdateTag = () => {
  const { monite } = useComponentsContext();
  const { invalidate } = useTagListCache();

  return useMutation<
    TagReadSchema,
    ApiError,
    { id: string; payload: { name: string } }
  >(({ id, payload }) => monite.api.tag.update(id, payload), {
    onSuccess: () => {
      invalidate();
    },
    onError: (error) => {
      toast.error(error.body.error.message || error.message);
    },
  });
};

export const useDeleteTag = () => {
  const { monite } = useComponentsContext();
  const { invalidate } = useTagListCache();

  return useMutation<void, ApiError, string>(
    (tagId) => monite.api.tag.delete(tagId),
    {
      onSuccess: () => {
        invalidate();
      },
      onError: (error) => {
        toast.error(error.body.error.message || error.message);
      },
    }
  );
};
