import { PayableResponseSchema } from '@monite/sdk-api';

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

  const saveMutation = useUpdatePayableById(payable.id);

  return {
    isTagLoading,
    isCounterpartLoading,
    saveMutation,
    tags: tags?.data || [],
    counterparts: counterparts?.data || [],
  };
}
