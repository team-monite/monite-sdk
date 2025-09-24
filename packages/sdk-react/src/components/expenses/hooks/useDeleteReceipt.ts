import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

export const useDeleteReceipt = (receipt_id: string) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  return api.receipts.deleteReceiptsId.useMutation(
    {
      path: {
        receipt_id,
      },
    },
    {
      onSuccess: () => {
        toast.success(t(i18n)`Receipt has been moved to trash.`);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
};
