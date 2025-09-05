import { useMoniteContext } from '@/core/context/MoniteContext';
import { select, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

/**
 * Marks receivable as deleted by provided id
 *
 * @see {@link https://docs.monite.com/reference/delete_receivables_id} Monite backend call API
 */
export const useDeleteReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.deleteReceivablesId.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: () => {
        const previousReceivable =
          api.receivables.getReceivablesId.getQueryData(
            {
              path: {
                receivable_id,
              },
            },
            queryClient
          );

        api.receivables.getReceivables.invalidateQueries(queryClient);

        toast.success(
          t(i18n)({
            message: select(previousReceivable?.type ?? '', {
              credit_note: 'Credit Note has been deleted',
              invoice: 'Invoice has been deleted',
              quote: 'Quote has been deleted',
              other: 'Receivable has been deleted',
            }),
          })
        );
      },
    }
  );
};
