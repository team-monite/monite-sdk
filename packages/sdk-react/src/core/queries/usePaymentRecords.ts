import { toast } from 'react-hot-toast';

import type { Services } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export const usePaymentRecords = (
  query: Services['paymentRecords']['getPaymentRecords']['types']['parameters']['query'],
  enabled = true
) => {
  const { api } = useMoniteContext();

  return api.paymentRecords.getPaymentRecords.useQuery(
    {
      query,
    },
    { enabled }
  );
};

export const useCreatePaymentRecord = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.paymentRecords.postPaymentRecords.useMutation(
    {},
    {
      onSuccess: async () => {
        await api.paymentRecords.getPaymentRecords.invalidateQueries(
          queryClient
        );

        return toast.success(t(i18n)`Payment record was created`);
      },
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        toast.error(t(i18n)`Failed to create payment record: ${errorMessage}`);
      },
    }
  );
};

export const usePaymentRecordById = (payment_record_id: string) => {
  const { api } = useMoniteContext();

  return api.paymentRecords.getPaymentRecordsId.useQuery({
    path: {
      payment_record_id,
    },
  });
};
