import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

/**
 * Update receivable by provided `id`
 *
 * @param receivable_id - Receivable id
 */
export const useUpdateReceivable = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.patchReceivablesId.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async (receivable) => {
        api.receivables.getReceivablesId.setQueryData(
          {
            path: {
              receivable_id,
            },
          },
          receivable,
          queryClient
        );

        await Promise.all([
          api.receivables.getReceivablesIdPdfLink.resetQueries(
            { parameters: { path: { receivable_id } } },
            queryClient
          ),
          api.receivables.getReceivables.invalidateQueries(queryClient),
        ]);

        toast.success(t(i18n)`${receivable.type} has been updated`);
      },
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        toast.error(t(i18n)`Failed to update receivable: ${errorMessage}`);
      },
    }
  );
};
