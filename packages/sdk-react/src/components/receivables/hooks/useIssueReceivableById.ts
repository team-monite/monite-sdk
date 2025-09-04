import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

/**
 * Marks receivable as issued by provided id
 *
 * @see {@link https://docs.monite.com/reference/post_receivables_id_issue} Monite backend call API
 */
export const useIssueReceivableById = (receivable_id: string) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdIssue.useMutation(
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
          api.receivables.getReceivables.invalidateQueries(queryClient),
          api.receivables.getReceivablesIdPdfLink.resetQueries(
            {
              parameters: {
                path: {
                  receivable_id,
                },
              },
            },
            queryClient
          ),
        ]);

        toast.success(t(i18n)`${receivable.type} has been issued`);
      },
    }
  );
};
