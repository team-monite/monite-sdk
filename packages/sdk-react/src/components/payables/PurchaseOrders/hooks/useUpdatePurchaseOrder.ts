import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

export const useUpdatePurchaseOrder = () => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();

  return api.payablePurchaseOrders.patchPayablePurchaseOrdersId.useMutation(
    undefined,
    {
      onSuccess: async (purchaseOrder) => {
        await api.payablePurchaseOrders.getPayablePurchaseOrders.invalidateQueries(
          queryClient
        );
        await api.payablePurchaseOrders.getPayablePurchaseOrdersId.invalidateQueries(
          queryClient
        );

        if (purchaseOrder.counterpart && 'name' in purchaseOrder.counterpart) {
          return toast.success(
            t(
              i18n
            )`Purchase order for "${purchaseOrder.counterpart.name}" was updated`
          );
        }

        toast.success(t(i18n)`Purchase order has been updated`);
      },
      onError: (error) => {
        const errorMessage = getAPIErrorMessage(i18n, error);
        toast.error(t(i18n)`Failed to update purchase order: ${errorMessage}`);
      },
    }
  );
};
