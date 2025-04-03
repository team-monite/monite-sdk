import { useMoniteContext } from '@/core/context/MoniteContext';

export const useFinanceAnInvoice = () => {
  const { api } = useMoniteContext();

  return api.financingInvoices.postFinancingInvoices.useMutation(
    {},
    {
      onError: () => {},
    }
  );
};
