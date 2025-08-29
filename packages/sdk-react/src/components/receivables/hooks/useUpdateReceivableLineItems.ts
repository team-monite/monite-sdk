import { useMoniteContext } from "@/core/context/MoniteContext";
import { getAPIErrorMessage } from "@/core/utils/getAPIErrorMessage";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { toast } from "react-hot-toast";

/**
 * Update receivable line items
 *
 * @param receivable_id - Receivable id
 */
export const useUpdateReceivableLineItems = (receivable_id: string) => {
    const { api, queryClient } = useMoniteContext();
    const { i18n } = useLingui();
  
    return api.receivables.putReceivablesIdLineItems.useMutation(
      {
        path: {
          receivable_id,
        },
      },
      {
        onSuccess: async () => {
          await api.receivables.getReceivablesId.invalidateQueries(
            {
              parameters: {
                path: {
                  receivable_id,
                },
              },
            },
            queryClient
          );
        },
        onError: (error) => {
          const errorMessage = getAPIErrorMessage(i18n, error);
          toast.error(
            t(i18n)`Failed to update receivable line items: ${errorMessage}`
          );
        },
      }
    );
  };