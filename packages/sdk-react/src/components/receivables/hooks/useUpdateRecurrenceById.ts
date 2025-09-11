import { useMoniteContext } from "@/core/context/MoniteContext";
import { getAPIErrorMessage } from "@/core/utils/getAPIErrorMessage";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { toast } from "react-hot-toast";

export const useUpdateRecurrenceById = (recurrence_id: string, invoiceId: string) => {
    const { api, queryClient } = useMoniteContext();
    const { i18n } = useLingui();

    return api.recurrences.patchRecurrencesId.useMutation(
        {
          path: {
            recurrence_id,
          },
        },
        {
          onError(error) {
            toast.error(getAPIErrorMessage(i18n, error));
          },
          async onSuccess(updatedRecurrence) {
            api.recurrences.getRecurrencesId.setQueryData(
              { path: { recurrence_id: updatedRecurrence.id } },
              (previousRecurrence) => ({
                ...previousRecurrence,
                ...updatedRecurrence,
              }),
              queryClient
            );
  
            await Promise.all([
              api.receivables.getReceivablesId.invalidateQueries(
                {
                  parameters: { path: { receivable_id: invoiceId } },
                },
                queryClient
              ),
              api.receivables.getReceivables.invalidateQueries(queryClient),
            ]);
  
            toast.success(t(i18n)`Recurrence has been updated`);
          },
        }
    );
};
    