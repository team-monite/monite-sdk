import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

export const useUpdateReceipt = (receipt_id: string) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.receipts.patchReceiptsId.useMutation(
    {
      path: {
        receipt_id,
      },
    },
    {
      onSuccess: () => {
        api.receipts.getReceiptsId.invalidateQueries(queryClient);
        api.receipts.getReceipts.invalidateQueries(queryClient);
        toast.success(t(i18n)`Receipt has been updated`);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
};
