import { useMoniteContext } from '@/core/context/MoniteContext';
import { select, t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

/**
 * Issue a receivable and send PDF with an email
 *  to the counterpart
 */
export const useSendReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdSend.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async () => {
        await Promise.all([
          api.receivables.getReceivables.invalidateQueries(queryClient),
          api.receivables.getReceivablesId.invalidateQueries(
            {
              parameters: { path: { receivable_id } },
            },
            queryClient
          ),
        ]);

        const receivable = api.receivables.getReceivablesId.getQueryData(
          { path: { receivable_id } },
          queryClient
        );

        toast.success(
          t(i18n)({
            message: select(receivable?.type ?? '', {
              credit_note: 'Credit Note has been sent',
              invoice: 'Invoice has been sent',
              quote: 'Quote has been sent',
              other: 'Receivable has been sent',
            }),
          })
        );
      },
    }
  );
};
