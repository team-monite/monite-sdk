import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useSetDefaultBankAccount = (shouldInvalidate = true) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.bankAccounts.postBankAccountsIdMakeDefault.useMutation(undefined, {
    onSuccess: async () => {
      if (shouldInvalidate) {
        await api.bankAccounts.getBankAccounts.invalidateQueries(queryClient);
      }
      toast.success(t(i18n)`Bank Account has been set as default.`);
    },

    onError: () => {
      toast.error(t(i18n)`Failed to set Bank Account as default.`);
    },
  });
};
