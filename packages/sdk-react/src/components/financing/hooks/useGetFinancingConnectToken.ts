import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const useGetFinancingConnectToken = () => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();

  return api.financingTokens.postFinancingTokens.useMutation(
    {},
    {
      onError: () => {
        toast.error(
          t(
            i18n
          )`The financing service is currently unavailable. Please reload the page or try again later.`
        );
      },
    }
  );
};
