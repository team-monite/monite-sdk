import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  PayableResponseSchema,
  TagCreateOrUpdateSchema,
  TagReadSchema,
  TagsPaginationResponse,
  TagsResponse,
  TagService,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';
import { PAYABLE_QUERY_ID } from './usePayable';
import { Updater } from '@tanstack/react-query-devtools/build/types/query-core/src/utils';

const TAG_QUERY_ID = 'tags';

export const useTagList = (...args: Parameters<TagService['getList']>) => {
  const { monite } = useComponentsContext();

  return useQuery<TagsPaginationResponse, Error>(
    [TAG_QUERY_ID, { variables: args }],
    () => monite.api!.tag.getList(...args),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCreateTag = (...args: Parameters<TagService['create']>) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<TagReadSchema, Error, TagCreateOrUpdateSchema>(
    () => monite.api!.tag.create(...args),
    {
      onSuccess: async (tag) => {
        await queryClient.setQueryData<Updater<TagsResponse, TagsResponse>>(
          [TAG_QUERY_ID],
          (tags: TagsResponse) => ({
            ...tags,
            tag,
          })
        );

        await queryClient.setQueryData<
          Updater<PayableResponseSchema, PayableResponseSchema>
        >(
          [PAYABLE_QUERY_ID, { id: args[0].name }],
          (payable: PayableResponseSchema) => ({
            ...payable,
            tags: payable.tags ? [...payable.tags, tag] : [tag],
          })
        );

        toast.success('Tag created');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
