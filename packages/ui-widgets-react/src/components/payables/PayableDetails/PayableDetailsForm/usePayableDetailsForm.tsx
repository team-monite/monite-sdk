import { PayableResponseSchema } from '@monite/js-sdk';

import { useTagList, useUpdatePayableById } from 'core/queries';
import { useCounterpartList } from 'core/queries/useCounterpart';

export type UsePayableDetailsFormProps = {
  payable: PayableResponseSchema;
  debug?: boolean;
};

export default function usePayableDetailsForm({
  payable,
  debug,
}: UsePayableDetailsFormProps) {
  const {
    data: tags,
    // error: tagError,
    isLoading: isTagLoading,
  } = useTagList(debug);

  const {
    data: counterparts,
    // error: counterpartError,
    isLoading: isCounterpartLoading,
  } = useCounterpartList(debug);

  const submitMutation = useUpdatePayableById(payable.id);

  return {
    isTagLoading,
    isCounterpartLoading,
    submitMutation,
    tags: tags?.data || [],
    counterparts: counterparts?.data || [],
  };
}
