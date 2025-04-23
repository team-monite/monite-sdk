import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useUpdateEntityBankAccount = (onUpdate?: () => void) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  return api.bankAccounts.patchBankAccountsId.useMutation(undefined, {
    onSuccess: async (bank) => {
      toast.success(
        t(i18n)`Bank Account “${bank.display_name}” has been updated.`
      );

      api.bankAccounts.getBankAccountsId.setQueryData(
        {
          path: {
            bank_account_id: bank.id,
          },
        },
        (prevBankAccount) => ({
          ...prevBankAccount,
          ...bank,
        }),
        queryClient
      );

      await api.bankAccounts.getBankAccounts.invalidateQueries(queryClient);
      onUpdate && onUpdate();
    },

    onError: () => {
      toast.error(t(i18n)`Failed to update Bank Account.`);
    },
  });
};
