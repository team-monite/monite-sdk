import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  PayableResponseSchema,
  TagCreateOrUpdateSchema,
  TagReadSchema,
  TagsResponse,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';
import { PAYABLE_QUERY_ID } from './usePayable';
import { Updater } from '@tanstack/react-query-devtools/build/types/query-core/src/utils';

const TAG_QUERY_ID = 'tags';

export const useTagList = () => {
  const { monite } = useComponentsContext();

  return useQuery<TagsResponse, Error>(
    [TAG_QUERY_ID],
    () => monite.api!.tag.getList(),
    {
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};

export const useCreateTag = (id: string) => {
  const queryClient = useQueryClient();
  const { monite } = useComponentsContext();

  return useMutation<TagReadSchema, Error, TagCreateOrUpdateSchema>(
    (body) => monite.api!.tag.create(body),
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
        >([PAYABLE_QUERY_ID, { id }], (payable: PayableResponseSchema) => ({
          ...payable,
          tags: payable.tags ? [...payable.tags, tag] : [tag],
        }));

        toast.success('Tag created');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );
};
