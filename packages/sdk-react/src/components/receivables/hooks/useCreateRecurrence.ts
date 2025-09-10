import { useMoniteContext } from "@/core/context/MoniteContext";
import { getAPIErrorMessage } from "@/core/utils/getAPIErrorMessage";
import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { toast } from "react-hot-toast";

export const useCreateRecurrence = () => {
    const { api } = useMoniteContext();
    const { i18n } = useLingui();
    
    return api.recurrences.postRecurrences.useMutation(
        undefined,
        {
          onError(error) {
            toast.error(getAPIErrorMessage(i18n, error));
          },
          onSuccess() {
            toast.success(t(i18n)`Recurrence has been created`);
          },
        }
      );
};