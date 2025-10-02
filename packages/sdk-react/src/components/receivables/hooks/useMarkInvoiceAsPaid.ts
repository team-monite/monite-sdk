import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

export const useMarkInvoiceAsPaid = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdMarkAsPaid.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async () => {
        await Promise.all([
          api.receivables.getReceivablesId.invalidateQueries(
            {
              parameters: { path: { receivable_id } },
            },
            queryClient
          ),
        ]);

        toast.success(t(i18n)`Invoice has been marked as paid`);
      },
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        toast.error(t(i18n)`Failed to mark invoice as paid: ${errorMessage}`);
      },
    }
  );
};
