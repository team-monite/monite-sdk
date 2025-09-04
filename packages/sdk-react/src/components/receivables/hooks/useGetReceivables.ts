import { Services } from "@/api";
import { useMoniteContext } from "@/core/context/MoniteContext";

export const useGetReceivables = (
    query: Services['receivables']['getReceivables']['types']['parameters']['query'],
    enabled = true
  ) => {
    const { api } = useMoniteContext();
  
    return api.receivables.getReceivables.useQuery(
      {
        query,
      },
      { enabled }
    );
};