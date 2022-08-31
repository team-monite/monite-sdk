import { PayableResponseSchema } from '@monite/sdk-api';

import { useTagList, useUpdatePayableById } from 'core/queries';
import { useCounterpartList } from 'core/queries/useCounterpart';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

export type UsePayableDetailsFormProps = {
  payable: PayableResponseSchema;
  debug?: boolean;
  onSubmit: () => void;
};

export default function usePayableDetailsForm({
  payable,
  debug,
  onSubmit,
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

  useEffect(() => {
    saveMutation.isSuccess && toast.success('Saved');
  }, [saveMutation.isSuccess]);

  return {
    isTagLoading,
    isCounterpartLoading,
    saveMutation,
    tags: tags?.data || [],
    counterparts: counterparts?.data || [],
  };
}
