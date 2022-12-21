import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { Updater } from '@tanstack/react-query-devtools/build/types/query-core/src/utils';

import {
  PayableResponseSchema,
  PayableUpdateSchema,
  TagsResponse,
} from '@team-monite/sdk-api';
import { useComponentsContext } from 'core/context/ComponentsContext';
import {
  PAYABLE_QUERY_ID,
  useUpdatePayableById,
} from 'core/queries/usePayable';
import { useCreateTag, useTagList, TAG_QUERY_ID } from 'core/queries/useTag';
import { useCounterpartList } from 'core/queries/useCounterpart';
// import { useEntityById } from 'core/queries/useEntity';

import type { Option } from './helpers';

export type UsePayableDetailsFormProps = {
  payable: PayableResponseSchema;
  onSubmit?: () => void;
};

export default function usePayableDetailsForm({
  payable,
  onSubmit,
}: UsePayableDetailsFormProps) {
  const { monite } = useComponentsContext();
  const queryClient = useQueryClient();
  const tagQuery = useTagList();
  const counterpartQuery = useCounterpartList(monite.entityId);
  // const entityUserQuery = useEntityById(payable.was_created_by_user_id);
  const payableSaveMutation = useUpdatePayableById(payable.id);
  const tagCreateMutation = useCreateTag({ name: payable.id });

  const saveInvoice = useCallback(
    async (data: PayableUpdateSchema) => {
      await payableSaveMutation.mutateAsync(data);
      onSubmit && onSubmit();
    },
    [payableSaveMutation]
  );

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
    // entityUserQuery,
    saveInvoice,
    createTag,
    isFormLoading: payableSaveMutation.isLoading,
  };
}
