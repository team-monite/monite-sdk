import { useMoniteContext } from '@/core/context/MoniteContext';
import { select, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

/**
 * Marks receivable as canceled by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_cancel} Monite backend call API
 */
export const useCancelReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdCancel.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async () => {
        const previousReceivable =
          api.receivables.getReceivablesId.getQueryData(
            {
              path: {
                receivable_id,
              },
            },
            queryClient
          );

        if (previousReceivable?.type === 'invoice')
          api.receivables.getReceivablesId.setQueryData(
            {
              path: {
                receivable_id,
              },
            },
            { ...previousReceivable, status: 'canceled' },
            queryClient
          );

        await api.receivables.getReceivables.invalidateQueries(queryClient);

        toast.success(
          t(i18n)({
            message: select(previousReceivable?.type ?? '', {
              credit_note: 'Credit Note has been canceled',
              invoice: 'Invoice has been canceled',
              quote: 'Quote has been canceled',
              other: 'Receivable has been canceled',
            }),
          })
        );
      },
    }
  );
};
