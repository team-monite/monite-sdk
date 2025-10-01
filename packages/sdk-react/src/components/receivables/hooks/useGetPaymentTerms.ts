import { useMoniteContext } from "@/core/context/MoniteContext";

export const useGetPaymentTerms = () => {
  const { api } = useMoniteContext();

  return api.paymentTerms.getPaymentTerms.useQuery();
};