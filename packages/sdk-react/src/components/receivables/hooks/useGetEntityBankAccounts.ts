import { Services } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetEntityBankAccounts = (
  query?: Services['bankAccounts']['getBankAccounts']['types']['parameters']['query'],
  enabled = true
) => {
  const { api } = useMoniteContext();

  return api.bankAccounts.getBankAccounts.useQuery(
    {
      query,
    },
    { enabled }
  );
};
