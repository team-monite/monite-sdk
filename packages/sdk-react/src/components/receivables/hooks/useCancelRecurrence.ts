import { useMoniteContext } from "@/core/context/MoniteContext";
import { getAPIErrorMessage } from "@/core/utils/getAPIErrorMessage";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { toast } from "react-hot-toast";

export const useCancelRecurrence = (recurrence_id: string, receivable_id: string) => {
    const { i18n } = useLingui();
    const { api, queryClient } = useMoniteContext();

    return api.recurrences.postRecurrencesIdCancel.useMutation(
      { path: { recurrence_id } },
      {
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
        onSuccess: async () => {
          await Promise.all([
            api.receivables.getReceivables.invalidateQueries(queryClient),
            api.receivables.getReceivablesId.invalidateQueries(
              { parameters: { path: { receivable_id } } },
              queryClient
            ),
            api.recurrences.getRecurrencesId.invalidateQueries(
              { parameters: { path: { recurrence_id } } },
              queryClient
            ),
          ]);
          toast.success(t(i18n)`Recurrence has been canceled`);
        },
      }
    );
};