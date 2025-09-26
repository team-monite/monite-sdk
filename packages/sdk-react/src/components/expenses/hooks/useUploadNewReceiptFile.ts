import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

export const useUploadNewReceiptFile = () => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  const receiptUploadFromFileMutation =
    api.receipts.postReceiptsUploadFromFile.useMutation(
      {},
      {
        onSuccess: () => {
          api.receipts.getReceipts.invalidateQueries(queryClient);
          toast.success(t(i18n)`Receipt successfully uploaded`);
        },
        onError: () => {
          toast.error(t(i18n)`Failed to upload receipt`);
        },
      }
    );

  return { receiptUploadFromFileMutation };
};
