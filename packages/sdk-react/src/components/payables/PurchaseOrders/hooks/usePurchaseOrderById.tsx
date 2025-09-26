import { useMoniteContext } from '@/core/context/MoniteContext';

export function usePurchaseOrderById(purchaseOrderId: string) {
  const { api, entityId } = useMoniteContext();

  return api.payablePurchaseOrders.getPayablePurchaseOrdersId.useQuery(
    {
      path: { purchase_order_id: purchaseOrderId },
      header: { 'x-monite-entity-id': entityId },
    },
    { enabled: Boolean(entityId && purchaseOrderId) }
  );
}
