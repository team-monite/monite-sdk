import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useDeleteEntityBankAccount = (onDelete?: () => void) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.bankAccounts.deleteBankAccountsId.useMutation(undefined, {
    onSuccess: async () => {
      await api.bankAccounts.getBankAccounts.invalidateQueries(queryClient);
      onDelete && onDelete();
      toast.success(t(i18n)`Bank Account has been deleted.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to delete Bank Account.`);
    },
  });
};
