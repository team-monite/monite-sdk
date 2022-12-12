import { useCallback } from 'react';

import {
  PayableResponseSchema,
  PayableUpdateSchema,
} from '@team-monite/sdk-api';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { useUpdatePayableById } from 'core/queries/usePayable';
import { useCreateTag, useTagList } from 'core/queries/useTag';
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
      tagCreateMutation.mutate({
        name,
      });
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
