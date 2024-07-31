import { useMoniteContext } from '@/core/context/MoniteContext';

export const useCounterpartsBankAccountsList = (counterpartId?: string) => {
  const { api } = useMoniteContext();

  return api.counterparts.getCounterpartsIdBankAccounts.useQuery(
    {
      path: { counterpart_id: counterpartId ?? '' },
    },
    {
      enabled: Boolean(counterpartId),
    }
  );
};
