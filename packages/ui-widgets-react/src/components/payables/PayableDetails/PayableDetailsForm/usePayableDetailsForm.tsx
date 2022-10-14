import { useCallback } from 'react';

import {
  PayableResponseSchema,
  PayableUpdateSchema,
} from '@team-monite/sdk-api';
import { useUpdatePayableById } from 'core/queries/usePayable';
import { useCreateTag, useTagList } from 'core/queries/useTag';
import { useCounterpartList } from 'core/queries/useCounterpart';
import { useEntityById } from 'core/queries/useEntity';

import { MONITE_ENTITY_ID } from '../../../../constants';

import type { Option } from './helpers';

export type UsePayableDetailsFormProps = {
  payable: PayableResponseSchema;
  onSubmit?: () => void;
};

export default function usePayableDetailsForm({
  payable,
  onSubmit,
}: UsePayableDetailsFormProps) {
  const tagQuery = useTagList();
  const counterpartQuery = useCounterpartList(MONITE_ENTITY_ID);
  const entityUserQuery = useEntityById(payable.was_created_by_user_id);
  const payableSaveMutation = useUpdatePayableById(payable.id);
  const tagCreateMutation = useCreateTag(payable.id);

  const saveInvoice = useCallback(
    async (data: PayableUpdateSchema) => {
      await payableSaveMutation.mutateAsync(data);
      onSubmit && onSubmit();
    },
    [payableSaveMutation]
  );

  const createTag = useCallback(
    ({ label: name }: Option) => {
      tagCreateMutation.mutate({
        name,
      });
    },
    [tagCreateMutation]
  );

  return {
    tagQuery,
    counterpartQuery,
    entityUserQuery,
    saveInvoice,
    createTag,
    isFormLoading: payableSaveMutation.isLoading,
  };
}
