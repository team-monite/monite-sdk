import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

export const useCreateReceivable = () => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();

  return api.receivables.postReceivables.useMutation(
    {},
    {
      onSuccess: async (receivable) => {
        if (receivable.counterpart_name) {
          return toast.success(
            t(i18n)`Invoice to “${receivable.counterpart_name}” was created`
          );
        }

        toast.success(t(i18n)`${receivable.type} has been created`);
      },
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        toast.error(t(i18n)`Failed to create receivable: ${errorMessage}`);
      },
    }
  );
};
