import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

export const useSendPurchaseOrderById = (purchaseOrderId: string) => {
  const { i18n } = useLingui();
  const { api, queryClient, entityId } = useMoniteContext();

  return api.payablePurchaseOrders.postPayablePurchaseOrdersIdSend.useMutation(
    {
      path: { purchase_order_id: purchaseOrderId },
      header: { 'x-monite-entity-id': entityId },
    },
    {
      onSuccess: async () => {
        await Promise.all([
          api.payablePurchaseOrders.getPayablePurchaseOrders.invalidateQueries(
            queryClient
          ),
          api.payablePurchaseOrders.getPayablePurchaseOrdersId.invalidateQueries(
            {
              parameters: { path: { purchase_order_id: purchaseOrderId } },
            },
            queryClient
          ),
        ]);

        toast.success(t(i18n)`Purchase order has been sent`);
      },
    }
  );
};
