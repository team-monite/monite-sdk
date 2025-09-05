import { useMoniteContext } from '@/core/context/MoniteContext';

export const useGetReceivablePDFById = (
  receivable_id: string,
  enabled?: boolean
) => {
  const { api } = useMoniteContext();

  return api.receivables.getReceivablesIdPdfLink.useQuery(
    {
      path: {
        receivable_id,
      },
    },
    {
      enabled,
    }
  );
};
