import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useCreateEntityBankAccount = (onCreate?: (id: string) => void) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.bankAccounts.postBankAccounts.useMutation(undefined, {
    onSuccess: async (bank) => {
      await api.bankAccounts.getBankAccounts.invalidateQueries(queryClient);
      onCreate && onCreate(bank?.id);
      toast.success(
        t(i18n)`Bank Account “${bank.display_name}” has been created.`
      );
    },

    onError: () => {
      toast.error(t(i18n)`Failed to create Bank Account.`);
    },
  });
};
