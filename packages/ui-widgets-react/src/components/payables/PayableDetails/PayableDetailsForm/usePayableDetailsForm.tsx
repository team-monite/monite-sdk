import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { Updater } from '@tanstack/react-query-devtools/build/types/query-core/src/utils';

import { PayableResponseSchema, TagsResponse } from '@team-monite/sdk-api';
import { PAYABLE_QUERY_ID } from 'core/queries/usePayable';
import { useCreateTag, useTagList, TAG_QUERY_ID } from 'core/queries/useTag';
import { useCounterpartList } from 'core/queries/useCounterpart';
import { useCounterpartsAddresses } from 'core/queries/useCounterpartsAddresses';
// import { useEntityById } from 'core/queries/useEntity';

import type { Option } from './helpers';

export type UsePayableDetailsFormProps = {
  payable: PayableResponseSchema;
  currentCounterpartId: string;
};

export default function usePayableDetailsForm({
  payable,
  currentCounterpartId,
}: UsePayableDetailsFormProps) {
  const queryClient = useQueryClient();
  const tagQuery = useTagList();
  const counterpartQuery = useCounterpartList();
  const counterpartAddressQuery =
    useCounterpartsAddresses(currentCounterpartId);
  // const entityUserQuery = useEntityById(payable.was_created_by_user_id);
  const tagCreateMutation = useCreateTag();

  const createTag = useCallback(
    ({ label: name }: Option) => {
      tagCreateMutation.mutate(
        {
          name,
        },
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
              [PAYABLE_QUERY_ID, { id: name }],
              (payable: PayableResponseSchema) => ({
                ...payable,
                tags: payable.tags ? [...payable.tags, tag] : [tag],
              })
            );

            toast.success('Tag created');
          },
        }
      );
    },
    [tagCreateMutation]
  );

  return {
    tagQuery,
    counterpartQuery,
    counterpartAddressQuery,
    // entityUserQuery,
    createTag,
  };
}
