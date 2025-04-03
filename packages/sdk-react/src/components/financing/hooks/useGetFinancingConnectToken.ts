import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetFinancingConnectToken = () => {
  const { api } = useMoniteContext();

  return api.financingTokens.postFinancingTokens.useMutation(
    {},
    {
      onError: () => {},
    }
  );
};
