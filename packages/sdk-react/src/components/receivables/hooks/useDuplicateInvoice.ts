import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useDuplicateInvoice = (onDuplicate?: (id: string) => void) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.receivables.postReceivablesIdClone.useMutation(undefined, {
    onSuccess: async (data) => {
      await api.receivables.getReceivables.invalidateQueries(queryClient);
      onDuplicate && onDuplicate(data?.id);
      toast.success(t(i18n)`Invoice duplicate has been created.`);
    },
    onError: (error: any) => {
      toast.error(
        error?.detail?.[0]?.msg || t(i18n)`Failed to duplicate invoice.`
      );
    },
  });
};
