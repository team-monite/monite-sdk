import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

/**
 * Marks receivable as uncollectible by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_mark_as_uncollectible} Monite backend call API
 */
export const useMarkAsUncollectibleReceivableById = (
  receivable_id: string,
  onMarkAsUncollectible?: (receivable_id: string) => void
) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.receivables.postReceivablesIdMarkAsUncollectible.useMutation(
    {
      path: {
        receivable_id,
      },
    },
    {
      onSuccess: async (receivable) => {
        onMarkAsUncollectible?.(receivable_id);
        api.receivables.getReceivablesId.setQueryData(
          {
            path: {
              receivable_id,
            },
          },
          receivable,
          queryClient
        );

        await api.receivables.getReceivables.invalidateQueries(queryClient);

        toast.success(t(i18n)`Marked as uncollectible`);
      },
    }
  );
};
