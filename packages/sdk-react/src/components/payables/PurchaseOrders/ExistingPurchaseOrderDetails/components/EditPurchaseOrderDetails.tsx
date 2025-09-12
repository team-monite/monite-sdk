import { components } from '@/api';
import { CreatePurchaseOrder } from '@/components/payables/PurchaseOrders/CreatePurchaseOrder';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCallback } from 'react';

export interface EditPurchaseOrderDetailsProps {
  purchaseOrder: PurchaseOrderResponse;
  onCancel: () => void;
  onUpdated: (purchaseOrder: PurchaseOrderResponse) => void;
}

export const EditPurchaseOrderDetails = (
  props: EditPurchaseOrderDetailsProps
) => (
  <MoniteScopedProviders>
    <EditPurchaseOrderDetailsContent {...props} />
  </MoniteScopedProviders>
);

const EditPurchaseOrderDetailsContent = ({
  purchaseOrder,
  onCancel,
  onUpdated,
}: EditPurchaseOrderDetailsProps) => {
  const handleSave = useCallback(
    (updatedData: PurchaseOrderResponse) => {
      onUpdated(updatedData);
    },
    [onUpdated]
  );

  return (
    <CreatePurchaseOrder
      type="purchase_order"
      existingPurchaseOrder={purchaseOrder}
      onUpdate={handleSave}
      onCancel={onCancel}
    />
  );
};

type PurchaseOrderResponse =
  components['schemas']['PurchaseOrderResponseSchema'];
