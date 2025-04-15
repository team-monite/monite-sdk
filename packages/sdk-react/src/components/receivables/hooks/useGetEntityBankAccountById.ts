import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetEntityBankAccountById = (bankId: string) => {
  const { api } = useMoniteContext();

  return api.bankAccounts.getBankAccountsId.useQuery(
    {
      path: {
        bank_account_id: bankId,
      },
    },
    {
      enabled: !!bankId,
    }
  );
};
