import { useMoniteContext } from '@/core/context/MoniteContext';

/**
 * Fetches receivable by provided `id`
 *
 * @see {@link https://docs.monite.com/reference/get_receivables_id} Monite backend call API
 */
export const useGetReceivableById = (
  receivable_id: string,
  enabled?: boolean
) => {
  const { api } = useMoniteContext();

  return api.receivables.getReceivablesId.useQuery(
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
